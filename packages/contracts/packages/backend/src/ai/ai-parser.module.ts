import { Module } from '@nestjs/common';
import { AiParserService } from './ai-parser.service';
import { AiParserController } from './ai-parser.controller';

@Module({
  controllers: [AiParserController],
  providers: [AiParserService],
  exports: [AiParserService],
})
export class AiParserModule {}
