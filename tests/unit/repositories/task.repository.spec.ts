import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from '@src/commons/dto/tasks/create-task.dto';
import { PrismaDatabase } from '@src/database/prisma.database';
import { TaskRepository } from '@src/repositories/task.repository';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;

  const prismaMock = {
    task: {
      create: jest.fn(),
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
});
