import { ethers } from 'ethers';
import { IntentListener } from './services/IntentListener';
import { RouteCalculator } from './services/RouteCalculator';
import { XCMExecutor } from './services/XCMExecutor';
import { ContractInteraction } from './services/ContractInteraction';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

class SolverBot {
  private intentListener: IntentListener;
  private routeCalculator: RouteCalculator;
  private xcmExecutor: XCMExecutor;
  private contractInteraction: ContractInteraction;
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor() {
    // Initialize provider and wallet
    this.provider = new ethers.JsonRpcProvider(process.env.POLKADOT_HUB_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.SOLVER_PRIVATE_KEY!, this.provider);

    // Initialize services
    this.contractInteraction = new ContractInteraction(this.wallet);
    this.routeCalculator = new RouteCalculator(this.provider);
    this.xcmExecutor = new XCMExecutor(this.wallet);
    this.intentListener = new IntentListener(
      this.provider,
      this.contractInteraction,
      this.routeCalculator,
      this.xcmExecutor,
      this.wallet
    );

    logger.info('Solver Bot initialized', {
      address: this.wallet.address,
      chainId: process.env.CHAIN_ID,
    });
  }

  async start() {
    try {
      // Register as solver if not already registered
      await this.registerSolver();

      // Start listening for intents
      logger.info('Starting intent listener...');
      await this.intentListener.start();

      logger.info('✅ Solver Bot is running');
    } catch (error) {
      logger.error('Failed to start solver bot', { error });
      process.exit(1);
    }
  }

  private async registerSolver() {
    try {
      const isRegistered = await this.contractInteraction.isSolverRegistered(
        this.wallet.address
      );

      if (!isRegistered) {
        logger.info('Registering as solver...');
        const stake = ethers.parseEther('1'); // 1 DOT stake
        await this.contractInteraction.registerSolver(stake);
        logger.info('✅ Successfully registered as solver');
      } else {
        logger.info('Already registered as solver');
      }
    } catch (error) {
      logger.error('Failed to register as solver', { error });
      throw error;
    }
  }

  async stop() {
    logger.info('Stopping solver bot...');
    this.intentListener.stop();
    process.exit(0);
  }
}

// Main execution
const bot = new SolverBot();

bot.start().catch((error) => {
  logger.error('Fatal error', { error });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => bot.stop());
process.on('SIGTERM', () => bot.stop());
