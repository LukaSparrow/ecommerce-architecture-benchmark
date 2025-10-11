import express from 'express';
import cors from 'cors';
import prisma from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Główny endpoint API
app.get('/api/products', async (req, res) => {
  try {
    const { searchQuery, category, priceMin, priceMax, inStockOnly, sortBy } = req.query;

    const where: any = {};

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery as string, mode: 'insensitive' } },
        { description: { contains: searchQuery as string, mode: 'insensitive' } },
      ];
    }
    if (category && category !== 'all') {
      where.category = category as string;
    }
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin as string);
      if (priceMax) where.price.lte = parseFloat(priceMax as string);
    }
    if (inStockOnly === 'true') {
      where.inStock = true;
    }

    const orderBy: any = {};
    switch (sortBy as string) {
      case 'price-low': orderBy.price = 'asc'; break;
      case 'price-high': orderBy.price = 'desc'; break;
      case 'rating': orderBy.rating = 'desc'; break;
      case 'newest': orderBy.createdAt = 'desc'; break;
      default: orderBy.name = 'asc';
    }

    const products = await prisma.product.findMany({ where, orderBy });
    const totalProducts = await prisma.product.count({ where });

    res.json({
      products,
      total: totalProducts,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server with PGlite+Prisma running on http://localhost:${PORT}`));