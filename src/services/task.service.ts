import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { TaskRepository } from '@src/repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async findTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findTask({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
}
