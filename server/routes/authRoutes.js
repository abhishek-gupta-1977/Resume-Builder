import express from 'express';
import { 
  signup, 
  verifyMail, 
  login, 
  requestForgotPasswordOtp, 
  verifyOtp, 
  resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user, hash password, and dispatch JWT verification email
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email via the token received in the inbox link
 * @access  Public
 */
router.post('/verify-email', verifyMail);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user, verify email status, create DB session tracking, and return profile payload
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/forgot-password/request
 * @desc    Check user email and send a 6-digit OTP code valid for 10 minutes (60s rate-limited)
 * @access  Public
 */
router.post('/forgot-password/request', requestForgotPasswordOtp);

/**
 * @route   POST /api/auth/forgot-password/verify-otp
 * @desc    Validate that the 6-digit OTP code matches and hasn't expired
 * @access  Public
 */
router.post('/forgot-password/verify-otp', verifyOtp);

/**
 * @route   POST /api/auth/forgot-password/reset
 * @desc    Verify OTP again, enforce password complexity rules, flush active sessions, and update DB
 * @access  Public
 */
router.post('/forgot-password/reset', resetPassword);

export default router;