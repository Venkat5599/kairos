import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SolversService } from './solvers.service';

@ApiTags('solvers')
@Controller('solvers')
export class SolversController {
  constructor(private readonly solversService: SolversService) {}

  @Get()
  @ApiOperation({ summary: 'Get all solvers' })
  @ApiResponse({ status: 200, description: 'List of solvers' })
  findAll(
    @Query('isActive') isActive?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.solversService.findAll({
      isActive: isActive === 'true',
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get solver leaderboard' })
  @ApiResponse({ status: 200, description: 'Top solvers by reputation' })
  getLeaderboard(@Query('limit') limit?: string) {
    return this.solversService.getLeaderboard(limit ? parseInt(limit) : 10);
  }

  @Get(':address')
  @ApiOperation({ summary: 'Get solver by address' })
  @ApiResponse({ status: 200, description: 'Solver details' })
  findOne(@Param('address') address: string) {
    return this.solversService.findOne(address);
  }

  @Get(':address/stats')
  @ApiOperation({ summary: 'Get solver statistics' })
  @ApiResponse({ status: 200, description: 'Solver stats' })
  getStats(@Param('address') address: string) {
    return this.solversService.getStats(address);
  }
}
