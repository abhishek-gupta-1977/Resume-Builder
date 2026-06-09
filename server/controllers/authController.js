import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendOtpEmail,
  sendPasswordChangedEmail,
} from "../utils/mailer.js";

// Helper: Password complexity validation rule
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;
  return passwordRegex.test(password);
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    }

    // Password validation during signup
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate Verification JWT
    const emailVerificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken: emailVerificationToken,
    });

    await newUser.save();

    // Fire off verification payload link
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
    await sendVerificationEmail(email, name, verificationUrl);

    return res.status(201).json({
      success: true,
      message: "Account created! Verification email dispatched successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyMail = async (req, res) => {
  try {
    const { token } = req.body; // Token coming from URL query parameters string in UI

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Verification token missing." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Token is invalid or expired." });
    }

    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid verification token or account verified already.",
      });
    }

    // Process and switch verification states
    user.isVerified = true;
    user.verificationToken = undefined; // Drop clear to save space and nullify re-use vectors
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Strict Rule Block: Gate accounts that have not verified emails
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your account first via the email sent to you before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Set interactive user structural flags and hydrate state data early
    user.isLoggedIn = true;
    await user.save();

    // Create App Session JWT Token
    const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store active tracking record inside Database Session collection
    const session = new Session({
      userId: user._id,
      token: sessionToken,
      deviceInfo: req.headers["user-agent"] || "Unknown Device",
    });
    await session.save();

    // Scrub confidential values out before transmitting response profile data to client early
    const userProfilePayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      isLoggedIn: user.isLoggedIn,
    };

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token: sessionToken,
      user: userProfilePayload, // Pre-fetched data ready for client features state consumption
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // For safety layers, we don't leak user existence directly, but per your spec requirements:
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user account found with that email address.",
      });
    }

    const now = new Date();

    // 60-Second Custom Rate Limiting validation check
    if (user.resetOtp?.lastSentAt) {
      const timeDiffSeconds = Math.floor(
        (now - new Date(user.resetOtp.lastSentAt)) / 1000,
      );
      if (timeDiffSeconds < 60) {
        return res.status(422).json({
          success: false,
          message: `Please wait ${60 - timeDiffSeconds} seconds before requesting a new OTP code.`,
        });
      }
    }

    // Generate random secure 6 digit numeric code string
    const generatedOtp = crypto.randomInt(100000, 999999).toString();
    const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    user.resetOtp = {
      code: generatedOtp,
      expiresAt: otpExpiryTime,
      lastSentAt: now,
    };
    await user.save();

    await sendOtpEmail(user.email, generatedOtp);

    return res.status(200).json({
      success: true,
      message:
        "A 6-digit verification code OTP has been dispatched to your email address.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetOtp?.code) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request details." });
    }

    if (new Date() > new Date(user.resetOtp.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "OTP token code has expired. Request a new one.",
      });
    }

    if (user.resetOtp.code !== otpCode) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect OTP code." });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Proceed to update password.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one special character, and one number.",
      });
    }

    const user = await User.findOne({ email });
    if (!user || user.resetOtp?.code !== otpCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid session profile execution.",
      });
    }

    // Verify OTP again to ensure it hasn't expired during typing phase
    if (new Date() > new Date(user.resetOtp.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "OTP validation reference context has expired.",
      });
    }

    // Update and re-hash password
    user.password = await bcrypt.hash(password, 12);
    user.isLoggedIn = false; // Reset log flag states
    user.resetOtp = undefined; // Drop transactional OTP parameters completely
    await user.save();

    // Flush out database dynamic session states across devices to force global logouts
    await Session.deleteMany({ userId: user._id });

    // Send security notification message update to user's mailbox via Resend
    await sendPasswordChangedEmail(user.email);

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. All active sessions have been invalidated. Please log in.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
