import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rank: {
    type: String,
    required: true,
    enum: ["TOP 1", "TOP 2", "TOP 3"],
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    enum: ["large", "small"],
    default: "small",
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

export default mongoose.model("Agency", agencySchema);

