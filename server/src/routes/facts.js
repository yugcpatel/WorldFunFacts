/**
 * Facts API Routes (Community Facts – CRUD)
 * ---------------------------------------------------------------
 * This router handles all user-submitted country facts stored in MongoDB.
 *
 * Endpoints:
 *   GET    /api/facts/:countryCode   → Get all facts for a country
 *   POST   /api/facts                → Add a new fact
 *   PUT    /api/facts/:id/upvote     → Upvote a fact
 *   DELETE /api/facts/:id            → Delete a fact
 *
 * Features included:
 *   ✔ Input validation (express-validator)
 *   ✔ Sanitization (mongo-sanitize)
 *   ✔ MongoDB queries via Mongoose model
 *   ✔ Clean error handling and HTTP status codes
 */

import express from 'express';
import { body, param, validationResult } from 'express-validator';
import sanitize from 'mongo-sanitize';
import Fact from '../models/Fact.js';

const router = express.Router();

/**
 * GET /api/facts/:countryCode
 * ---------------------------------------------------------------
 * Returns all facts for a given country (sorted by upvotes + date)
 *
 * Params:
 *   countryCode: ISO code (2–3 letters)
 */
router.get(
  '/:countryCode',
  param('countryCode').isString().isLength({ min: 2, max: 3 }).toUpperCase(),
  async (req, res) => {

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Sanitize + normalize code
    const code = sanitize(req.params.countryCode.toUpperCase());

    // Fetch sorted facts (highest upvotes first)
    const facts = await Fact.find({ countryCode: code })
      .sort({ upvotes: -1, createdAt: -1 })
      .lean();

    res.json(facts);
  }
);

/**
 * POST /api/facts
 * ---------------------------------------------------------------
 * Creates a new fun fact for a country.
 *
 * Body:
 *   countryCode: "IN", "US"
 *   countryName: "India"
 *   factText:    "The Indian Railway is one of the largest..."
 */
router.post(
  '/',
  body('countryCode').isString().isLength({ min: 2, max: 3 }).toUpperCase(),
  body('countryName').isString().isLength({ min: 1, max: 100 }),
  body('factText').isString().isLength({ min: 10, max: 500 }),
  async (req, res) => {

    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Sanitize incoming values
    const payload = {
      countryCode: sanitize(req.body.countryCode.toUpperCase()),
      countryName: sanitize(req.body.countryName),
      factText: sanitize(req.body.factText),
    };

    try {
      const created = await Fact.create(payload);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create fact' });
    }
  }
);

/**
 * PUT /api/facts/:id/upvote
 * ---------------------------------------------------------------
 * Increments the upvote count of a fact by 1.
 *
 * Params:
 *   id: MongoDB ObjectId
 */
router.put(
  '/:id/upvote',
  param('id').isMongoId(),
  async (req, res) => {

    // Validate ID
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      // Increment upvotes atomically
      const updated = await Fact.findByIdAndUpdate(
        req.params.id,
        { $inc: { upvotes: 1 } },
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: 'Not found' });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upvote' });
    }
  }
);

/**
 * DELETE /api/facts/:id
 * ---------------------------------------------------------------
 * Deletes a fact permanently.
 *
 * Params:
 *   id: MongoDB ObjectId
 */
router.delete(
  '/:id',
  param('id').isMongoId(),
  async (req, res) => {

    // Validate ID
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const deleted = await Fact.findByIdAndDelete(req.params.id);

      if (!deleted) return res.status(404).json({ error: 'Not found' });

      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete' });
    }
  }
);

export default router;
