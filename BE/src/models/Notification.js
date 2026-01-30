import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["info", "warning", "error", "success"],
    default: "info",
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  metadata: {
    type: Object, // Can store postId, brandId, etc.
    default: {},
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
