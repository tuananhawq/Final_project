import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleHighlight: {
    type: String,
    default: "Creator & Brand",
  },
  description: {
    type: String,
    required: true,
  },
  ctaText: {
    type: String,
    default: "Khám phá ngay",
  },
  backgroundImage: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Hero", heroSchema);

