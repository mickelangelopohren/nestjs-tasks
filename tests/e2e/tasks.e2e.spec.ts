import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Task } from '@prisma/client';
import { AuthResponse } from '@src/commons/interface/auth.interface';
import { AppModule } from '@src/modules/app.module';
import * as request from 'supertest';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let jwtToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    prisma = new PrismaClient();

    // Authenticate and get a JWT token
    const authResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ userName: 'userAdmin', password: 'adminPass' })
      .expect(200);

    jwtToken = (authResponse.body as AuthResponse).accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await prisma.task.deleteMany();
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createTaskDto)
        .expect(200);
      const createdTask = response.body as Task;

      expect(createdTask).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
      });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should retrieve a task by ID', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          status: 'active',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body as Task).toMatchObject({
        id: task.id,
        title: 'Test Task',
        description: 'Test Description',
        status: 'active',
      });
    });

    it('should return 404 if the task is not found', async () => {
      await request(app.getHttpServer())
        .get('/tasks/999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });

  describe('GET /tasks', () => {
    it('should list all tasks with pagination headers', async () => {
      await prisma.task.create({
        data: {
          title: 'Task 1',
          description: 'Description 1',
          status: 'active',
        },
      });

      await prisma.task.create({
        data: { title: 'Task 2', description: 'Description 2', status: 'done' },
      });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.headers['x-current-page']).toBe('1');
      expect(response.headers['x-page-size']).toBe('10');
      expect(response.headers['x-total-pages']).toBeDefined();

      expect(Array.isArray(response.body)).toBe(true);
      expect((response.body as Task[]).length).toBe(2);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task by ID', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Old Task',
          description: 'Old Description',
          status: 'active',
        },
      });

      const updateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body as Task).toMatchObject({
        id: task.id,
        title: 'Updated Task',
        description: 'Updated Description',
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should soft delete a task by ID', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Task to Delete',
          description: 'Description',
          status: 'active',
        },
      });

      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(204);

      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });

      expect(deletedTask).toMatchObject({
        id: task.id,
        title: 'Task to Delete',
        description: 'Description',
        status: 'active',
        deletedAt: expect.any(Date),
      });
    });
  });
});
