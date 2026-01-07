import mongoose from "mongoose";

// Collection: brand_cvs
// CV thuộc về Brand (user role = brand), phục vụ tính năng "Quản lý CV"

const brandCvSchema = new mongoose.Schema(
  {
    owner: {
      // userId từ token - MỖI BRAND CHỈ CÓ 1 CV
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🔥 Đảm bảo mỗi Brand chỉ có 1 CV
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // File CV: ảnh hoặc PDF
    cvFileUrl: {
      type: String,
      default: "",
    },
    cvFileType: {
      type: String,
      enum: ["image", "pdf", "other", ""],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const BrandCv =
  mongoose.models.BrandCv || mongoose.model("BrandCv", brandCvSchema);

export default BrandCv;


