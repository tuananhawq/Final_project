import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

export const register = async ({ username, email, password }) => {
  if (!email || !password) {
    throw new Error("MISSING_FIELDS");
  }

  const existing = await User.findOne({ email, isDeleted: false });
  if (existing) throw new Error("EMAIL_ALREADY_EXISTS");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,        // ✅ LƯU USERNAME
    email,
    passwordHash,
    roles: ["user"]
  });

  return {
    id: user._id,
    email: user.email
  };
};



export const login = async ({ email, password }) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) throw new Error('sai email hoặc mật khẩu');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('sai email hoặc mật khẩu');

  const token = jwt.sign(
    {
      userId: user._id,
      roles: user.roles
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      roles: user.roles
    }
  };
};
