import express from 'express';
import FeaturedProduct from '../models/featuredProduct.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const featuredProduct = await FeaturedProduct.find();
    res.json(featuredProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error.message);
    res.status(500).json({ message: 'Error fetching deals', error });
  }
});

export default router;
