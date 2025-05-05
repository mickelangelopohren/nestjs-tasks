import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDatabase } from '@src/database/prisma.database';
import { DatabaseModule } from '@src/modules/database.module';

describe('DatabaseModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();
  });

  it('should provide PrismaDatabase', () => {
    const prismaDatabase = module.get(PrismaDatabase);

    expect(prismaDatabase).toBeDefined();
  });
});
