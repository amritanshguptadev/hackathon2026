import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import dealsRoute from './routes/deals.js';
import categoryRoute from './routes/categories.js';
import featuredProductsRoute from './routes/featuredProduct.js';
import authRoutes from './routes/auth.js'; 
import productRoute from './routes/productDetails.js'
import userProfile from './routes/profile.js'
dotenv.config();

import './models/db.js'

const app = express();
const PORT = process.env.port || 3000;


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(`Studx backend is running on port ${PORT}`);
});

// Middleware
app.use('/api/deals', dealsRoute);
app.use('/api/category', categoryRoute);
app.use('/api/featured-products', featuredProductsRoute);
app.use("/api/auth", authRoutes);
app.use("/", productRoute);
app.use('/api/',userProfile)
// MongoDB connection

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
