import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
}
