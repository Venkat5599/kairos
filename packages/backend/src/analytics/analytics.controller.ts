import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get overall system statistics' })
  @ApiResponse({ status: 200, description: 'System stats' })
  getStats() {
    return this.analyticsService.getOverallStats();
  }

  @Get('intents-by-status')
  @ApiOperation({ summary: 'Get intent counts by status' })
  @ApiResponse({ status: 200, description: 'Intent status breakdown' })
  getIntentsByStatus() {
    return this.analyticsService.getIntentsByStatus();
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent activity' })
  @ApiResponse({ status: 200, description: 'Recent intents' })
  getRecentActivity(@Query('limit') limit?: string) {
    return this.analyticsService.getRecentActivity(limit ? parseInt(limit) : 10);
  }

  @Get('volume-by-day')
  @ApiOperation({ summary: 'Get volume by day' })
  @ApiResponse({ status: 200, description: 'Daily volume data' })
  getVolumeByDay(@Query('days') days?: string) {
    return this.analyticsService.getVolumeByDay(days ? parseInt(days) : 7);
  }

  @Get('top-solvers')
  @ApiOperation({ summary: 'Get top solvers' })
  @ApiResponse({ status: 200, description: 'Top performing solvers' })
  getTopSolvers(@Query('limit') limit?: string) {
    return this.analyticsService.getTopSolvers(limit ? parseInt(limit) : 5);
  }

  @Get('user/:address')
  @ApiOperation({ summary: 'Get user-specific analytics' })
  @ApiResponse({ status: 200, description: 'User analytics data' })
  getUserAnalytics(@Query('address') address: string) {
    return this.analyticsService.getUserAnalytics(address);
  }

  @Get('gas-optimization')
  @ApiOperation({ summary: 'Get gas optimization metrics' })
  @ApiResponse({ status: 200, description: 'Gas savings data' })
  getGasOptimization() {
    return this.analyticsService.getGasOptimizationMetrics();
  }

  @Get('solvers/leaderboard')
  @ApiOperation({ summary: 'Get detailed solver leaderboard' })
  @ApiResponse({ status: 200, description: 'Solver leaderboard with detailed stats' })
  getSolverLeaderboard(@Query('limit') limit?: string) {
    return this.analyticsService.getSolverLeaderboard(limit ? parseInt(limit) : 10);
  }

  @Get('timeseries')
  @ApiOperation({ summary: 'Get time series data' })
  @ApiResponse({ status: 200, description: 'Historical trend data' })
  getTimeSeriesData(@Query('days') days?: string) {
    return this.analyticsService.getTimeSeriesData(days ? parseInt(days) : 30);
  }
}
