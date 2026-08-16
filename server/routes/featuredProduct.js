import express from 'express';
import FeaturedProduct from '../models/featuredProduct.js';
import featuredProductData from '../data/FeaturedProduct.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const featuredProduct = await FeaturedProduct.find();
    if (featuredProduct && featuredProduct.length > 0) {
      return res.json(featuredProduct);
    }
    return res.json(featuredProductData);
  } catch (error) {
    console.warn('MongoDB query failed, returning fallback featured products:', error.message);
    res.json(featuredProductData);
  }
});

export default router;
