// BE/src/models/Brand.js
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // 1 user chỉ có 1 profile brand
  },
  companyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String, // URL ảnh logo
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  industry: {
    type: String, // ngành nghề: Beauty, Food, Tech...
    default: "",
  },
  followers: {
    type: String,
    default: "0",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);