import { TaskStatus } from '@src/commons/enums/task.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(500)
  readonly description?: string;

  @IsEnum(TaskStatus)
  readonly status: string;
}
