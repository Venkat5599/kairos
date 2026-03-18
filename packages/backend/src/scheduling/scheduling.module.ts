import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { SchedulerService } from './scheduler.service';
import { IntentsModule } from '../intents/intents.module';

@Module({
  imports: [ScheduleModule.forRoot(), IntentsModule],
  controllers: [SchedulingController],
  providers: [SchedulingService, SchedulerService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
