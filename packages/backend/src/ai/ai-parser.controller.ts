import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AiParserService, ParsedIntent } from './ai-parser.service';

export class ParseIntentDto {
  command: string;
  userAddress?: string;
}

@Controller('ai')
export class AiParserController {
  private readonly logger = new Logger(AiParserController.name);

  constructor(private readonly aiParserService: AiParserService) {}

  @Post('parse')
  async parseIntent(@Body() dto: ParseIntentDto): Promise<ParsedIntent> {
    this.logger.log(`Parsing intent: ${dto.command}`);

    // Check for fraud patterns
    if (dto.userAddress) {
      const fraudCheck = await this.aiParserService.detectFraud(
        dto.command,
        dto.userAddress,
      );

      if (fraudCheck.isSuspicious) {
        this.logger.warn(`Suspicious intent detected: ${fraudCheck.reason}`);
      }
    }

    const parsed = await this.aiParserService.parseIntent(dto.command);
    this.logger.log(`Parsed result: ${JSON.stringify(parsed)}`);

    return parsed;
  }

  @Post('suggest')
  async suggestOptimizations(@Body() intent: any): Promise<{ suggestions: string[] }> {
    const suggestions = await this.aiParserService.suggestOptimizations(intent);
    return { suggestions };
  }
}
