const { ethers } = require('ethers');
require('dotenv').config();

const RPC_URL = process.env.RPC_URL || 'https://eth-rpc-testnet.polkadot.io';
const SOLVER_PRIVATE_KEY = process.env.SOLVER_PRIVATE_KEY;
const INTENT_REGISTRY_ADDRESS = process.env.INTENT_REGISTRY_ADDRESS;

const INTENT_REGISTRY_ABI = [
  'function registerSolver() external payable',
  'function solvers(address) view returns (address solverAddress, uint256 stake, uint256 reputation, uint256 totalExecuted, uint256 totalFailed, bool isActive, uint256 registeredAt)',
];

async function main() {
  console.log('🔧 Registering Solver with Stake...\n');
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(SOLVER_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(INTENT_REGISTRY_ADDRESS, INTENT_REGISTRY_ABI, wallet);
  
  console.log(`Solver Address: ${wallet.address}`);
  console.log(`Registry: ${INTENT_REGISTRY_ADDRESS}`);
  console.log(`Network: ${RPC_URL}\n`);
  
  // Check current balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`Current Balance: ${ethers.formatEther(balance)} PAS`);
  
  if (balance < ethers.parseEther('1.1')) {
    console.error('❌ Insufficient balance! Need at least 1.1 PAS (1 for stake + 0.1 for gas)');
    process.exit(1);
  }
  
  // Check if already registered
  try {
    const solverInfo = await contract.solvers(wallet.address);
    if (solverInfo.isActive && solverInfo.stake > 0) {
      console.log('✅ Already registered as active solver');
      console.log(`   Stake: ${ethers.formatEther(solverInfo.stake)} PAS`);
      console.log(`   Reputation: ${solverInfo.reputation}`);
      console.log(`   Total Executed: ${solverInfo.totalExecuted}`);
      return;
    }
  } catch (error) {
    // Continue with registration
  }
  
  // Register with 1 PAS stake
  console.log('\n📝 Registering with 1 PAS stake...');
  const tx = await contract.registerSolver({ value: ethers.parseEther('1.0') });
  console.log(`Transaction sent: ${tx.hash}`);
  
  console.log('⏳ Waiting for confirmation...');
  const receipt = await tx.wait();
  console.log(`✅ Registered successfully!`);
  console.log(`   Block: ${receipt.blockNumber}`);
  console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
  
  // Verify registration
  const solverInfo = await contract.solvers(wallet.address);
  console.log('\n✅ Solver Info:');
  console.log(`   Address: ${solverInfo.solverAddress}`);
  console.log(`   Stake: ${ethers.formatEther(solverInfo.stake)} PAS`);
  console.log(`   Active: ${solverInfo.isActive}`);
  console.log(`   Reputation: ${solverInfo.reputation}`);
  
  console.log('\n🎉 Solver is now ready to execute intents!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
