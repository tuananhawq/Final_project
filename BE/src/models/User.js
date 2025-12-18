import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  username: {
    type: String,
    unique: true,
    sparse: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  provider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },

  roles: {
    type: [String],
    default: ['user']
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
    enum: ['free', 'premium'],
    default: 'free'
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
