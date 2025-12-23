import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    enum: ["left", "center", "right"],
    default: "center",
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

export default mongoose.model("Topic", topicSchema);

