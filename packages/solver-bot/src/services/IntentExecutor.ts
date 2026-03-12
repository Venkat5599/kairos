import { ethers } from 'ethers';
import { ParsedIntent } from './IntentParser';
import { logger } from '../utils/logger';

export class IntentExecutor {
  constructor(private wallet: ethers.Wallet) {}

  /**
   * Execute a parsed intent
   */
  async execute(parsed: ParsedIntent): Promise<string> {
    logger.info('Executing intent', { type: parsed.type });

    switch (parsed.type) {
      case 'TRANSFER':
        return await this.executeTransfer(parsed);
      
      case 'SWAP':
        return await this.executeSwap(parsed);
      
      case 'CROSS_CHAIN':
        return await this.executeCrossChain(parsed);
      
      default:
        throw new Error(`Unsupported intent type: ${parsed.type}`);
    }
  }

  /**
   * Execute a simple transfer
   */
  private async executeTransfer(parsed: ParsedIntent): Promise<string> {
    if (!parsed.recipient || !parsed.amount) {
      throw new Error('Missing recipient or amount');
    }

    logger.info('Executing transfer', {
      to: parsed.recipient,
      amount: ethers.formatEther(parsed.amount),
    });

    try {
      // Send the transaction
      const tx = await this.wallet.sendTransaction({
        to: parsed.recipient,
        value: parsed.amount,
      });

      logger.info('Transfer transaction sent', { hash: tx.hash });

      // Wait for confirmation
      const receipt = await tx.wait();

      logger.info('Transfer confirmed', {
        hash: receipt?.hash,
        blockNumber: receipt?.blockNumber,
      });

      return receipt?.hash || tx.hash;
    } catch (error: any) {
      logger.error('Transfer failed', { error: error.message });
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  /**
   * Execute a token swap (future implementation)
   */
  private async executeSwap(parsed: ParsedIntent): Promise<string> {
    throw new Error('Swap execution not yet implemented');
  }

  /**
   * Execute cross-chain transfer (future implementation)
   */
  private async executeCrossChain(parsed: ParsedIntent): Promise<string> {
    throw new Error('Cross-chain execution not yet implemented');
  }

  /**
   * Estimate gas for execution
   */
  async estimateGas(parsed: ParsedIntent): Promise<bigint> {
    if (parsed.type === 'TRANSFER' && parsed.recipient && parsed.amount) {
      try {
        const gasEstimate = await this.wallet.estimateGas({
          to: parsed.recipient,
          value: parsed.amount,
        });
        return gasEstimate;
      } catch (error) {
        logger.error('Gas estimation failed', { error });
        return 21000n; // Default gas for simple transfer
      }
    }

    return 100000n; // Default for complex operations
  }
}
