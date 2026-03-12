import { ethers } from 'ethers';
import { logger } from '../utils/logger';

const INTENT_REGISTRY_ABI = [
  'function createIntent(tuple(string description, bytes data, uint256 reward, uint256 deadline) params) payable returns (bytes32)',
  'function executeIntent(bytes32 intentId) external',
  'function completeIntent(bytes32 intentId, bytes calldata result) external',
  'function failIntent(bytes32 intentId, string calldata reason) external',
  'function getIntent(bytes32 intentId) view returns (tuple(bytes32 id, address creator, string description, bytes data, uint256 reward, uint256 deadline, uint8 status, address solver, uint256 createdAt, uint256 executedAt))',
  'function registerSolver(uint256 stake) external',
  'function getSolverInfo(address solver) view returns (tuple(address solverAddress, uint256 stake, uint256 reputation, uint256 totalExecuted, uint256 totalFailed, bool isActive, uint256 registeredAt))',
];

export class ContractInteraction {
  private contract: ethers.Contract;

  constructor(private wallet: ethers.Wallet) {
    this.contract = new ethers.Contract(
      process.env.INTENT_REGISTRY_ADDRESS!,
      INTENT_REGISTRY_ABI,
      wallet
    );
  }

  async registerSolver(stake: bigint): Promise<void> {
    try {
      const tx = await this.contract.registerSolver(stake, { value: stake });
      await tx.wait();
      logger.info('Solver registered successfully');
    } catch (error) {
      logger.error('Failed to register solver', { error });
      throw error;
    }
  }

  async isSolverRegistered(address: string): Promise<boolean> {
    try {
      const solverInfo = await this.contract.getSolverInfo(address);
      return solverInfo.isActive;
    } catch (error) {
      return false;
    }
  }

  async getIntent(intentId: string): Promise<any> {
    try {
      return await this.contract.getIntent(intentId);
    } catch (error) {
      logger.error('Failed to get intent', { intentId, error });
      return null;
    }
  }

  async executeIntent(intentId: string): Promise<void> {
    try {
      const gasLimit = parseInt(process.env.SOLVER_GAS_LIMIT || '500000');
      const tx = await this.contract.executeIntent(intentId, { gasLimit });
      await tx.wait();
      logger.info('Intent execution claimed', { intentId });
    } catch (error) {
      logger.error('Failed to execute intent', { intentId, error });
      throw error;
    }
  }

  async completeIntent(intentId: string, result: string): Promise<void> {
    try {
      const resultBytes = ethers.toUtf8Bytes(result);
      const tx = await this.contract.completeIntent(intentId, resultBytes);
      await tx.wait();
      logger.info('Intent marked as completed', { intentId });
    } catch (error) {
      logger.error('Failed to complete intent', { intentId, error });
      throw error;
    }
  }

  async failIntent(intentId: string, reason: string): Promise<void> {
    try {
      const tx = await this.contract.failIntent(intentId, reason);
      await tx.wait();
      logger.info('Intent marked as failed', { intentId, reason });
    } catch (error) {
      logger.error('Failed to mark intent as failed', { intentId, error });
    }
  }
}
