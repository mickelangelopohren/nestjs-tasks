import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { TaskService } from '@src/services/task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<void> {
    await this.taskService.createTask(createTaskDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findTask(@Param('id') id: number): Promise<Task> {
    return this.taskService.findTask(id);
  }
}
