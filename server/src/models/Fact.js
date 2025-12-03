/**
 * Fact Model (MongoDB / Mongoose)
 * ---------------------------------------------------------------
 * This schema stores user-submitted fun facts for each country.
 *
 * Each fact is tied to a specific country using:
 *  - countryCode (ISO Alpha-2, e.g., "IN", "CA")
 *  - countryName (full readable name)
 *
 * The schema also stores:
 *  - factText: the content of the fun fact
 *  - upvotes: community voting score
 *  - timestamps: createdAt & updatedAt automatically tracked
 */

import mongoose from 'mongoose';

const FactSchema = new mongoose.Schema(
  {
    /** ISO two-letter country code (e.g., "US", "JP") */
    countryCode: { type: String, required: true, index: true },

    /** Full readable country name (used for display in UI) */
    countryName: { type: String, required: true },

    /** The fun fact text submitted by a user */
    factText: { type: String, required: true, maxlength: 500 },

    /** Community upvote count */
    upvotes: { type: Number, default: 0 }
  },

  /**
   * timestamps: automatically adds:
   *   - createdAt
   *   - updatedAt
   */
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Export the model for use in routes/controllers
export default mongoose.model('Fact', FactSchema);
