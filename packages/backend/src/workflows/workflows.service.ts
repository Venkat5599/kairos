import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkflowDto) {
    return this.prisma.workflow.create({
      data: {
        creator: dto.creator,
        name: dto.name,
        description: dto.description,
        steps: dto.steps,
        isPublic: dto.isPublished || false,
        usageCount: 0,
      },
    });
  }

  async findAll(filters?: { creator?: string; isPublished?: boolean }) {
    const where: any = {};

    if (filters?.creator) {
      where.creator = filters.creator;
    }

    if (filters?.isPublished !== undefined) {
      where.isPublic = filters.isPublished;
    }

    return this.prisma.workflow.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.workflow.findUnique({
      where: { id },
      include: {
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async update(id: string, dto: Partial<CreateWorkflowDto>) {
    const data: any = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.steps !== undefined) data.steps = dto.steps;
    if (dto.isPublished !== undefined) data.isPublic = dto.isPublished;

    return this.prisma.workflow.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.workflow.delete({
      where: { id },
    });
  }

  async publish(id: string) {
    return this.prisma.workflow.update({
      where: { id },
      data: { isPublic: true },
    });
  }

  async getExecutions(workflowId: string) {
    return this.prisma.workflowExecution.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getExecution(executionId: string) {
    return this.prisma.workflowExecution.findUnique({
      where: { id: executionId },
    });
  }
}
