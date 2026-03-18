import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverallStats() {
    const [totalIntents, completedIntents, failedIntents, totalSolvers, pendingIntents, completedIntentsData] =
      await Promise.all([
        this.prisma.intent.count(),
        this.prisma.intent.count({ where: { status: 'COMPLETED' } }),
        this.prisma.intent.count({ where: { status: 'FAILED' } }),
        this.prisma.solver.count({ where: { isActive: true } }),
        this.prisma.intent.count({ where: { status: 'PENDING' } }),
        this.prisma.intent.findMany({
          where: { status: 'COMPLETED' },
          select: { reward: true },
        }),
      ]);

    const successRate =
      totalIntents > 0 ? ((completedIntents / totalIntents) * 100).toFixed(2) : '0';

    // Calculate total volume manually since reward is a string
    const totalVolume = completedIntentsData.reduce((sum, intent) => {
      return sum + BigInt(intent.reward || '0');
    }, BigInt(0));

    return {
      totalIntents,
      completedIntents,
      failedIntents,
      pendingIntents,
      totalSolvers,
      successRate,
      totalVolume: totalVolume.toString(),
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

  async getUserAnalytics(address: string) {
    const [intents, executions] = await Promise.all([
      this.prisma.intent.findMany({ where: { creator: address } }),
      this.prisma.execution.findMany({
        where: { intent: { creator: address } },
      }),
    ]);

    const completed = intents.filter((i) => i.status === 'COMPLETED').length;
    const failed = intents.filter((i) => i.status === 'FAILED').length;
    const pending = intents.filter((i) => i.status === 'PENDING').length;

    const totalRewards = intents.reduce((sum, i) => sum + BigInt(i.reward || '0'), BigInt(0));

    const successfulExecutions = executions.filter((e) => e.success);
    const avgExecutionTime =
      successfulExecutions.length > 0
        ? successfulExecutions.reduce((sum, e) => sum + (e.createdAt.getTime() / 1000), 0) /
          successfulExecutions.length
        : 0;

    // Estimate gas saved (simplified calculation)
    const totalGasUsed = executions.reduce((sum, e) => sum + BigInt(e.gasUsed || '0'), BigInt(0));
    const estimatedDirectGas = BigInt(executions.length * 50000); // Estimate 50k gas per direct tx
    const gasSaved = estimatedDirectGas > totalGasUsed ? estimatedDirectGas - totalGasUsed : BigInt(0);

    return {
      totalIntents: intents.length,
      completedIntents: completed,
      failedIntents: failed,
      pendingIntents: pending,
      successRate: intents.length > 0 ? ((completed / intents.length) * 100).toFixed(2) : '0',
      totalRewardsPaid: totalRewards.toString(),
      avgExecutionTime: avgExecutionTime.toFixed(2),
      estimatedGasSaved: gasSaved.toString(),
    };
  }

  async getGasOptimizationMetrics() {
    const executions = await this.prisma.execution.findMany({
      where: { success: true },
      include: { intent: true },
    });

    if (executions.length === 0) {
      return {
        totalGasSaved: '0',
        avgGasSavedPerIntent: '0',
        totalExecutions: 0,
        optimizationRate: '0',
      };
    }

    // Estimate: direct tx would cost 50000 gas on average
    const directGasEstimate = BigInt(50000);
    let totalGasSaved = BigInt(0);

    for (const exec of executions) {
      const intentGas = BigInt(exec.gasUsed || '0');
      const saved = directGasEstimate > intentGas ? directGasEstimate - intentGas : BigInt(0);
      totalGasSaved += saved;
    }

    const avgGasSaved = totalGasSaved / BigInt(executions.length);
    const optimizationRate = ((Number(totalGasSaved) / (Number(directGasEstimate) * executions.length)) * 100).toFixed(2);

    return {
      totalGasSaved: totalGasSaved.toString(),
      avgGasSavedPerIntent: avgGasSaved.toString(),
      totalExecutions: executions.length,
      optimizationRate,
    };
  }

  async getSolverLeaderboard(limit: number = 10) {
    const solvers = await this.prisma.solver.findMany({
      where: { isActive: true },
      orderBy: [
        { totalExecuted: 'desc' },
        { reputation: 'desc' },
      ],
      take: limit,
      include: {
        executions: {
          where: { success: true },
          select: { gasUsed: true, createdAt: true },
        },
      },
    });

    return solvers.map((solver) => {
      const successRate =
        solver.totalExecuted > 0
          ? (((solver.totalExecuted - solver.totalFailed) / solver.totalExecuted) * 100).toFixed(2)
          : '0';

      const avgGasUsed =
        solver.executions.length > 0
          ? (
              solver.executions.reduce((sum, e) => sum + BigInt(e.gasUsed || '0'), BigInt(0)) /
              BigInt(solver.executions.length)
            ).toString()
          : '0';

      return {
        address: solver.address,
        totalExecuted: solver.totalExecuted,
        totalFailed: solver.totalFailed,
        reputation: solver.reputation,
        successRate,
        avgGasUsed,
        stake: solver.stake,
      };
    });
  }

  async getTimeSeriesData(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const intents = await this.prisma.intent.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        status: true,
        creator: true,
      },
    });

    // Group by day
    const dataByDay = intents.reduce((acc, intent) => {
      const date = intent.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          totalIntents: 0,
          completedIntents: 0,
          failedIntents: 0,
          uniqueUsers: new Set<string>(),
        };
      }
      acc[date].totalIntents++;
      if (intent.status === 'COMPLETED') acc[date].completedIntents++;
      if (intent.status === 'FAILED') acc[date].failedIntents++;
      acc[date].uniqueUsers.add(intent.creator);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(dataByDay).map((day: any) => ({
      date: day.date,
      totalIntents: day.totalIntents,
      completedIntents: day.completedIntents,
      failedIntents: day.failedIntents,
      uniqueUsers: day.uniqueUsers.size,
      successRate:
        day.totalIntents > 0
          ? ((day.completedIntents / day.totalIntents) * 100).toFixed(2)
          : '0',
    }));
  }
}
