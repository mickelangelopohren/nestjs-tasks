import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaDatabase } from '@src/database/prisma.database';

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaDatabase) {}

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async findTask(where: Prisma.TaskWhereUniqueInput): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async listTasks(params?: Prisma.TaskFindManyArgs): Promise<Task[]> {
    return this.prisma.task.findMany(params);
  }

  async countTasks(params: Prisma.TaskCountArgs): Promise<number> {
    return this.prisma.task.count(params);
  }
}
