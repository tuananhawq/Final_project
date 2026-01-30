import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  username: {
    type: String,
    unique: false,
    sparse: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  // 🔥 THÊM CHO OAUTH
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: ""
  },
  
  bio: {
    type: String,
    default: ""
  },


  roles: {
    type: [String],
    enum: ["guest", "user", "creator", "brand", "staff", "admin"],
    default: ["user"]
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  premiumStatus: {
    type: String,
    enum: ["free", "premium"],
    default: "free"
  },

  memberType: {
    type: String,
    enum: ["free", "creator", "brand"],
    default: "free"
  },

  premiumExpiredAt: {
    type: Date,
    default: null
  },
  // Blog violation tracking
  blogWarningCount: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedReason: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
