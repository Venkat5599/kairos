import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateScheduledIntentDto {
  @ApiProperty({ description: 'Name of the scheduled intent', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description of the scheduled intent', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the schedule is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Cron expression for recurring schedules', required: false })
  @IsString()
  @IsOptional()
  cronExpression?: string;

  @ApiProperty({ description: 'Execution time for one-time schedules', required: false })
  @IsDateString()
  @IsOptional()
  executeAt?: string;
}
