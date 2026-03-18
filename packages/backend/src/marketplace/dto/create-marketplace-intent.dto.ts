import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateMarketplaceIntentDto {
  @ApiProperty({ example: 'Quick USDC Transfer', description: 'Template name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Send USDC to any address instantly', description: 'Template description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'transfer', enum: ['transfer', 'cross-chain', 'staking', 'defi', 'governance'] })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'beginner', enum: ['beginner', 'intermediate', 'advanced'] })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ example: { command: 'send {{amount}} USDC to {{recipient}}' }, description: 'Intent template' })
  @IsNotEmpty()
  template: any;

  @ApiProperty({ example: '💵', description: 'Template icon', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: ['usdc', 'transfer', 'stablecoin'], description: 'Tags', required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: true, description: 'Is public', required: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
