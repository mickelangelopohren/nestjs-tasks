import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaDatabase } from '@src/database/prisma.database';

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaDatabase) {}

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }
}
