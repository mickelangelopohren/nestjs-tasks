import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from '@src/commons/dto/create-task.dto';
import { TaskQueryDto } from '@src/commons/dto/list-task.dto';
import { UpdateTaskDto } from '@src/commons/dto/update-task.dto';
import { Task } from '@src/commons/interface/task.interface';
import { TaskController } from '@src/controllers/task.controller';
import { TaskService } from '@src/services/task.service';
import { Response } from 'express';

describe('TaskController', () => {
  let taskController: TaskController;

  const taskServiceMock = {
    createTask: jest.fn(),
    findTask: jest.fn(),
    listTasks: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  const responseMock = {
    set: jest.fn(),
  } as unknown as jest.Mocked<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: taskServiceMock,
        },
      ],
    }).compile();

    taskController = module.get(TaskController);
  });

  /* eslint-disable @typescript-eslint/unbound-method */
  describe('createTask', () => {
    it('should call taskService.createTask with the correct parameters', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
      };

      await taskController.createTask(createTaskDto);

      expect(taskServiceMock.createTask).toHaveBeenCalledTimes(1);
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findTask', () => {
    it('should return a task if it exists', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      taskServiceMock.findTask.mockResolvedValue(mockTask);

      const result = await taskController.findTask(1);

      expect(result).toEqual(mockTask);
      expect(taskServiceMock.findTask).toHaveBeenCalledTimes(1);
      expect(taskServiceMock.findTask).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the task does not exist', async () => {
      taskServiceMock.findTask.mockRejectedValue(
        new Error('Task with ID 1 not found'),
      );

      await expect(taskController.findTask(1)).rejects.toThrow(
        'Task with ID 1 not found',
      );

      expect(taskServiceMock.findTask).toHaveBeenCalledTimes(1);
      expect(taskServiceMock.findTask).toHaveBeenCalledWith(1);
    });
  });

  describe('listTasks', () => {
    it('should return a list of tasks and set pagination headers', async () => {
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

      const query: TaskQueryDto = { status: 'active', page: 1, limit: 10 };
      const total = 20;

      taskServiceMock.listTasks.mockResolvedValue({ tasks: mockTasks, total });

      const result = await taskController.listTasks(query, responseMock);

      expect(result).toEqual(mockTasks);
      expect(taskServiceMock.listTasks).toHaveBeenCalledTimes(1);
      expect(taskServiceMock.listTasks).toHaveBeenCalledWith(query);

      expect(responseMock.set).toHaveBeenCalledWith('X-Current-Page', '1');
      expect(responseMock.set).toHaveBeenCalledWith('X-Page-Size', '10');
      expect(responseMock.set).toHaveBeenCalledWith('X-Total-Pages', '2');
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
      const total = 15;

      taskServiceMock.listTasks.mockResolvedValue({ tasks: mockTasks, total });

      const result = await taskController.listTasks(query, responseMock);

      expect(result).toEqual(mockTasks);
      expect(taskServiceMock.listTasks).toHaveBeenCalledTimes(1);
      expect(taskServiceMock.listTasks).toHaveBeenCalledWith(query);

      expect(responseMock.set).toHaveBeenCalledWith('X-Current-Page', '1');
      expect(responseMock.set).toHaveBeenCalledWith('X-Page-Size', '10');
      expect(responseMock.set).toHaveBeenCalledWith('X-Total-Pages', '2');
    });
  });

  describe('updateTask', () => {
    it('should call taskService.updateTask with the correct parameters and return the updated task', async () => {
      const id = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      const updatedTask: Task = {
        id,
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      taskServiceMock.updateTask.mockResolvedValue(updatedTask);

      const result = await taskController.updateTask(id, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(taskServiceMock.updateTask).toHaveBeenCalledTimes(1);
      expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
        id,
        updateTaskDto,
      );
    });
  });

  describe('deleteTask', () => {
    it('should call deleteTask with the correct parameters', async () => {
      const id = 1;

      await taskController.deleteTask(id);

      expect(taskServiceMock.deleteTask).toHaveBeenCalledTimes(1);
      expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(id);
    });
  });
});
