import { PrismaClient } from '@prisma/client';
import { products } from './data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding using Prisma Client...');

  console.log('Deleting existing products...');
  await prisma.product.deleteMany({});

  console.log(`Inserting ${products.length} products...`);
  await prisma.product.createMany({
    data: products,
  });

  console.log('Products inserted successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding finished and connection closed.');
  });