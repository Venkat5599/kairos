import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsDateString } from 'class-validator';

export class CreateScheduledIntentDto {
  @ApiProperty({ description: 'Creator wallet address' })
  @IsString()
  @IsNotEmpty()
  creator: string;

  @ApiProperty({ description: 'Name of the scheduled intent' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the scheduled intent' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Intent template as JSON object' })
  @IsObject()
  @IsNotEmpty()
  intentTemplate: any;

  @ApiProperty({ description: 'Cron expression for recurring schedules', required: false })
  @IsString()
  @IsOptional()
  cronExpression?: string;

  @ApiProperty({ description: 'Execution time for one-time schedules', required: false })
  @IsDateString()
  @IsOptional()
  executeAt?: string;

  @ApiProperty({ description: 'Execution conditions as JSON', required: false })
  @IsObject()
  @IsOptional()
  conditions?: any;
}
