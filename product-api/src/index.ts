import express from 'express';
import cors from 'cors';
import prisma from './db.js';
import { Prisma } from '@prisma/client';

const app = express();

app.use(cors());
app.use(express.json());

// Główny endpoint API
app.get('/api/products', async (req, res) => {
  try {
    const {
      searchQuery,
      category,
      priceMin,
      priceMax,
      inStockOnly,
      sortBy,
    } = req.query;

    const where: Prisma.ProductWhereInput = {};

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery as string } },
        { description: { contains: searchQuery as string } },
      ];
    }

    if (category && category !== 'all') {
      where.category = category as string;
    }

    if (priceMin || priceMax) {
      where.price = {
        ...(priceMin && { gte: Number(priceMin) }),
        ...(priceMax && { lte: Number(priceMax) }),
      };
    }

    if (inStockOnly === 'true') {
      where.inStock = true;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput;

    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { name: 'asc' };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    const totalProducts = await prisma.product.count({ where });

    res.json({ products, total: totalProducts });

  } catch (error: any) {
    console.error('Prisma query failed:', error);
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message,
    });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server with SQLite+Prisma running on http://localhost:${PORT}`));