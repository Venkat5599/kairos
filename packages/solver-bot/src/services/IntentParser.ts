import { ethers } from 'ethers';
import { logger } from '../utils/logger';

export interface ParsedIntent {
  type: 'TRANSFER' | 'SWAP' | 'CROSS_CHAIN' | 'UNKNOWN';
  recipient?: string;
  amount?: bigint;
  token?: string;
  fromChain?: string;
  toChain?: string;
  raw: string;
}

export class IntentParser {
  /**
   * Parse intent description into actionable data
   * 
   * Supported formats:
   * - "Send 0.1 DEV to 0x..."
   * - "Transfer 5 DEV to 0x..."
   * - "Send 10 tokens to 0x..."
   */
  parse(description: string): ParsedIntent {
    const normalized = description.trim().toLowerCase();
    
    logger.info('Parsing intent', { description });

    // Pattern 1: "Send X DEV to 0x..."
    const sendPattern = /send\s+([\d.]+)\s+dev\s+to\s+(0x[a-fA-F0-9]{40})/i;
    const sendMatch = description.match(sendPattern);
    
    if (sendMatch) {
      const amount = ethers.parseEther(sendMatch[1]);
      const recipient = sendMatch[2];
      
      logger.info('Parsed as TRANSFER', { amount: sendMatch[1], recipient });
      
      return {
        type: 'TRANSFER',
        recipient,
        amount,
        token: 'DEV',
        raw: description,
      };
    }

    // Pattern 2: "Transfer X DEV to 0x..."
    const transferPattern = /transfer\s+([\d.]+)\s+dev\s+to\s+(0x[a-fA-F0-9]{40})/i;
    const transferMatch = description.match(transferPattern);
    
    if (transferMatch) {
      const amount = ethers.parseEther(transferMatch[1]);
      const recipient = transferMatch[2];
      
      logger.info('Parsed as TRANSFER', { amount: transferMatch[1], recipient });
      
      return {
        type: 'TRANSFER',
        recipient,
        amount,
        token: 'DEV',
        raw: description,
      };
    }

    // Pattern 3: "Send X to 0x..." (assume DEV)
    const simplePattern = /send\s+([\d.]+)\s+to\s+(0x[a-fA-F0-9]{40})/i;
    const simpleMatch = description.match(simplePattern);
    
    if (simpleMatch) {
      const amount = ethers.parseEther(simpleMatch[1]);
      const recipient = simpleMatch[2];
      
      logger.info('Parsed as TRANSFER (simple)', { amount: simpleMatch[1], recipient });
      
      return {
        type: 'TRANSFER',
        recipient,
        amount,
        token: 'DEV',
        raw: description,
      };
    }

    logger.warn('Could not parse intent', { description });
    
    return {
      type: 'UNKNOWN',
      raw: description,
    };
  }

  /**
   * Validate parsed intent
   */
  validate(parsed: ParsedIntent): boolean {
    if (parsed.type === 'UNKNOWN') {
      return false;
    }

    if (parsed.type === 'TRANSFER') {
      if (!parsed.recipient || !ethers.isAddress(parsed.recipient)) {
        logger.error('Invalid recipient address', { recipient: parsed.recipient });
        return false;
      }

      if (!parsed.amount || parsed.amount <= 0n) {
        logger.error('Invalid amount', { amount: parsed.amount });
        return false;
      }

      return true;
    }

    return false;
  }
}
