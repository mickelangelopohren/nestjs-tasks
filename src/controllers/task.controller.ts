import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/create-task.dto';
import { TaskQueryDto } from '@src/commons/dto/list-task.dto';
import { UpdateTaskDto } from '@src/commons/dto/update-task.dto';
import { TaskService } from '@src/services/task.service';
import { Response } from 'express';

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

  @Get()
  @HttpCode(HttpStatus.OK)
  async listTasks(
    @Query() query: TaskQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Task[]> {
    const { tasks, total } = await this.taskService.listTasks(query);

    const { page = 1, limit = 10 } = query;
    const totalPages = Math.ceil(total / limit);

    res.set('X-Current-Page', page.toString());
    res.set('X-Page-Size', limit.toString());
    res.set('X-Total-Pages', totalPages.toString());

    return tasks;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }
}
