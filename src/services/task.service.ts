import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/create-task.dto';
import { TaskQueryDto } from '@src/commons/dto/list-task.dto';
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

  async listTasks(
    query: TaskQueryDto,
  ): Promise<{ tasks: Task[]; total: number }> {
    const { page = 1, limit = 10, ...filter } = query;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.taskRepository.listTasks({
        where: filter,
        skip,
        take: limit,
      }),
      this.taskRepository.countTasks({ where: filter }),
    ]);

    return { tasks, total };
  }
}
