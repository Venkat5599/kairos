import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

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
  private openai: OpenAI | null = null;
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.AI_PARSER_ENABLED === 'true';

    if (this.enabled && process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.logger.log('AI Parser initialized with OpenAI');
    } else {
      this.logger.warn('AI Parser disabled - using fallback regex parsing');
    }
  }

  async parseIntent(command: string): Promise<ParsedIntent> {
    if (!this.enabled || !this.openai) {
      return this.fallbackParse(command);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an intent parser for a blockchain transaction system. Parse natural language commands into structured intent data.

Extract:
- recipient: wallet address (0x...) or name (alice.dot)
- amount: numeric value
- token: DEV, USDC, USDT, DAI, DOT, or other token symbol
- chain: polkadot, assethub, moonbeam, acala, or leave empty for same chain
- intentType: TRANSFER, SWAP, CROSS_CHAIN, STAKE, or COMPLEX
- description: cleaned up description of the intent

Return JSON only, no explanation.`,
          },
          {
            role: 'user',
            content: command,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const parsed = JSON.parse(completion.choices[0].message.content);

      return {
        recipient: parsed.recipient || '',
        amount: parsed.amount || '0',
        token: parsed.token || 'DEV',
        chain: parsed.chain,
        intentType: parsed.intentType || 'TRANSFER',
        confidence: 0.95,
        description: parsed.description || command,
      };
    } catch (error) {
      this.logger.error('AI parsing failed, using fallback', error);
      return this.fallbackParse(command);
    }
  }

  private fallbackParse(command: string): ParsedIntent {
    const amountMatch = command.match(/(\d+\.?\d*)\s*(DEV|USDC|USDT|DAI|DOT)/i);
    const addressMatch = command.match(/(0x[a-fA-F0-9]{40})/);
    const nameMatch = command.match(/to\s+([a-zA-Z0-9_]+\.dot)/i);
    const chainMatch = command.match(/to\s+(polkadot|assethub|moonbeam|acala)/i);

    const amount = amountMatch ? amountMatch[1] : '0';
    const token = amountMatch ? amountMatch[2].toUpperCase() : 'DEV';
    const recipient = addressMatch ? addressMatch[1] : (nameMatch ? nameMatch[1] : '');
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
      confidence: 0.7,
      description: command,
    };
  }

  async suggestOptimizations(intent: any): Promise<string[]> {
    if (!this.enabled || !this.openai) {
      return [];
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Suggest 2-3 optimizations for this blockchain intent. Be concise.',
          },
          {
            role: 'user',
            content: JSON.stringify(intent),
          },
        ],
        max_tokens: 200,
      });

      const suggestions = completion.choices[0].message.content
        .split('\n')
        .filter(s => s.trim().length > 0)
        .slice(0, 3);

      return suggestions;
    } catch (error) {
      this.logger.error('Failed to generate suggestions', error);
      return [];
    }
  }

  async detectFraud(command: string, userAddress: string): Promise<{ isSuspicious: boolean; reason?: string }> {
    const suspiciousPatterns = [
      /claim.*reward/i,
      /verify.*wallet/i,
      /urgent.*transfer/i,
      /double.*your/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(command)) {
        return {
          isSuspicious: true,
          reason: 'Command contains suspicious keywords',
        };
      }
    }

    return { isSuspicious: false };
  }
}
