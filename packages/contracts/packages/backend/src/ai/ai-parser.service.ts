import { Injectable, Logger } from '@nestjs/common';

export interface ParsedIntent {
  recipient: string;
  amount: string;
  token: string;
  chain?: string;
  intentType: 'TRANSFER' | 'SWAP' | 'CROSS_CHAIN' | 'STAKE' | 'COMPLEX';
  confidence: number;
  description: string;
}

@Injectable()
export class AiParserService {
  private readonly logger = new Logger(AiParserService.name);

  async parseIntent(command: string): Promise<ParsedIntent> {
    // Fallback regex parsing (OpenAI integration can be added later)
    const amountMatch = command.match(/(\d+\.?\d*)\s*(DEV|USDC|USDT|DAI|DOT)/i);
    const addressMatch = command.match(/(0x[a-fA-F0-9]{40})/);
    const chainMatch = command.match(/to\s+(polkadot|assethub|moonbeam|acala)/i);

    const amount = amountMatch ? amountMatch[1] : '0';
    const token = amountMatch ? amountMatch[2].toUpperCase() : 'DEV';
    const recipient = addressMatch ? addressMatch[1] : '';
    const chain = chainMatch ? chainMatch[1].toLowerCase() : undefined;

    let intentType: ParsedIntent['intentType'] = 'TRANSFER';
    if (command.toLowerCase().includes('swap')) intentType = 'SWAP';
    else if (chain) intentType = 'CROSS_CHAIN';
    else if (command.toLowerCase().includes('stake')) intentType = 'STAKE';

    return {
      recipient,
      amount,
      token,
      chain,
      intentType,
      confidence: 0.85,
      description: command,
    };
  }

  async suggestOptimizations(intent: any): Promise<string[]> {
    return [];
  }

  async detectFraud(command: string, userAddress: string): Promise<{ isSuspicious: boolean; reason?: string }> {
    const suspiciousPatterns = [/claim.*reward/i, /verify.*wallet/i];
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(command)) {
        return { isSuspicious: true, reason: 'Suspicious keywords detected' };
      }
    }
    return { isSuspicious: false };
  }
}
