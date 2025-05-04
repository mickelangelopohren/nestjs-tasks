import { TaskStatus } from '@src/commons/enums/task.enum';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  readonly title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  readonly description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: string;
}
