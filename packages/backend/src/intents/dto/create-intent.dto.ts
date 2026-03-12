import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIntentDto {
  @ApiProperty({ example: 1000, description: 'Chain ID' })
  @IsNumber()
  @IsNotEmpty()
  chainId: number;

  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', description: 'Creator address' })
  @IsString()
  @IsNotEmpty()
  creator: string;

  @ApiProperty({ example: 'Send 20 USDC to Alice', description: 'Intent description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '0x...', description: 'Encoded intent data', required: false })
  @IsString()
  data?: string;

  @ApiProperty({ example: '1000000000000000000', description: 'Reward amount in wei' })
  @IsString()
  @IsNotEmpty()
  reward: string;

  @ApiProperty({ example: 1704067200, description: 'Deadline timestamp' })
  @IsNumber()
  @Min(Math.floor(Date.now() / 1000))
  deadline: number;

  @ApiProperty({ example: '0x...', description: 'Transaction hash', required: false })
  @IsString()
  txHash?: string;
}
