import mongoose from "mongoose";

// Collection: cvs
// CV của Creator dùng cho tính năng "CV đề xuất"

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // optional: liên kết với profile Creator nếu có
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: false,
    },

    fullName: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    mainSkills: {
      type: [String],
      default: [],
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    experienceDetail: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    // 🔥 Thêm field cho upload ảnh CV
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

const Cv = mongoose.models.Cv || mongoose.model("Cv", cvSchema);

export default Cv;


