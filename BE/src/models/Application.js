import mongoose from "mongoose";

// Collection: applications
// Lưu thông tin Creator ứng tuyển vào JobPost của Brand

const applicationSchema = new mongoose.Schema(
  {
    jobPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cv",
      required: false, // Optional, có thể ứng tuyển mà chưa có CV
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      default: "", // Tin nhắn từ Creator khi ứng tuyển (optional)
    },
    approvalMessage: {
      type: String,
      default: "", // Thông tin liên hệ từ Brand khi phê duyệt
    },
    rejectionReason: {
      type: String,
      default: "", // Lý do từ chối từ Brand
    },
  },
  {
    timestamps: true,
  }
);

// Index để tránh Creator ứng tuyển 2 lần vào cùng 1 JobPost
applicationSchema.index({ jobPost: 1, creator: 1 }, { unique: true });

const Application =
  mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default Application;

