import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@src/controllers/task.controller';
import { AppModule } from '@src/modules/app.module';
import { DatabaseModule } from '@src/modules/database.module';
import { TaskRepository } from '@src/repositories/task.repository';
import { TaskService } from '@src/services/task.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should import DatabaseModule', () => {
    const databaseModule = module.get(DatabaseModule);

    expect(databaseModule).toBeDefined();
  });

  it('should provide TaskController', () => {
    const taskController = module.get(TaskController);

    expect(taskController).toBeDefined();
  });

  it('should provide TaskService', () => {
    const taskService = module.get(TaskService);

    expect(taskService).toBeDefined();
  });

  it('should provide TaskRepository', () => {
    const taskRepository = module.get(TaskRepository);

    expect(taskRepository).toBeDefined();
  });
});
