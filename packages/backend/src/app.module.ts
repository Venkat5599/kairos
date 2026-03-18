import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntentsModule } from './intents/intents.module';
import { SolversModule } from './solvers/solvers.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DatabaseModule } from './database/database.module';
import { AiParserModule } from './ai/ai-parser.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    IntentsModule,
    SolversModule,
    AnalyticsModule,
    AiParserModule,
    MarketplaceModule,
    SchedulingModule,
    WorkflowsModule,
  ],
})
export class AppModule {}
