import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum IntentStatus {
  PENDING = 'PENDING',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export class UpdateIntentDto {
  @ApiProperty({ enum: IntentStatus, required: false })
  @IsEnum(IntentStatus)
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'solver-uuid', required: false })
  @IsString()
  @IsOptional()
  solverId?: string;
}
