import { ethers } from 'ethers';
import { ContractInteraction } from './ContractInteraction';
import { RouteCalculator } from './RouteCalculator';
import { XCMExecutor } from './XCMExecutor';
import { logger } from '../utils/logger';
import axios from 'axios';

const INTENT_REGISTRY_ABI = [
  'event IntentCreated(bytes32 indexed intentId, address indexed creator, string description, uint256 reward, uint256 deadline)',
  'event IntentExecuting(bytes32 indexed intentId, address indexed solver)',
  'event IntentCompleted(bytes32 indexed intentId, address indexed solver, bytes result)',
];

export class IntentListener {
  private contract: ethers.Contract;
  private isRunning: boolean = false;
  private pollInterval: number;

  constructor(
    private provider: ethers.JsonRpcProvider,
    private contractInteraction: ContractInteraction,
    private routeCalculator: RouteCalculator,
    private xcmExecutor: XCMExecutor,
    private wallet: ethers.Wallet
  ) {
    this.contract = new ethers.Contract(
      process.env.INTENT_REGISTRY_ADDRESS!,
      INTENT_REGISTRY_ABI,
      this.provider
    );
    this.pollInterval = parseInt(process.env.SOLVER_POLL_INTERVAL || '5000');
  }

  async start() {
    this.isRunning = true;

    // Listen for IntentCreated events
    this.contract.on('IntentCreated', async (intentId, creator, description, reward, deadline) => {
      logger.info('New intent detected', {
        intentId,
        creator,
        description,
        reward: ethers.formatEther(reward),
      });

      await this.processIntent(intentId);
    });

    // Also poll for pending intents periodically
    this.pollPendingIntents();

    logger.info('Intent listener started');
  }

  private async pollPendingIntents() {
    while (this.isRunning) {
      try {
        const pendingIntents = await this.fetchPendingIntents();

        for (const intent of pendingIntents) {
          await this.processIntent(intent.id);
        }
      } catch (error) {
        logger.error('Error polling pending intents', { error });
      }

      await this.sleep(this.pollInterval);
    }
  }

  private async fetchPendingIntents() {
    try {
      const response = await axios.get(`${process.env.BACKEND_API_URL}/intents/pending`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching pending intents from API', { error });
      return [];
    }
  }

  private async processIntent(intentId: string) {
    try {
      // Get intent details
      const intent = await this.contractInteraction.getIntent(intentId);

      if (!intent || intent.status !== 0) {
        // Not pending
        return;
      }

      // Check if reward is sufficient
      const minReward = ethers.parseEther(process.env.SOLVER_MIN_REWARD || '0.01');
      if (intent.reward < minReward) {
        logger.info('Intent reward too low, skipping', { intentId });
        return;
      }

      // Calculate route
      logger.info('Calculating route for intent', { intentId });
      const route = await this.routeCalculator.calculateRoute(intent);

      if (!route) {
        logger.warn('Could not calculate route for intent', { intentId });
        return;
      }

      // Claim intent for execution
      logger.info('Claiming intent for execution', { intentId });
      await this.contractInteraction.executeIntent(intentId);

      // Execute based on route type
      let success = false;
      let result = '';

      try {
        if (route.type === 'CROSS_CHAIN') {
          result = await this.xcmExecutor.executeCrossChain(intent, route);
          success = true;
        } else if (route.type === 'DIRECT') {
          result = await this.executeDirect(intent);
          success = true;
        } else {
          result = await this.executeComplex(intent, route);
          success = true;
        }

        // Mark as completed
        await this.contractInteraction.completeIntent(intentId, result);
        logger.info('✅ Intent executed successfully', { intentId });
      } catch (error: any) {
        logger.error('Intent execution failed', { intentId, error: error.message });
        await this.contractInteraction.failIntent(intentId, error.message);
      }
    } catch (error) {
      logger.error('Error processing intent', { intentId, error });
    }
  }

  private async executeDirect(intent: any): Promise<string> {
    // Simplified direct execution
    logger.info('Executing direct intent', { intentId: intent.id });

    // In production, this would parse the intent and execute the actual transaction
    // For now, simulate execution
    await this.sleep(2000);

    return 'Direct execution completed';
  }

  private async executeComplex(intent: any, route: any): Promise<string> {
    logger.info('Executing complex intent', { intentId: intent.id });

    // Complex multi-step execution
    await this.sleep(3000);

    return 'Complex execution completed';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
    this.contract.removeAllListeners();
    logger.info('Intent listener stopped');
  }
}
