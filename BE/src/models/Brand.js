// BE/src/models/Brand.js
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    // unique: true,
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
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  industry: {
    type: String,
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

// ←←←← SỬA DÒNG NÀY: "Job" → "Brand"
const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

export default Brand;