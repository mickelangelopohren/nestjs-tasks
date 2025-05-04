import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { TaskRepository } from '@src/repositories/task.repository';
import { TaskService } from '@src/services/task.service';

describe('TaskService', () => {
  let taskService: TaskService;

  const taskRepository = {
    createTask: jest.fn(),
    findTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: taskRepository,
        },
      ],
    }).compile();

    taskService = module.get(TaskService);
  });

  describe('createTask', () => {
    it('should call task repository', async () => {
      const repoResult = {};
      taskRepository.createTask.mockResolvedValue(repoResult);

      const data: CreateTaskDto = {
        title: 'Test task',
        description: 'Task for test the create feature',
        status: 'active',
      };

      const result = await taskService.createTask(data);

      expect(result).toBe(repoResult);
      expect(taskRepository.createTask).toHaveBeenCalledTimes(1);
      expect(taskRepository.createTask).toHaveBeenCalledWith(data);
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

      taskRepository.findTask.mockResolvedValue(mockTask);

      const result = await taskService.findTask(1);

      expect(result).toEqual(mockTask);
      expect(taskRepository.findTask).toHaveBeenCalledTimes(1);
      expect(taskRepository.findTask).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if the task does not exist', async () => {
      taskRepository.findTask.mockResolvedValue(null);

      await expect(taskService.findTask(1)).rejects.toThrow(
        'Task with ID 1 not found',
      );

      expect(taskRepository.findTask).toHaveBeenCalledTimes(1);
      expect(taskRepository.findTask).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
