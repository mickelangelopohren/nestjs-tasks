import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { TaskRepository } from '@src/repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  //Business logic

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
}
