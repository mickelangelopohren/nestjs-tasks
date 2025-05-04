import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDatabase } from '@src/database/prisma.database';

describe('PrismaDatabase', () => {
  let prismaDatabase: PrismaDatabase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaDatabase],
    }).compile();

    prismaDatabase = module.get(PrismaDatabase);
  });

  describe('onModuleInit', () => {
    it('should call connect when the module is initialized', async () => {
      const connectSpy = jest.spyOn(prismaDatabase, '$connect');

      await prismaDatabase.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should call disconnect when the module is destroyed', async () => {
      const disconnectSpy = jest.spyOn(prismaDatabase, '$disconnect');

      await prismaDatabase.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
