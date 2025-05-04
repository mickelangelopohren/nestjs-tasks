import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/create-task.dto';
import { TaskQueryDto } from '@src/commons/dto/list-task.dto';
import { TaskRepository } from '@src/repositories/task.repository';
import { TaskService } from '@src/services/task.service';

describe('TaskService', () => {
  let taskService: TaskService;

  const taskRepositoryMock = {
    createTask: jest.fn(),
    findTask: jest.fn(),
    listTasks: jest.fn(),
    countTasks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: taskRepositoryMock,
        },
      ],
    }).compile();

    taskService = module.get(TaskService);
  });

  describe('createTask', () => {
    it('should call task repository', async () => {
      const repoResult = {};
      taskRepositoryMock.createTask.mockResolvedValue(repoResult);

      const data: CreateTaskDto = {
        title: 'Test task',
        description: 'Task for test the create feature',
        status: 'active',
      };

      const result = await taskService.createTask(data);

      expect(result).toBe(repoResult);
      expect(taskRepositoryMock.createTask).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.createTask).toHaveBeenCalledWith(data);
    });
  });

  describe('findTask', () => {
    it('should return a task if it exists', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      taskRepositoryMock.findTask.mockResolvedValue(mockTask);

      const result = await taskService.findTask(1);

      expect(result).toEqual(mockTask);
      expect(taskRepositoryMock.findTask).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.findTask).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if the task does not exist', async () => {
      taskRepositoryMock.findTask.mockResolvedValue(null);

      await expect(taskService.findTask(1)).rejects.toThrow(
        'Task with ID 1 not found',
      );

      expect(taskRepositoryMock.findTask).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.findTask).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('listTasks', () => {
    it('should return tasks and total count', async () => {
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

      const query: TaskQueryDto = { status: 'active', page: 2, limit: 5 };

      taskRepositoryMock.listTasks.mockResolvedValue(mockTasks);
      taskRepositoryMock.countTasks.mockResolvedValue(12);

      const result = await taskService.listTasks(query);

      expect(result).toEqual({ tasks: mockTasks, total: 12 });
      expect(taskRepositoryMock.listTasks).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.listTasks).toHaveBeenCalledWith({
        where: { status: 'active' },
        skip: 5,
        take: 5,
      });
      expect(taskRepositoryMock.countTasks).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.countTasks).toHaveBeenCalledWith({
        where: { status: 'active' },
      });
    });

    it('should use default values for page and limit when not provided', async () => {
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
          status: 'done',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const query: TaskQueryDto = { status: 'active' };

      taskRepositoryMock.listTasks.mockResolvedValue(mockTasks);
      taskRepositoryMock.countTasks.mockResolvedValue(15);

      const result = await taskService.listTasks(query);

      expect(result).toEqual({ tasks: mockTasks, total: 15 });
      expect(taskRepositoryMock.listTasks).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.listTasks).toHaveBeenCalledWith({
        where: { status: 'active' },
        skip: 0,
        take: 10,
      });

      expect(taskRepositoryMock.countTasks).toHaveBeenCalledTimes(1);
      expect(taskRepositoryMock.countTasks).toHaveBeenCalledWith({
        where: { status: 'active' },
      });
    });
  });
});
