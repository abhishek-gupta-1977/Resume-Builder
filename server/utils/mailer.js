import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_EMAIL = "onboarding@resend.dev"; 

export const sendVerificationEmail = async (email, name, verificationUrl) => {
  await resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: "Verify your Account - AI Resume Builder",
    html: `<p>Hi ${name},</p><p>Please click the link below to verify your email address:</p><a href="${verificationUrl}">Verify Account</a>`,
  });
};

export const sendOtpEmail = async (email, otpCode) => {
  await resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: "Your Password Reset OTP Code",
    html: `<p>Your 6-digit OTP code is: <strong>${otpCode}</strong>. It is valid for 10 mis.</p>`,
  });
};

export const sendPasswordChangedEmail = async (email) => {
  await resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: "Security Alert: Password Changed Successfully",
    html: `<p>This is a confirmation that the password for your AI Resume Builder account has been updated. If you did not make this change, please contact security immediately.</p>`,
  });
};
