import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty({ description: 'Creator wallet address' })
  @IsString()
  @IsNotEmpty()
  creator: string;

  @ApiProperty({ description: 'Workflow name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Workflow description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Workflow steps as JSON array' })
  @IsArray()
  @IsNotEmpty()
  steps: any[];

  @ApiProperty({ description: 'Whether the workflow is published', required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
