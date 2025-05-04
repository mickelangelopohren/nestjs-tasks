import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { PrismaDatabase } from '@src/database/prisma.database';
import { TaskRepository } from '@src/repositories/task.repository';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;

  const prismaMock = {
    task: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        TaskRepository,
        {
          provide: PrismaDatabase,
          useValue: prismaMock,
        },
      ],
    }).compile();

    taskRepository = module.get(TaskRepository);
  });

  describe('create', () => {
    it('should return created task', async () => {
      const dbResult = {};
      prismaMock.task.create.mockResolvedValue(dbResult);

      const data: CreateTaskDto = {
        title: 'Test task',
        description: 'Task for test the create feature',
        status: 'active',
      };

      const result = await taskRepository.createTask(data);

      expect(result).toBe(dbResult);
      expect(prismaMock.task.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.task.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('findTask', () => {
    it('should find a task by unique identifier and not soft-deleted', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const where: Prisma.TaskWhereUniqueInput = { id: 1 };

      prismaMock.task.findFirst.mockResolvedValue(mockTask);

      const result = await taskRepository.findTask(where);

      expect(result).toEqual(mockTask);
      expect(prismaMock.task.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
        where: {
          ...where,
          deletedAt: null,
        },
      });
    });

    it('should return null if no task is found', async () => {
      const where: Prisma.TaskWhereUniqueInput = { id: 1 };

      prismaMock.task.findFirst.mockResolvedValue(null);

      const result = await taskRepository.findTask(where);

      expect(result).toBeNull();
      expect(prismaMock.task.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
        where: {
          ...where,
          deletedAt: null,
        },
      });
    });
  });
});
