import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';
import { IntentsService } from '../intents/intents.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private intentsService: IntentsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async executeScheduledIntents() {
    this.logger.log('Running scheduled intents check...');
    const now = new Date();

    try {
      // Find intents ready to execute
      const scheduled = await this.prisma.scheduledIntent.findMany({
        where: {
          isActive: true,
          OR: [
            { executeAt: { lte: now } }, // One-time schedules
            { nextExecutionAt: { lte: now } }, // Recurring schedules
          ],
        },
      });

      this.logger.log(`Found ${scheduled.length} scheduled intents to execute`);

      for (const schedule of scheduled) {
        try {
          // Parse intentTemplate JSON and create intent
          const template = schedule.intentTemplate as any;

          const intent = await this.intentsService.create({
            chainId: template.chainId,
            creator: schedule.creator,
            description: template.description || schedule.description,
            data: template.data || '',
            reward: template.reward,
            deadline: template.deadline,
            txHash: template.txHash || '',
          });

          this.logger.log(`Created intent ${intent.id} from schedule ${schedule.id}`);

          // Record execution
          await this.prisma.scheduledExecution.create({
            data: {
              scheduledIntentId: schedule.id,
              intentId: intent.id,
              status: 'executed',
              executedAt: now,
              conditionsMet: true,
            },
          });

          // Update schedule
          const updates: any = {
            lastExecutedAt: now,
            executionCount: { increment: 1 },
          };

          if (schedule.cronExpression) {
            // Calculate next execution for recurring
            updates.nextExecutionAt = this.calculateNext(schedule.cronExpression, now);
          } else {
            // One-time schedule - deactivate
            updates.isActive = false;
          }

          await this.prisma.scheduledIntent.update({
            where: { id: schedule.id },
            data: updates,
          });
        } catch (error) {
          this.logger.error(`Failed to execute schedule ${schedule.id}: ${error.message}`);

          // Record failure
          await this.prisma.scheduledExecution.create({
            data: {
              scheduledIntentId: schedule.id,
              status: 'failed',
              executedAt: now,
              error: error.message,
              conditionsMet: true,
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(`Error in scheduled intents execution: ${error.message}`);
    }
  }

  private calculateNext(cronExpression: string, from: Date = new Date()): Date {
    // Simple cron parsing for common patterns
    const parts = cronExpression.split(' ');
    if (parts.length !== 5) {
      // Default to 1 day from now if invalid
      return new Date(from.getTime() + 24 * 60 * 60 * 1000);
    }

    const [minute, hour, day, month, dayOfWeek] = parts;
    const next = new Date(from);

    // Set the time
    if (hour !== '*') next.setHours(parseInt(hour));
    if (minute !== '*') next.setMinutes(parseInt(minute));
    next.setSeconds(0);
    next.setMilliseconds(0);

    // If the time has passed, move to next occurrence
    if (next <= from) {
      next.setDate(next.getDate() + 1);
    }

    // Handle day of week (0-6, Sunday = 0)
    if (dayOfWeek !== '*') {
      const targetDay = parseInt(dayOfWeek);
      const currentDay = next.getDay();
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7;
      next.setDate(next.getDate() + daysToAdd);
    }

    // Handle day of month
    if (day !== '*') {
      const targetDay = parseInt(day);
      if (next.getDate() !== targetDay) {
        next.setDate(targetDay);
        if (next <= from) {
          next.setMonth(next.getMonth() + 1);
        }
      }
    }

    return next;
  }
}
