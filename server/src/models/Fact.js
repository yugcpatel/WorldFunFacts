import mongoose from 'mongoose';

const FactSchema = new mongoose.Schema({
  countryCode: { type: String, required: true, index: true },
  countryName: { type: String, required: true },
  factText: { type: String, required: true, maxlength: 500 },
  upvotes: { type: Number, default: 0 }
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.model('Fact', FactSchema);
