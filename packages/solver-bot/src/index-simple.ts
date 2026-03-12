/**
 * Kairos Solver Bot - Simplified Production Version
 * 
 * This bot:
 * 1. Listens for new intents on IntentRegistry
 * 2. Parses the intent description
 * 3. Executes the transaction
 * 4. Marks the intent as completed
 */

import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const RPC_URL = process.env.RPC_URL || 'https://rpc.api.moonbase.moonbeam.network';
const SOLVER_PRIVATE_KEY = process.env.SOLVER_PRIVATE_KEY!;
const INTENT_REGISTRY_ADDRESS = process.env.INTENT_REGISTRY_ADDRESS!;
const MIN_REWARD = ethers.parseEther(process.env.SOLVER_MIN_REWARD || '0.001');
const POLL_INTERVAL = parseInt(process.env.SOLVER_POLL_INTERVAL || '10000');

// Contract ABIs
const INTENT_REGISTRY_ABI = [
  'function intentCount() view returns (uint256)',
  'function intents(uint256) view returns (address creator, string description, bytes data, uint256 reward, uint256 deadline, uint8 status, address solver, uint256 createdAt)',
  'function solvers(address) view returns (bool isActive, uint256 stake, uint256 completedIntents, uint256 failedIntents)',
  'function executeIntent(bytes32 intentId) external',
  'function completeIntent(bytes32 intentId, bytes result) external',
  'function failIntent(bytes32 intentId, string reason) external',
  'function registerSolver() external payable',
  'event IntentCreated(bytes32 indexed intentId, address indexed creator, string description, uint256 reward, uint256 deadline)',
];

class SimpleSolverBot {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private isRunning: boolean = false;
  private processedIntents: Set<number> = new Set();

  constructor() {
    console.log('🤖 Initializing Kairos Solver Bot...');
    
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.wallet = new ethers.Wallet(SOLVER_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      INTENT_REGISTRY_ADDRESS,
      INTENT_REGISTRY_ABI,
      this.wallet
    );

    console.log(`✅ Solver Address: ${this.wallet.address}`);
    console.log(`✅ Network: ${RPC_URL}`);
    console.log(`✅ Contract: ${INTENT_REGISTRY_ADDRESS}`);
  }

  async start() {
    try {
      // Check balance
      const balance = await this.provider.getBalance(this.wallet.address);
      console.log(`💰 Balance: ${ethers.formatEther(balance)} DEV`);

      if (balance < ethers.parseEther('0.1')) {
        console.error('❌ Insufficient balance! Need at least 0.1 DEV');
        process.exit(1);
      }

      // Register as solver if needed
      await this.registerIfNeeded();

      // Start listening
      this.isRunning = true;
      console.log('👂 Listening for new intents...\n');

      // Listen for IntentCreated events
      this.contract.on('IntentCreated', async (intentId, creator, description, reward, deadline) => {
        console.log(`\n🔔 New Intent Detected!`);
        console.log(`   ID: ${intentId}`);
        console.log(`   Description: ${description}`);
        console.log(`   Reward: ${ethers.formatEther(reward)} DEV`);
        
        // Process immediately
        try {
          await this.processIntent(intentId, description, reward);
        } catch (error: any) {
          console.error(`Error processing intent:`, error.message);
        }
      });

      // Also poll for existing pending intents
      this.pollPendingIntents();

    } catch (error: any) {
      console.error('❌ Failed to start:', error.message);
      process.exit(1);
    }
  }

  private async registerIfNeeded() {
    try {
      // Try to check if already registered
      let isRegistered = false;
      
      try {
        const solverInfo = await this.contract.solvers(this.wallet.address);
        isRegistered = solverInfo[0]; // isActive is first field
        
        if (isRegistered) {
          console.log('✅ Already registered as solver');
          console.log(`   Stake: ${ethers.formatEther(solverInfo[1])} DEV`);
          console.log(`   Completed: ${solverInfo[2]}`);
          console.log(`   Failed: ${solverInfo[3]}\n`);
          return;
        }
      } catch (error) {
        // If checking fails, assume not registered
        console.log('⚠️  Could not check registration status, attempting to register...');
      }

      // Register as solver
      console.log('📝 Registering as solver...');
      const stake = ethers.parseEther('1.0');
      const tx = await this.contract.registerSolver({ value: stake });
      console.log(`   Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Successfully registered as solver!`);
      console.log(`   Block: ${receipt?.blockNumber}\n`);
      
    } catch (error: any) {
      // If registration fails because already registered, that's okay
      if (error.message.includes('Already registered')) {
        console.log('✅ Already registered as solver\n');
        return;
      }
      
      console.error('❌ Registration failed:', error.message);
      throw error;
    }
  }

  private async pollPendingIntents() {
    while (this.isRunning) {
      try {
        const count = await this.contract.intentCount();
        const total = Number(count);

        // Check all intents for pending ones
        for (let i = 0; i < total; i++) {
          if (this.processedIntents.has(i)) continue;

          try {
            const intent = await this.contract.intents(i);
            const status = intent[5]; // status is at index 5

            if (status === 0) { // Pending
              // Generate intent ID (same way contract does it)
              const intentId = ethers.keccak256(
                ethers.solidityPacked(
                  ['address', 'uint256'],
                  [intent[0], i] // creator address and index
                )
              );
              
              await this.processIntent(intentId, intent[1], intent[3]);
              this.processedIntents.add(i);
            } else if (status === 2 || status === 3 || status === 4) {
              // Completed, Failed, or Cancelled - mark as processed
              this.processedIntents.add(i);
            }
          } catch (error: any) {
            // Skip this intent if there's an error reading it
            if (!error.message.includes('could not decode')) {
              console.error(`Error checking intent ${i}:`, error.message);
            }
          }
        }
      } catch (error: any) {
        // Only log if it's not a decoding error
        if (!error.message.includes('could not decode')) {
          console.error('Error polling:', error.message);
        }
      }

      await this.sleep(POLL_INTERVAL);
    }
  }

  private async processIntent(intentId: string, description: string, reward: bigint) {
    try {
      // Check if reward is sufficient
      if (reward < MIN_REWARD) {
        console.log(`⏭️  Skipping - reward too low (${ethers.formatEther(reward)} DEV)`);
        return;
      }

      // Parse the intent
      const parsed = this.parseIntent(description);
      
      if (!parsed) {
        console.log(`⏭️  Skipping - could not parse intent: "${description}"`);
        return;
      }

      console.log(`\n🎯 Processing Intent:`);
      console.log(`   Type: ${parsed.type}`);
      console.log(`   To: ${parsed.recipient}`);
      console.log(`   Amount: ${ethers.formatEther(parsed.amount)} DEV`);

      // Step 1: Claim the intent
      console.log(`\n📝 Step 1: Claiming intent...`);
      const claimTx = await this.contract.executeIntent(intentId);
      const claimReceipt = await claimTx.wait();
      console.log(`✅ Intent claimed! (Block: ${claimReceipt?.blockNumber})`);

      // Step 2: Execute the actual transaction
      console.log(`\n💸 Step 2: Executing transfer...`);
      const executeTx = await this.wallet.sendTransaction({
        to: parsed.recipient,
        value: parsed.amount,
      });
      const executeReceipt = await executeTx.wait();
      console.log(`✅ Transfer completed!`);
      console.log(`   Hash: ${executeTx.hash}`);
      console.log(`   Block: ${executeReceipt?.blockNumber}`);

      // Step 3: Mark as completed
      console.log(`\n✅ Step 3: Marking as completed...`);
      const completeTx = await this.contract.completeIntent(
        intentId,
        ethers.toUtf8Bytes(executeTx.hash)
      );
      const completeReceipt = await completeTx.wait();
      console.log(`✅ Intent completed! (Block: ${completeReceipt?.blockNumber})`);
      console.log(`💰 Reward claimed: ${ethers.formatEther(reward)} DEV`);

      console.log(`\n🎉 SUCCESS! Intent fully executed.\n`);

    } catch (error: any) {
      console.error(`\n❌ Error processing intent:`, error.message);
      
      // Try to mark as failed
      try {
        const failTx = await this.contract.failIntent(intentId, error.message.slice(0, 100));
        await failTx.wait();
        console.log(`⚠️  Intent marked as failed\n`);
      } catch (failError: any) {
        console.error(`❌ Could not mark as failed:`, failError.message);
      }
    }
  }

  private parseIntent(description: string): { type: string; recipient: string; amount: bigint } | null {
    // Pattern: "Send X DEV to 0x..."
    const sendPattern = /send\s+([\d.]+)\s+dev\s+to\s+(0x[a-fA-F0-9]{40})/i;
    const match = description.match(sendPattern);
    
    if (match) {
      return {
        type: 'TRANSFER',
        recipient: match[2],
        amount: ethers.parseEther(match[1]),
      };
    }

    // Pattern: "Transfer X DEV to 0x..."
    const transferPattern = /transfer\s+([\d.]+)\s+dev\s+to\s+(0x[a-fA-F0-9]{40})/i;
    const transferMatch = description.match(transferPattern);
    
    if (transferMatch) {
      return {
        type: 'TRANSFER',
        recipient: transferMatch[2],
        amount: ethers.parseEther(transferMatch[1]),
      };
    }

    return null;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    console.log('\n👋 Stopping solver bot...');
    this.isRunning = false;
    this.contract.removeAllListeners();
    process.exit(0);
  }
}

// Start the bot
const bot = new SimpleSolverBot();
bot.start();

// Graceful shutdown
process.on('SIGINT', () => bot.stop());
process.on('SIGTERM', () => bot.stop());
