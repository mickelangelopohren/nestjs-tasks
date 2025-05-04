import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { TaskController } from '@src/controllers/task.controller';
import { TaskService } from '@src/services/task.service';

describe('TaskController', () => {
  let taskController: TaskController;

  const mockTaskService = {
    createTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    taskController = module.get(TaskController);
  });

  describe('createTask', () => {
    it('should call task service with the correct parameters', async () => {
      const serviceResult = {};
      mockTaskService.createTask.mockResolvedValue(serviceResult);

      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
      };

      const result = await taskController.createTask(createTaskDto);

      expect(result).toBeUndefined();
      expect(mockTaskService.createTask).toHaveBeenCalledTimes(1);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });
});
