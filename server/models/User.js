import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String, // Stores the JWT string sent via email
  },
  resetOtp: {
    code: { type: String },
    expiresAt: { type: Date },
    lastSentAt: { type: Date }, // Used for the 60-second rate limiting lock
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);