import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntentsModule } from './intents/intents.module';
import { SolversModule } from './solvers/solvers.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DatabaseModule } from './database/database.module';

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
  ],
})
export class AppModule {}
