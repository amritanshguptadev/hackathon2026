import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import http from 'http';
import dealsRoute from './routes/deals.js';
import categoryRoute from './routes/categories.js';
import featuredProductsRoute from './routes/featuredProduct.js';
import authRoutes from './routes/auth.js'; 
import productRoute from './routes/productDetails.js';
import userProfile from './routes/profile.js';
import conversationRoute from './routes/conversation.js';
import initSocket from './socket/index.js';
dotenv.config();

import './models/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || process.env.port || 3000;

// Dynamic CORS configuration supporting local dev and Vercel production
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      process.env.NODE_ENV !== 'production' ||
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      (origin && origin.includes('.vercel.app'))
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback for seamless client connection
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Initialize Socket.IO
initSocket(server, allowedOrigins);

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API (used for Render deployment health monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Root route
app.get('/', (req, res) => {
  res.send(`BuyKaro backend is running on port ${PORT}`);
});

// Middleware & APIs
app.use('/api/deals', dealsRoute);
app.use('/api/category', categoryRoute);
app.use('/api/featured-products', featuredProductsRoute);
app.use('/api/auth', authRoutes);
app.use('/', productRoute);
app.use('/api/', userProfile);
app.use('/api/conversations', conversationRoute);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

