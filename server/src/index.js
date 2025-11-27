import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import factsRouter from './routes/facts.js';
import aifacts from './routes/aifacts.js';

const app = express();

// CORS
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: false }));

// Security & logging
app.use(helmet());
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/facts', factsRouter);
app.use('/api/ai', aifacts); 

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// MongoDB
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
