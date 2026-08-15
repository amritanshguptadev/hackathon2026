import express from 'express';
import Deal from '../models/deals.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error.message);
    res.status(500).json({ message: 'Error fetching deals', error });
  }
});

export default router;
