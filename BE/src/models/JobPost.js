import mongoose from "mongoose";

// Collection: job_posts
// Lưu tất cả tin tuyển dụng do Brand tạo, dùng cho:
// - News Feed (/api/job-posts - public)
// - Tin tuyển dụng của tôi (Brand CRUD dưới /api/brand/job-post)

const jobPostSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    // Lưu thêm brandName để hiển thị nhanh, nhưng vẫn populate được từ Brand
    brandName: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      required: true,
    },

    workTime: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    budget: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
      required: true,
    },

    benefits: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt dùng cho sort Bảng tin
  }
);

const JobPost =
  mongoose.models.JobPost || mongoose.model("JobPost", jobPostSchema);

export default JobPost;


