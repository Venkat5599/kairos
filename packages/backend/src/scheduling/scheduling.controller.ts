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
import { SchedulingService } from './scheduling.service';
import { CreateScheduledIntentDto } from './dto/create-scheduled-intent.dto';
import { UpdateScheduledIntentDto } from './dto/update-scheduled-intent.dto';

@Controller('scheduling')
@ApiTags('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('intents')
  @ApiOperation({ summary: 'Create a scheduled intent' })
  @ApiResponse({ status: 201, description: 'Scheduled intent created successfully' })
  create(@Body() dto: CreateScheduledIntentDto) {
    return this.schedulingService.create(dto);
  }

  @Get('intents')
  @ApiOperation({ summary: 'Get all scheduled intents' })
  @ApiQuery({ name: 'creator', required: false, description: 'Filter by creator address' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'List of scheduled intents' })
  findAll(
    @Query('creator') creator?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    if (creator) filters.creator = creator;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return this.schedulingService.findAll(filters);
  }

  @Get('intents/:id')
  @ApiOperation({ summary: 'Get a scheduled intent by ID' })
  @ApiResponse({ status: 200, description: 'Scheduled intent details' })
  @ApiResponse({ status: 404, description: 'Scheduled intent not found' })
  findOne(@Param('id') id: string) {
    return this.schedulingService.findOne(id);
  }

  @Patch('intents/:id')
  @ApiOperation({ summary: 'Update a scheduled intent' })
  @ApiResponse({ status: 200, description: 'Scheduled intent updated successfully' })
  @ApiResponse({ status: 404, description: 'Scheduled intent not found' })
  update(@Param('id') id: string, @Body() dto: UpdateScheduledIntentDto) {
    return this.schedulingService.update(id, dto);
  }

  @Delete('intents/:id')
  @ApiOperation({ summary: 'Delete a scheduled intent' })
  @ApiResponse({ status: 200, description: 'Scheduled intent deleted successfully' })
  @ApiResponse({ status: 404, description: 'Scheduled intent not found' })
  delete(@Param('id') id: string) {
    return this.schedulingService.delete(id);
  }

  @Get('intents/:id/executions')
  @ApiOperation({ summary: 'Get execution history for a scheduled intent' })
  @ApiResponse({ status: 200, description: 'List of executions' })
  getExecutions(@Param('id') id: string) {
    return this.schedulingService.getExecutions(id);
  }
}
