// prisma/seed.ts

import { PGlite } from '@electric-sql/pglite';
import { products } from './data.js';

async function main() {
  console.log('Start seeding using PGlite directly...');

  const db = new PGlite('./prisma/db');

  await db.ready;
  console.log('Database connection is ready.');

  await db.transaction(async (tx) => {
    console.log('Creating "Product" table if it does not exist...');
    await tx.query(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" DECIMAL(10, 2) NOT NULL,
        "original_price" DECIMAL(10, 2),
        "image" TEXT,
        "category" TEXT NOT NULL,
        "rating" DECIMAL(3, 2) NOT NULL DEFAULT 0,
        "review_count" INTEGER NOT NULL DEFAULT 0,
        "in_stock" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table schema is ready.');

    await tx.query('DELETE FROM "Product";');
    console.log('Deleted existing products.');

    console.log(`Inserting ${products.length} products...`);
    for (const product of products) {
      await tx.query(
        `INSERT INTO "Product" (name, description, price, original_price, image, category, rating, review_count, in_stock)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
          product.name,
          product.description,
          product.price,
          product.originalPrice,
          product.image,
          product.category,
          product.rating,
          product.reviewCount,
          product.inStock,
        ]
      );
    }
    console.log('Products inserted successfully.');
  });

  console.log('Seeding finished.');
}

main().catch((e) => {
  console.error('Seeding failed:');
  console.error(e);
  process.exit(1);
});