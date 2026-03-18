import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty } from 'class-validator';

export class ExecuteWorkflowDto {
  @ApiProperty({ description: 'Variables for template substitution' })
  @IsObject()
  @IsNotEmpty()
  variables: Record<string, any>;
}
