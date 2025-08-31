import { PGlite } from "@electric-sql/pglite"

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
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
      price: 199.99,
      original_price: 249.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center",
      category: "Electronics",
      rating: 4.5,
      review_count: 128,
      in_stock: true,
    },
    {
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration.",
      price: 299.99,
      original_price: null,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center",
      category: "Electronics",
      rating: 4.3,
      review_count: 89,
      in_stock: true,
    },
    {
      name: "Organic Cotton T-Shirt",
      description: "Comfortable and sustainable organic cotton t-shirt in various colors.",
      price: 29.99,
      original_price: null,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center",
      category: "Clothing",
      rating: 4.7,
      review_count: 203,
      in_stock: true,
    },
    {
      name: "Professional Coffee Maker",
      description: "Programmable coffee maker with built-in grinder and thermal carafe.",
      price: 149.99,
      original_price: 179.99,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop&crop=center",
      category: "Home & Garden",
      rating: 4.4,
      review_count: 156,
      in_stock: false,
    },
    {
      name: "Yoga Mat Premium",
      description: "Non-slip yoga mat with extra cushioning and carrying strap.",
      price: 49.99,
      original_price: null,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop&crop=center",
      category: "Sports",
      rating: 4.6,
      review_count: 94,
      in_stock: true,
    },
    {
      name: "LED Desk Lamp",
      description: "Adjustable LED desk lamp with USB charging port and touch controls.",
      price: 79.99,
      original_price: null,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center",
      category: "Home & Garden",
      rating: 4.2,
      review_count: 67,
      in_stock: true,
    },
    {
      name: "Wireless Gaming Mouse",
      description: "High-precision wireless gaming mouse with customizable RGB lighting.",
      price: 89.99,
      original_price: null,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop&crop=center",
      category: "Electronics",
      rating: 4.8,
      review_count: 312,
      in_stock: true,
    },
    {
      name: "Skincare Set",
      description: "Complete skincare routine with cleanser, toner, serum, and moisturizer.",
      price: 119.99,
      original_price: 149.99,
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop&crop=center",
      category: "Beauty",
      rating: 4.5,
      review_count: 178,
      in_stock: true,
    },
    {
      name: "Educational Building Blocks",
      description: "STEM learning building blocks set for kids aged 6-12.",
      price: 39.99,
      original_price: null,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center",
      category: "Toys",
      rating: 4.9,
      review_count: 245,
      in_stock: true,
    },
    {
      name: "Bestseller Novel Collection",
      description: "Collection of 5 bestselling novels from award-winning authors.",
      price: 59.99,
      original_price: null,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop&crop=center",
      category: "Books",
      rating: 4.4,
      review_count: 89,
      in_stock: false,
    },
    {
      name: "Portable Bluetooth Speaker",
      description: "Waterproof portable speaker with 360-degree sound and 12-hour battery.",
      price: 69.99,
      original_price: null,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop&crop=center",
      category: "Electronics",
      rating: 4.3,
      review_count: 134,
      in_stock: true,
    },
    {
      name: "Winter Jacket",
      description: "Warm and stylish winter jacket with water-resistant coating.",
      price: 129.99,
      original_price: 159.99,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop&crop=center",
      category: "Clothing",
      rating: 4.6,
      review_count: 167,
      in_stock: true,
    },
  ]

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
