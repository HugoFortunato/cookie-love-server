import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.sharedPhrase.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash('123456', 1);

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',

      passwordHash,
    },
  });

  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),

      passwordHash,
    },
  });

  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash,
    },
  });

  const phrases = Array.from({ length: 100 }).map(() => ({
    content: faker.lorem.sentence(),
  }));

  await prisma.phrase.createMany({
    data: phrases,
  });
}
seed().then(() => {
  console.log('Database seeded!');
});
