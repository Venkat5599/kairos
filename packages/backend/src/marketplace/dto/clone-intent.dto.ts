import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CloneIntentDto {
  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', description: 'User address' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'intent-123', description: 'Created intent ID' })
  @IsString()
  @IsNotEmpty()
  intentId: string;

  @ApiProperty({ example: true, description: 'Was the intent successful', required: false })
  @IsBoolean()
  @IsOptional()
  success?: boolean;

  @ApiProperty({ example: '0.001', description: 'Gas saved in ETH', required: false })
  @IsString()
  @IsOptional()
  gasSaved?: string;

  @ApiProperty({ example: 5000, description: 'Execution time in milliseconds', required: false })
  @IsNumber()
  @IsOptional()
  executionTime?: number;
}
