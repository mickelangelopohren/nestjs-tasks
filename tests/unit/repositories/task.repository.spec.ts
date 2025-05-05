import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/create-task.dto';
import { PrismaDatabase } from '@src/database/prisma.database';
import { TaskRepository } from '@src/repositories/task.repository';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;

  const prismaMock = {
    task: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
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

  describe('listTasks', () => {
    it('should return a list of tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const params = {
        where: { status: 'active', deletedAt: null },
        skip: 5,
        take: 5,
      };

      prismaMock.task.findMany.mockResolvedValue(mockTasks);

      const result = await taskRepository.listTasks(params);

      expect(result).toEqual(mockTasks);
      expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.task.findMany).toHaveBeenCalledWith(params);
    });

    it('should return the total count of tasks', async () => {
      const params = { where: { status: 'active' } };

      prismaMock.task.count.mockResolvedValue(12);

      const result = await taskRepository.countTasks(params);

      expect(result).toEqual(12);
      expect(prismaMock.task.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.task.count).toHaveBeenCalledWith(params);
    });
  });

  describe('updateTask', () => {
    it('should update the task and return the updated task', async () => {
      const id = 1;
      const updateData: Partial<Task> = { title: 'Updated Task' };

      const updatedTask: Task = {
        id,
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      prismaMock.task.update.mockResolvedValue(updatedTask);

      const result = await taskRepository.updateTask({
        where: { id },
        data: updateData,
      });

      expect(result).toEqual(updatedTask);
      expect(prismaMock.task.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });
  });

  describe('softDeleteTask', () => {
    it('should soft delete the task and return the updated task', async () => {
      const id = 1;
      const now = new Date();

      const updatedTask: Task = {
        id,
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: now,
      };

      prismaMock.task.update.mockResolvedValue(updatedTask);

      const result = await taskRepository.softDeleteTask({ id });

      expect(result).toEqual(updatedTask);
      expect(prismaMock.task.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id },
        data: { deletedAt: now.toISOString() },
      });
    });
  });
});
