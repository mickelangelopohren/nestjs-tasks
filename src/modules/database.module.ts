import { Global, Module } from '@nestjs/common';
import { PrismaDatabase } from '@src/database/prisma.database';

@Global()
@Module({
  providers: [PrismaDatabase],
  exports: [PrismaDatabase],
})
export class DatabaseModule {}
