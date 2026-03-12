import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverallStats() {
    const [totalIntents, completedIntents, failedIntents, totalSolvers, pendingIntents] =
      await Promise.all([
        this.prisma.intent.count(),
        this.prisma.intent.count({ where: { status: 'COMPLETED' } }),
        this.prisma.intent.count({ where: { status: 'FAILED' } }),
        this.prisma.solver.count({ where: { isActive: true } }),
        this.prisma.intent.count({ where: { status: 'PENDING' } }),
      ]);

    const successRate =
      totalIntents > 0 ? ((completedIntents / totalIntents) * 100).toFixed(2) : '0';

    const totalVolume = await this.prisma.intent.aggregate({
      _sum: { reward: true },
      where: { status: 'COMPLETED' },
    });

    return {
      totalIntents,
      completedIntents,
      failedIntents,
      pendingIntents,
      totalSolvers,
      successRate,
      totalVolume: totalVolume._sum.reward || '0',
    };
  }

  async getIntentsByStatus() {
    const statuses = ['PENDING', 'EXECUTING', 'COMPLETED', 'FAILED', 'CANCELLED'];

    const counts = await Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await this.prisma.intent.count({ where: { status } }),
      })),
    );

    return counts;
  }

  async getRecentActivity(limit: number = 10) {
    const recentIntents = await this.prisma.intent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        description: true,
        status: true,
        creator: true,
        reward: true,
        createdAt: true,
        solver: {
          select: {
            address: true,
          },
        },
      },
    });

    return recentIntents;
  }

  async getVolumeByDay(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const intents = await this.prisma.intent.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED',
      },
      select: {
        createdAt: true,
        reward: true,
      },
    });

    const volumeByDay = intents.reduce((acc, intent) => {
      const date = intent.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, volume: '0', count: 0 };
      }
      acc[date].volume = (BigInt(acc[date].volume) + BigInt(intent.reward)).toString();
      acc[date].count++;
      return acc;
    }, {} as Record<string, { date: string; volume: string; count: number }>);

    return Object.values(volumeByDay);
  }

  async getTopSolvers(limit: number = 5) {
    return this.prisma.solver.findMany({
      where: { isActive: true },
      orderBy: { totalExecuted: 'desc' },
      take: limit,
      select: {
        address: true,
        totalExecuted: true,
        reputation: true,
      },
    });
  }
}
