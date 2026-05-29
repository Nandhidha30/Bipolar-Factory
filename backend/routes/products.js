// bipolar-factory/backend/routes/products.js
// GET /api/products — returns all active ready-made software products

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/products
 * Returns the full list of ready-made software tools,
 * sorted by their display order.
 */
router.get('/', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        humanLabel: true,
        description: true,
        featuresArray: true,
        siteUrl: true,
        accentColor: true,
        iconSlug: true,
      },
    });

    // Parse the SQLite JSON string back to an array
    const parsedProducts = products.map(product => ({
      ...product,
      featuresArray: typeof product.featuresArray === 'string' ? JSON.parse(product.featuresArray) : product.featuresArray
    }));

    return res.json({
      success: true,
      count: parsedProducts.length,
      data: parsedProducts,
    });
  } catch (error) {
    console.error('[GET /api/products]', error.message);
    return res.status(500).json({
      success: false,
      error: 'We could not load the products list right now. Please try again in a moment.',
    });
  }
});

/**
 * GET /api/products/:id
 * Returns a single product by its ID.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        error: 'That product could not be found.',
      });
    }

    const parsedProduct = {
      ...product,
      featuresArray: typeof product.featuresArray === 'string' ? JSON.parse(product.featuresArray) : product.featuresArray
    };

    return res.json({ success: true, data: parsedProduct });
  } catch (error) {
    console.error('[GET /api/products/:id]', error.message);
    return res.status(500).json({
      success: false,
      error: 'We could not load that product right now. Please try again.',
    });
  }
});

module.exports = router;
