import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SolversService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { isActive?: boolean; limit?: number; offset?: number }) {
    const where: any = {};
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    const [solvers, total] = await Promise.all([
      this.prisma.solver.findMany({
        where,
        include: {
          _count: {
            select: { intents: true, executions: true },
          },
        },
        orderBy: { reputation: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      }),
      this.prisma.solver.count({ where }),
    ]);

    return { solvers, total };
  }

  async findOne(address: string) {
    return this.prisma.solver.findUnique({
      where: { address },
      include: {
        intents: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { intents: true, executions: true },
        },
      },
    });
  }

  async getLeaderboard(limit: number = 10) {
    return this.prisma.solver.findMany({
      where: { isActive: true },
      orderBy: [{ reputation: 'desc' }, { totalExecuted: 'desc' }],
      take: limit,
      select: {
        address: true,
        reputation: true,
        totalExecuted: true,
        totalFailed: true,
        stake: true,
      },
    });
  }

  async getStats(address: string) {
    const solver = await this.prisma.solver.findUnique({
      where: { address },
      include: {
        executions: true,
      },
    });

    if (!solver) return null;

    const successfulExecutions = solver.executions.filter((e) => e.success).length;
    const totalExecutions = solver.executions.length;
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

    const avgExecutionTime =
      solver.executions.length > 0
        ? solver.executions.reduce((acc, e) => acc + parseFloat(e.gasUsed), 0) /
          solver.executions.length
        : 0;

    return {
      address: solver.address,
      reputation: solver.reputation,
      totalExecuted: solver.totalExecuted,
      totalFailed: solver.totalFailed,
      successRate: successRate.toFixed(2),
      avgExecutionTime: avgExecutionTime.toFixed(2),
      stake: solver.stake,
    };
  }
}
