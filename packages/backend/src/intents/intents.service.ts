import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateIntentDto } from './dto/create-intent.dto';
import { UpdateIntentDto } from './dto/update-intent.dto';

@Injectable()
export class IntentsService {
  constructor(private prisma: PrismaService) {}

  async create(createIntentDto: CreateIntentDto) {
    return this.prisma.intent.create({
      data: {
        chainId: createIntentDto.chainId,
        creator: createIntentDto.creator,
        description: createIntentDto.description,
        data: createIntentDto.data || '',
        status: 'PENDING',
        reward: createIntentDto.reward,
        deadline: new Date(createIntentDto.deadline * 1000),
        txHash: createIntentDto.txHash,
      },
    });
  }

  async findAll(filters?: {
    status?: string;
    creator?: string;
    solver?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.creator) where.creator = filters.creator;
    if (filters?.solver) where.solverId = filters.solver;

    const [intents, total] = await Promise.all([
      this.prisma.intent.findMany({
        where,
        include: {
          solver: true,
          executions: true,
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      }),
      this.prisma.intent.count({ where }),
    ]);

    return { intents, total };
  }

  async findOne(id: string) {
    const intent = await this.prisma.intent.findUnique({
      where: { id },
      include: {
        solver: true,
        executions: true,
      },
    });

    if (!intent) {
      throw new NotFoundException(`Intent with ID ${id} not found`);
    }

    return intent;
  }

  async update(id: string, updateIntentDto: UpdateIntentDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.intent.update({
      where: { id },
      data: {
        status: updateIntentDto.status,
        solverId: updateIntentDto.solverId,
        executedAt: updateIntentDto.status === 'COMPLETED' ? new Date() : undefined,
      },
    });
  }

  async getPendingIntents() {
    return this.prisma.intent.findMany({
      where: {
        status: 'PENDING',
        deadline: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getIntentsByCreator(creator: string) {
    return this.prisma.intent.findMany({
      where: { creator },
      include: { solver: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
