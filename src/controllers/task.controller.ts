import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/create-task.dto';
import { TaskQueryDto } from '@src/commons/dto/list-task.dto';
import { UpdateTaskDto } from '@src/commons/dto/update-task.dto';
import { PaginationHeaders } from '@src/commons/interface/auth.interface';
import { TaskResponse } from '@src/commons/interface/task.interface';
import { TaskService } from '@src/services/task.service';
import { Response } from 'express';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task successfully created',
  })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find a task by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task found',
    type: TaskResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  async findTask(@Param('id') id: number): Promise<Task> {
    return this.taskService.findTask(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all tasks with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks retrieved',
    type: [TaskResponse],
    headers: PaginationHeaders,
  })
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
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task successfully updated',
    type: TaskResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task successfully deleted',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  async deleteTask(@Param('id') id: number): Promise<void> {
    await this.taskService.deleteTask(id);
  }
}
