import express from 'express';
import { body, param, validationResult } from 'express-validator';
import sanitize from 'mongo-sanitize';
import Fact from '../models/Fact.js';

const router = express.Router();

// GET /api/facts/:countryCode
router.get('/:countryCode',
  param('countryCode').isString().isLength({ min: 2, max: 3 }).toUpperCase(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const code = sanitize(req.params.countryCode.toUpperCase());
    const facts = await Fact.find({ countryCode: code }).sort({ upvotes: -1, createdAt: -1 }).lean();
    res.json(facts);
  }
);

// POST /api/facts
router.post('/',
  body('countryCode').isString().isLength({ min: 2, max: 3 }).toUpperCase(),
  body('countryName').isString().isLength({ min: 1, max: 100 }),
  body('factText').isString().isLength({ min: 10, max: 500 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

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

// PUT /api/facts/:id/upvote
router.put('/:id/upvote',
  param('id').isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updated = await Fact.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upvote' });
    }
  }
);

// DELETE /api/facts/:id
router.delete('/:id',
  param('id').isMongoId(),
  async (req, res) => {
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
