import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedAdminPassword = await bcrypt.hash('adminPass', 10);
  const hashedCustomerPassword = await bcrypt.hash('customerPass', 10);

  await prisma.user.createMany({
    data: [
      {
        userName: 'userAdmin',
        password: hashedAdminPassword,
        role: 'admin',
      },
      {
        userName: 'userCustomer',
        password: hashedCustomerPassword,
        role: 'customer',
      },
    ],
  });

  console.log('Seed data inserted successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
