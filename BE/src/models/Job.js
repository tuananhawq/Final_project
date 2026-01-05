// BE/src/models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Tuyển Creator/Content Partner"
  },
  description: {
    type: String,
    required: true,
  },
  // ←←←← THÊM CÁC FIELD MỚI
  requirements: {
    type: [String], // mảng string cho Yêu cầu ứng viên
    default: []
  },
  benefits: {
    type: [String], // mảng string cho Quyền lợi
    default: []
  },
  location: {
    type: String,
    default: ""
  },
  salary: {
    type: String,
    default: ""
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

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;