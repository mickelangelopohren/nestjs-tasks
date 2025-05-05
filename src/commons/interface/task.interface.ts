import { ApiProperty } from '@nestjs/swagger';
import { Task as PrismaTask } from '@prisma/client';
import { Exclude } from 'class-transformer';

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

export class Task implements PrismaTask {
  @ApiProperty({ description: 'The unique identifier of the task' })
  id: number;

  @ApiProperty({ description: 'The title of the task' })
  title: string;

  @ApiProperty({ description: 'The description of the task' })
  description: string | null;

  @ApiProperty({ description: 'The current status of the task' })
  status: string;

  @ApiProperty({ description: 'The date and time when the task was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the task was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The date and time when the task was deleted',
    nullable: true,
  })
  @Exclude()
  deletedAt: Date | null;
}
