import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IntentsService } from '../intents/intents.service';

@Injectable()
export class WorkflowExecutorService {
  private readonly logger = new Logger(WorkflowExecutorService.name);

  constructor(
    private prisma: PrismaService,
    private intentsService: IntentsService,
  ) {}

  async executeWorkflow(workflowId: string, variables: Record<string, any>) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    this.logger.log(`Starting workflow execution: ${workflow.name}`);

    // Create execution record
    const execution = await this.prisma.workflowExecution.create({
      data: {
        workflowId,
        creator: variables.creator || 'system',
        status: 'executing',
        currentStep: 0,
        results: {},
      },
    });

    try {
      const steps = workflow.steps as any[];
      const results: Record<string, any> = {};

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        this.logger.log(`Executing step ${i + 1}/${steps.length}: ${step.name}`);

        // Update current step
        await this.prisma.workflowExecution.update({
          where: { id: execution.id },
          data: { currentStep: i },
        });

        // Parse template with variables and previous results
        const intentData = this.parseTemplate(step.intentTemplate, {
          ...variables,
          ...results,
        });

        // Create intent
        const intent = await this.intentsService.create(intentData);
        this.logger.log(`Created intent ${intent.id} for step ${step.name}`);

        // Wait for completion (poll every 10 seconds, max 5 minutes)
        const finalStatus = await this.waitForCompletion(intent.id, 300000);

        if (finalStatus === 'COMPLETED') {
          results[step.name] = { intentId: intent.id, status: 'success' };
          this.logger.log(`Step ${step.name} completed successfully`);
        } else {
          this.logger.warn(`Step ${step.name} failed with status: ${finalStatus}`);

          // Handle failure based on step.onFailure
          if (step.onFailure === 'abort' || !step.onFailure) {
            throw new Error(`Step ${step.name} failed with status: ${finalStatus}`);
          }

          results[step.name] = { intentId: intent.id, status: 'failed', error: finalStatus };
        }
      }

      // Mark execution as completed
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'completed',
          results,
          completedAt: new Date(),
        },
      });

      // Increment workflow usage count
      await this.prisma.workflow.update({
        where: { id: workflowId },
        data: { usageCount: { increment: 1 } },
      });

      this.logger.log(`Workflow execution completed: ${execution.id}`);
      return execution;
    } catch (error) {
      this.logger.error(`Workflow execution failed: ${error.message}`);

      // Mark execution as failed
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'failed',
          error: error.message,
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }

  private async waitForCompletion(intentId: string, timeout: number): Promise<string> {
    const startTime = Date.now();
    const pollInterval = 10000; // 10 seconds

    while (Date.now() - startTime < timeout) {
      const intent = await this.intentsService.findOne(intentId);

      if (intent.status === 'COMPLETED' || intent.status === 'FAILED') {
        return intent.status;
      }

      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    this.logger.warn(`Intent ${intentId} timed out after ${timeout}ms`);
    return 'TIMEOUT';
  }

  private parseTemplate(template: any, variables: Record<string, any>): any {
    // Replace {{variable}} placeholders with actual values
    const json = JSON.stringify(template);
    const replaced = json.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return variables[key] !== undefined ? variables[key] : `{{${key}}}`;
    });
    return JSON.parse(replaced);
  }
}
