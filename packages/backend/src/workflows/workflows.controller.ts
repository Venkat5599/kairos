import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { WorkflowExecutorService } from './workflow-executor.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { ExecuteWorkflowDto } from './dto/execute-workflow.dto';

@Controller('workflows')
@ApiTags('workflows')
export class WorkflowsController {
  constructor(
    private readonly workflowsService: WorkflowsService,
    private readonly executorService: WorkflowExecutorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully' })
  create(@Body() dto: CreateWorkflowDto) {
    return this.workflowsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiQuery({ name: 'creator', required: false, description: 'Filter by creator address' })
  @ApiQuery({ name: 'isPublished', required: false, description: 'Filter by published status' })
  @ApiResponse({ status: 200, description: 'List of workflows' })
  findAll(
    @Query('creator') creator?: string,
    @Query('isPublished') isPublished?: string,
  ) {
    const filters: any = {};
    if (creator) filters.creator = creator;
    if (isPublished !== undefined) filters.isPublished = isPublished === 'true';

    return this.workflowsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workflow by ID' })
  @ApiResponse({ status: 200, description: 'Workflow details' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow updated successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateWorkflowDto>) {
    return this.workflowsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow deleted successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  delete(@Param('id') id: string) {
    return this.workflowsService.delete(id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute a workflow' })
  @ApiResponse({ status: 201, description: 'Workflow execution started' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  execute(@Param('id') id: string, @Body() dto: ExecuteWorkflowDto) {
    return this.executorService.executeWorkflow(id, dto.variables);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a workflow' })
  @ApiResponse({ status: 200, description: 'Workflow published successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  publish(@Param('id') id: string) {
    return this.workflowsService.publish(id);
  }

  @Get(':id/executions')
  @ApiOperation({ summary: 'Get execution history for a workflow' })
  @ApiResponse({ status: 200, description: 'List of executions' })
  getExecutions(@Param('id') id: string) {
    return this.workflowsService.getExecutions(id);
  }

  @Get('executions/:executionId')
  @ApiOperation({ summary: 'Get a specific workflow execution' })
  @ApiResponse({ status: 200, description: 'Execution details' })
  @ApiResponse({ status: 404, description: 'Execution not found' })
  getExecution(@Param('executionId') executionId: string) {
    return this.workflowsService.getExecution(executionId);
  }
}
