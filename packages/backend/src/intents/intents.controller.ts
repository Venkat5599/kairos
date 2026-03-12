import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IntentsService } from './intents.service';
import { CreateIntentDto } from './dto/create-intent.dto';
import { UpdateIntentDto } from './dto/update-intent.dto';

@ApiTags('intents')
@Controller('intents')
export class IntentsController {
  constructor(private readonly intentsService: IntentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new intent' })
  @ApiResponse({ status: 201, description: 'Intent created successfully' })
  create(@Body() createIntentDto: CreateIntentDto) {
    return this.intentsService.create(createIntentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all intents with filters' })
  @ApiResponse({ status: 200, description: 'List of intents' })
  findAll(
    @Query('status') status?: string,
    @Query('creator') creator?: string,
    @Query('solver') solver?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.intentsService.findAll({
      status,
      creator,
      solver,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending intents' })
  @ApiResponse({ status: 200, description: 'List of pending intents' })
  getPending() {
    return this.intentsService.getPendingIntents();
  }

  @Get('creator/:address')
  @ApiOperation({ summary: 'Get intents by creator address' })
  @ApiResponse({ status: 200, description: 'List of creator intents' })
  getByCreator(@Param('address') address: string) {
    return this.intentsService.getIntentsByCreator(address);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get intent by ID' })
  @ApiResponse({ status: 200, description: 'Intent details' })
  @ApiResponse({ status: 404, description: 'Intent not found' })
  findOne(@Param('id') id: string) {
    return this.intentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update intent status' })
  @ApiResponse({ status: 200, description: 'Intent updated successfully' })
  update(@Param('id') id: string, @Body() updateIntentDto: UpdateIntentDto) {
    return this.intentsService.update(id, updateIntentDto);
  }
}
