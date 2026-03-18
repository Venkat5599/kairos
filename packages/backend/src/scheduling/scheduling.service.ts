import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateScheduledIntentDto } from './dto/create-scheduled-intent.dto';
import { UpdateScheduledIntentDto } from './dto/update-scheduled-intent.dto';

@Injectable()
export class SchedulingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduledIntentDto) {
    const data: any = {
      creator: dto.creator,
      name: dto.name,
      description: dto.description,
      intentTemplate: dto.intentTemplate,
      isActive: true,
      executionCount: 0,
    };

    if (dto.cronExpression) {
      data.cronExpression = dto.cronExpression;
      data.nextExecutionAt = this.calculateNextExecution(dto.cronExpression);
    }

    if (dto.executeAt) {
      data.executeAt = new Date(dto.executeAt);
    }

    if (dto.conditions) {
      data.conditions = dto.conditions;
    }

    return this.prisma.scheduledIntent.create({ data });
  }

  async findAll(filters?: { creator?: string; isActive?: boolean }) {
    const where: any = {};

    if (filters?.creator) {
      where.creator = filters.creator;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.scheduledIntent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.scheduledIntent.findUnique({
      where: { id },
      include: {
        executions: {
          orderBy: { executedAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async update(id: string, dto: UpdateScheduledIntentDto) {
    const data: any = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    if (dto.cronExpression !== undefined) {
      data.cronExpression = dto.cronExpression;
      data.nextExecutionAt = this.calculateNextExecution(dto.cronExpression);
    }

    if (dto.executeAt !== undefined) {
      data.executeAt = new Date(dto.executeAt);
    }

    return this.prisma.scheduledIntent.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.scheduledIntent.delete({
      where: { id },
    });
  }

  async getExecutions(scheduledIntentId: string) {
    return this.prisma.scheduledExecution.findMany({
      where: { scheduledIntentId },
      orderBy: { executedAt: 'desc' },
    });
  }

  private calculateNextExecution(cronExpression: string): Date {
    const now = new Date();

    // Simple cron parsing for common patterns
    // Format: "minute hour day month dayOfWeek"
    // Examples: "0 9 * * *" (daily at 9am), "0 9 * * 1" (weekly on Monday at 9am)

    const parts = cronExpression.split(' ');
    if (parts.length !== 5) {
      // Default to 1 day from now if invalid
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    const [minute, hour, day, month, dayOfWeek] = parts;

    const next = new Date(now);

    // Set the time
    if (hour !== '*') next.setHours(parseInt(hour));
    if (minute !== '*') next.setMinutes(parseInt(minute));
    next.setSeconds(0);
    next.setMilliseconds(0);

    // If the time has passed today, move to tomorrow
    if (next <= now) {
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
        if (next <= now) {
          next.setMonth(next.getMonth() + 1);
        }
      }
    }

    return next;
  }
}
