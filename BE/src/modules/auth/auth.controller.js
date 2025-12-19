import * as authService from './auth.service.js';
import User from "../../models/User.js";
import PasswordReset from "../../models/PasswordReset.js";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../../utils/mailer.js";
export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "Email not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await PasswordReset.deleteMany({ email });

  await PasswordReset.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
  });

  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent to email" });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const record = await PasswordReset.findOne({ email, otp });
  if (!record) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ error: "OTP expired" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { email },
    { passwordHash }
  );

  await PasswordReset.deleteMany({ email });

  res.json({ message: "Password reset successfully" });
};
