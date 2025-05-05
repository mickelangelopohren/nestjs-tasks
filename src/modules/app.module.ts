import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TaskController } from '@src/controllers/task.controller';
import { AuthGuard } from '@src/guards/auth.guard';
import { TaskRepository } from '@src/repositories/task.repository';
import { TaskService } from '@src/services/task.service';
import { AuthModule } from './auth.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [TaskController],
  providers: [
    TaskService,
    TaskRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
