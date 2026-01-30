import mongoose from "mongoose";

// Collection: projects
// Lưu các dự án do Brand đăng, cần staff duyệt
// Chỉ brand đã đăng ký gói 499k mới được đăng

const projectSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "",
    },
    budget: {
      type: String,
      default: "",
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedReason: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
