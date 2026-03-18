import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { CreateMarketplaceIntentDto } from './dto/create-marketplace-intent.dto';
import { RateIntentDto } from './dto/rate-intent.dto';
import { CloneIntentDto } from './dto/clone-intent.dto';

@Controller('marketplace')
@ApiTags('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('intents')
  @ApiOperation({ summary: 'Create marketplace intent template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  create(
    @Body() dto: CreateMarketplaceIntentDto,
    @Query('creator') creator: string,
  ) {
    return this.marketplaceService.create(creator, dto);
  }

  @Get('intents')
  @ApiOperation({ summary: 'Get all marketplace intent templates' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'difficulty', required: false })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  findAll(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('search') search?: string,
  ) {
    return this.marketplaceService.findAll({
      category,
      difficulty,
      isFeatured: isFeatured === 'true',
      search,
    });
  }

  @Get('intents/:id')
  @ApiOperation({ summary: 'Get marketplace intent template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @Post('intents/:id/rate')
  @ApiOperation({ summary: 'Rate a marketplace intent template' })
  @ApiResponse({ status: 200, description: 'Rating submitted successfully' })
  rate(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() dto: RateIntentDto,
  ) {
    return this.marketplaceService.rateIntent(id, userId, dto);
  }

  @Post('intents/:id/clone')
  @ApiOperation({ summary: 'Clone a marketplace intent template' })
  @ApiResponse({ status: 201, description: 'Template cloned successfully' })
  clone(@Param('id') id: string, @Body() dto: CloneIntentDto) {
    return this.marketplaceService.cloneIntent(id, dto);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get top marketplace intent templates' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved successfully' })
  getLeaderboard(@Query('limit') limit?: string) {
    return this.marketplaceService.getLeaderboard(
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories with counts' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  getCategories() {
    return this.marketplaceService.getCategories();
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed marketplace with starter templates' })
  @ApiResponse({ status: 201, description: 'Templates seeded successfully' })
  seedTemplates() {
    return this.marketplaceService.seedTemplates();
  }
}
