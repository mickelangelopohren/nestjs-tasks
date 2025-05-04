import { Module } from '@nestjs/common';
import { TaskController } from '@src/controllers/task.controller';
import { TaskRepository } from '@src/repositories/task.repository';
import { TaskService } from '@src/services/task.service';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class AppModule {}
