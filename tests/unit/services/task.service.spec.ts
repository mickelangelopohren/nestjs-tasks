import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { TaskRepository } from '@src/repositories/task.repository';
import { TaskService } from '@src/services/task.service';

describe('TaskService', () => {
  let taskService: TaskService;

  const taskRepository = {
    createTask: jest.fn(),
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
});
