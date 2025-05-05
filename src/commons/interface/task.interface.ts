import { ApiProperty } from '@nestjs/swagger';

export class TaskResponse {
  @ApiProperty({ description: 'The unique identifier of the task' })
  id: number;

  @ApiProperty({ description: 'The title of the task' })
  title: string;

  @ApiProperty({ description: 'The description of the task' })
  description: string;

  @ApiProperty({ description: 'The current status of the task' })
  status: string;

  @ApiProperty({ description: 'The date and time when the task was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the task was last updated',
  })
  updatedAt: Date;
}
