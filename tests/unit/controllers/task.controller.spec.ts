import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { TaskController } from '@src/controllers/task.controller';
import { TaskService } from '@src/services/task.service';

describe('TaskController', () => {
  let taskController: TaskController;

  const taskServiceMock = {
    createTask: jest.fn(),
    findTask: jest.fn(),
  };

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
});
