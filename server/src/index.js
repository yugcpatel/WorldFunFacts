/**
 * Server Setup (Express + MongoDB)
 * ---------------------------------------------------------------
 * This file initializes the backend server for the World Fun Facts app.
 *
 * Responsibilities:
 *  - Load environment variables
 *  - Initialize Express server
 *  - Configure security middlewares (CORS, Helmet)
 *  - Configure logging (Morgan)
 *  - Connect to MongoDB using Mongoose
 *  - Register all API routes (Community Facts + AI Facts)
 *  - Start the HTTP server
 *
 * API Routes:
 *   /api/facts   → CRUD operations for community facts
 *   /api/ai      → AI-generated fun facts (Gemini API)
 *   /api/health  → Simple uptime/health check
 */

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Route files
import factsRouter from './routes/facts.js';
import aiFactsRouter from './routes/aifacts.js';

const app = express();

/**
 * CORS Configuration
 * ---------------------------------------------------------------
 * Allows frontend (default: http://localhost:5173) to communicate
 * with the backend API safely.
 */
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: false
}));

/**
 * Security & Logging Middlewares
 * ---------------------------------------------------------------
 * Helmet  → protects against common HTTP vulnerabilities
 * Morgan  → logs incoming requests (useful for debugging)
 */
app.use(helmet());
app.use(morgan('dev'));

/**
 * Request Body Parsing
 * ---------------------------------------------------------------
 * Accepts JSON request bodies up to 1 MB.
 */
app.use(express.json({ limit: '1mb' }));

/**
 * API Route Mounting
 * ---------------------------------------------------------------
 * /api/facts → Handles Facts CRUD (GET, POST, PUT, DELETE)
 * /api/ai    → AI fun facts from Google Gemini
 */
app.use('/api/facts', factsRouter);
app.use('/api/ai', aiFactsRouter);

/**
 * Health Check Endpoint
 * ---------------------------------------------------------------
 * Allows quick verification that the server is running.
 */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

/**
 * MongoDB Connection + Server Startup
 * ---------------------------------------------------------------
 * MongoDB URI is required—exit early if missing.
 * Once connected, start the Express server.
 */
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
