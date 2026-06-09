import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },   // 'modern', 'classic', 'minimal'
  displayName: { type: String, required: true },          // 'Modern Professional'
  description: String,
  thumbnailUrl: String,
  isActive: { type: Boolean, default: true }
});

export const Template = mongoose.model('Template', templateSchema);