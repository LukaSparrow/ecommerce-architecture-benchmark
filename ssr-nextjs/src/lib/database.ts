import { PGlite } from "@electric-sql/pglite"
import { products } from "../../../data/products"

let db: PGlite | null = null

export async function getDatabase(): Promise<PGlite> {
  if (!db) {
    db = new PGlite()
    await initializeDatabase(db)
  }
  return db
}

async function initializeDatabase(database: PGlite) {
  // Create products table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2),
      image VARCHAR(500),
      category VARCHAR(100) NOT NULL,
      rating DECIMAL(3,2) NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      in_stock BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Check if data already exists
  const result = await database.query("SELECT COUNT(*) as count FROM products")
  const count = result.rows[0].count as number

  if (count === 0) {
    await seedDatabase(database)
  }
}

async function seedDatabase(database: PGlite) {
  for (const product of products) {
    await database.query(
      `
      INSERT INTO products (name, description, price, original_price, image, category, rating, review_count, in_stock)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      [
        product.name,
        product.description,
        product.price,
        product.original_price,
        product.image,
        product.category,
        product.rating,
        product.review_count,
        product.in_stock,
      ],
    )
  }

  console.log(`Seeded database with ${products.length} products`)
}

export async function searchProducts(
  searchQuery = "",
  category = "",
  priceMin = 0,
  priceMax = 1000,
  inStockOnly = false,
  sortBy = "name",
  limit = 12,
  offset = 0,
) {
  const db = await getDatabase()

  let query = `
    SELECT 
      id,
      name,
      description,
      price,
      original_price,
      image,
      category,
      rating,
      review_count,
      in_stock,
      created_at
    FROM products
    WHERE price >= $3 AND price <= $4
  `

  const params: any[] = [limit, offset, priceMin, priceMax]
  let paramIndex = 5

  // Add search filter
  if (searchQuery) {
    query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
    params.push(`%${searchQuery}%`)
    paramIndex++
  }

  // Add category filter
  if (category && category !== "all") {
    query += ` AND category = $${paramIndex}`
    params.push(category)
    paramIndex++
  }

  // Add stock filter
  if (inStockOnly) {
    query += ` AND in_stock = true`
  }

  // Add sorting
  switch (sortBy) {
    case "price-low":
      query += " ORDER BY price ASC"
      break
    case "price-high":
      query += " ORDER BY price DESC"
      break
    case "rating":
      query += " ORDER BY rating DESC"
      break
    case "newest":
      query += " ORDER BY created_at DESC"
      break
    default:
      query += " ORDER BY name ASC"
  }

  query += ` LIMIT $1 OFFSET $2`

  const result = await db.query(query, params)

  // Get total count for pagination
  let countQuery = `
    SELECT COUNT(*) as total
    FROM products
    WHERE price >= $1 AND price <= $2
  `

  const countParams: any[] = [priceMin, priceMax]
  let countParamIndex = 3

  if (searchQuery) {
    countQuery += ` AND (name ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`
    countParams.push(`%${searchQuery}%`)
    countParamIndex++
  }

  if (category && category !== "all") {
    countQuery += ` AND category = $${countParamIndex}`
    countParams.push(category)
    countParamIndex++
  }

  if (inStockOnly) {
    countQuery += ` AND in_stock = true`
  }

  const countResult = await db.query(countQuery, countParams)
  const total = countResult.rows[0].total as number

  return {
    products: result.rows.map((row) => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      price: Number.parseFloat(row.price),
      originalPrice: row.original_price ? Number.parseFloat(row.original_price) : undefined,
      image: row.image,
      category: row.category,
      rating: Number.parseFloat(row.rating),
      reviewCount: row.review_count,
      inStock: row.in_stock,
      createdAt: row.created_at,
    })),
    total,
  }
}

export async function getCategories() {
  const db = await getDatabase()
  const result = await db.query("SELECT DISTINCT category FROM products ORDER BY category")
  return result.rows.map((row) => row.category)
}
