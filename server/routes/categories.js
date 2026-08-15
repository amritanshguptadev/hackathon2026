import express from 'express';
import Category from '../models/category.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Error fetching category', error });
  }
});

export default router;