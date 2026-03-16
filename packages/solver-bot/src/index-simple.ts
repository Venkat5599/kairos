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
const RPC_URL = process.env.RPC_URL || 'https://eth-rpc-testnet.polkadot.io';
const SOLVER_PRIVATE_KEY = process.env.SOLVER_PRIVATE_KEY!;
const INTENT_REGISTRY_ADDRESS = process.env.INTENT_REGISTRY_ADDRESS!;
const MIN_REWARD = ethers.parseEther(process.env.SOLVER_MIN_REWARD || '0.001');
const POLL_INTERVAL = parseInt(process.env.SOLVER_POLL_INTERVAL || '10000');

// Contract ABIs
const INTENT_REGISTRY_ABI = [
  'function getAllIntentIds() view returns (bytes32[])',
  'function intents(bytes32) view returns (bytes32 id, address creator, string description, bytes data, uint256 reward, uint256 deadline, uint8 status, address solver, uint256 createdAt, uint256 executedAt)',
  'function solvers(address) view returns (address solverAddress, uint256 stake, uint256 reputation, uint256 totalExecuted, uint256 totalFailed, bool isActive, uint256 registeredAt)',
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
  private processedIntents: Set<string> = new Set();

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

      if (balance < ethers.parseEther('0.0015')) {
        console.error('❌ Insufficient balance! Need at least 0.0015 DEV');
        console.log('   Get tokens from: https://faucet.moonbeam.network/');
        process.exit(1);
      }

      // Register as solver if needed
      await this.registerIfNeeded();

      // Start listening
      this.isRunning = true;
      console.log('👂 Polling for new intents...\n');

      // Use polling instead of event listeners (more reliable on public RPCs)
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
        isRegistered = solverInfo[0]; // isActive is at index 0
        
        if (isRegistered) {
          console.log('✅ Already registered as solver');
          console.log(`   Stake: ${ethers.formatEther(solverInfo[1])} DEV`);
          console.log(`   Completed: ${solverInfo[2]}`);
          return;
        }
      } catch (error) {
        // If checking fails, assume not registered
        console.log('⚠️  Could not check registration status, attempting to register...');
      }

      // Check if we have enough balance to register
      const balance = await this.provider.getBalance(this.wallet.address);
      const minRequired = ethers.parseEther('0.1'); // Need at least 0.1 DEV to register
      
      if (balance < minRequired) {
        console.log('⚠️  Not registered and insufficient balance to register');
        console.log(`   Need at least 0.1 DEV, have ${ethers.formatEther(balance)} DEV`);
        console.log('   Skipping registration, will only process if already registered...\n');
        return;
      }

      // Register as solver with available balance (leave some for gas)
      console.log('📝 Registering as solver...');
      const gasReserve = ethers.parseEther('0.01'); // Reserve for gas
      const stake = balance - gasReserve;
      
      console.log(`   Staking: ${ethers.formatEther(stake)} DEV`);
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
    console.log('🔍 Polling for pending intents...\n');
    
    while (this.isRunning) {
      try {
        // Get all intent IDs
        const intentIds = await this.contract.getAllIntentIds();
        const total = intentIds.length;
        
        if (total === 0) {
          console.log('📋 No intents found yet. Waiting...');
        }
        
        let foundPending = 0;
        
        // Check ALL intents, not just new ones
        for (let i = 0; i < total; i++) {
          try {
            const intentId = intentIds[i];
            
            // Skip if already processed
            const intentIdStr = intentId.toString();
            if (this.processedIntents.has(intentIdStr)) continue;

            // Get intent details using the intentId
            const intent = await this.contract.intents(intentId);
            const status = Number(intent.status); // Convert to number explicitly
            
            // Debug: Log the intent details
            console.log(`   Intent ${i}: status=${status} (type: ${typeof status}), description="${intent.description.substring(0, 30)}..."`);

            if (status === 0) { // Pending
              foundPending++;
              console.log(`\n🔔 Pending Intent Found!`);
              console.log(`   ID: ${intentId}`);
              console.log(`   Description: ${intent.description}`);
              console.log(`   Reward: ${ethers.formatEther(intent.reward)} DEV`);
              
              await this.processIntent(intentId, intent.description, intent.reward);
              this.processedIntents.add(intentIdStr);
            } else if (status === 2 || status === 3 || status === 4) {
              // Completed, Failed, or Cancelled - mark as processed
              this.processedIntents.add(intentIdStr);
            }
          } catch (error: any) {
            // Skip this intent if there's an error reading it
            if (!error.message.includes('does not exist')) {
              console.error(`Error checking intent ${i}:`, error.message);
            }
          }
        }
        
        if (foundPending === 0) {
          console.log(`📋 Found ${total} intent(s), 0 pending. Waiting for new intents...`);
        }
      } catch (error: any) {
        // Only log significant errors
        if (!error.message.includes('does not exist')) {
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
      if (parsed.destinationChain) {
        console.log(`   🌉 Destination Chain: ${parsed.destinationChain}`);
      }

      // Step 1: Claim the intent
      console.log(`\n📝 Step 1: Claiming intent...`);
      const claimTx = await this.contract.executeIntent(intentId);
      const claimReceipt = await claimTx.wait();
      console.log(`✅ Intent claimed! (Block: ${claimReceipt?.blockNumber})`);

      // Step 2: Execute based on type
      if (parsed.type === 'CROSS_CHAIN_TRANSFER') {
        // Cross-chain transfer via XCM Bridge
        console.log(`\n🌉 Step 2: Executing cross-chain transfer...`);
        await this.executeCrossChainTransfer(parsed, intentId, reward);
      } else {
        // Same-chain transfer
        console.log(`\n💸 Step 2: Executing transfer...`);
        
        // Ensure address is properly formatted (no ENS resolution)
        const toAddress = parsed.recipient.toLowerCase();
        console.log(`   Sending to: ${toAddress}`);
        
        const executeTx = await this.wallet.sendTransaction({
          to: toAddress,
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
      }

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

  private parseIntent(description: string): { type: string; recipient: string; amount: bigint; destinationChain?: string } | null {
    console.log(`   🔍 Parsing: "${description}"`);
    
    // Find 0x in the string
    const oxIndex = description.indexOf('0x');
    console.log(`   0x found at index: ${oxIndex}`);
    if (oxIndex >= 0) {
      const addressPart = description.substring(oxIndex, oxIndex + 42);
      console.log(`   Address part (42 chars): "${addressPart}" (length: ${addressPart.length})`);
    }
    
    // Extract address first (accept 39-42 hex chars to handle edge cases)
    const addressMatch = description.match(/(0x[a-fA-F0-9]{39,42})/);
    console.log(`   Address regex result:`, addressMatch);
    
    if (!addressMatch) {
      console.log(`   ❌ No valid address found`);
      return null;
    }
    const recipient = addressMatch[1];
    console.log(`   ✅ Found address: ${recipient}`);
    
    // Clean the description
    const cleaned = description.trim().toLowerCase();
    
    // Extract amount
    const amountMatch = cleaned.match(/send\s+([\d.]+)\s+(?:pas|dev)/);
    if (!amountMatch) {
      console.log(`   ❌ No valid amount found`);
      return null;
    }
    const amount = amountMatch[1];
    console.log(`   ✅ Found amount: ${amount}`);
    
    // Check if cross-chain
    const chainMatch = cleaned.match(/to\s+(polkadot|assethub|astar|moonbeam|moonriver)\s+0x/);
    
    if (chainMatch) {
      console.log(`   ✅ Cross-chain transfer to: ${chainMatch[1]}`);
      return {
        type: 'CROSS_CHAIN_TRANSFER',
        recipient,
        amount: ethers.parseEther(amount),
        destinationChain: chainMatch[1],
      };
    }
    
    console.log(`   ✅ Same-chain transfer`);
    return {
      type: 'TRANSFER',
      recipient,
      amount: ethers.parseEther(amount),
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeCrossChainTransfer(
    parsed: { recipient: string; amount: bigint; destinationChain?: string },
    intentId: string,
    reward: bigint
  ) {
    try {
      // Map chain names to parachain IDs (REAL Polkadot ecosystem IDs)
      const chainIds: { [key: string]: number } = {
        'polkadot': 0,      // Polkadot Relay Chain
        'assethub': 1000,   // Asset Hub (Statemint)
        'moonbeam': 2004,   // Moonbeam
        'moonriver': 2023,  // Moonriver
        'astar': 2006,      // Astar
        'ethereum': 1000,   // Default to Asset Hub for now
      };

      const destinationChainId = chainIds[parsed.destinationChain?.toLowerCase() || 'polkadot'] || 0;

      console.log(`   🌉 REAL XCM TRANSFER via Xtokens Precompile`);
      console.log(`   Target Chain ID: ${destinationChainId} (${parsed.destinationChain || 'Polkadot'})`);
      console.log(`   Recipient: ${parsed.recipient}`);
      console.log(`   Amount: ${ethers.formatEther(parsed.amount)} DEV`);

      // Convert Ethereum address to bytes32 for Polkadot AccountId32
      // Remove 0x prefix and pad to 32 bytes
      const recipientBytes32 = ethers.zeroPadValue(parsed.recipient, 32);

      console.log(`   Recipient (bytes32): ${recipientBytes32}`);

      // Get XCM Bridge contract with REAL XCM function
      const XCM_BRIDGE_ABI = [
        'function sendRealXCMTransfer(uint32 destinationChain, bytes32 recipient, uint256 amount) payable returns (bool)',
      ];
      
      const bridgeContract = new ethers.Contract(
        process.env.XCM_BRIDGE_ADDRESS || '0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234',
        XCM_BRIDGE_ABI,
        this.wallet
      );

      console.log(`   📡 Calling Xtokens precompile...`);
      
      // Send REAL XCM transfer via Xtokens precompile
      const bridgeTx = await bridgeContract.sendRealXCMTransfer(
        destinationChainId,
        recipientBytes32,
        parsed.amount,
        { value: parsed.amount }
      );

      const bridgeReceipt = await bridgeTx.wait();
      console.log(`✅ REAL XCM transfer sent!`);
      console.log(`   Hash: ${bridgeTx.hash}`);
      console.log(`   Block: ${bridgeReceipt?.blockNumber}`);
      console.log(`   🔍 Check on Polkadot explorer: https://polkadot.subscan.io/`);

      // Mark intent as completed
      console.log(`\n✅ Step 3: Marking as completed...`);
      const completeTx = await this.contract.completeIntent(
        intentId,
        ethers.toUtf8Bytes(bridgeTx.hash)
      );
      const completeReceipt = await completeTx.wait();
      console.log(`✅ Intent completed! (Block: ${completeReceipt?.blockNumber})`);
      console.log(`💰 Reward claimed: ${ethers.formatEther(reward)} DEV`);

      console.log(`\n🎉 SUCCESS! Real cross-chain intent executed via XCM!\n`);

    } catch (error: any) {
      console.error(`❌ Cross-chain transfer failed:`, error.message);
      throw error;
    }
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
