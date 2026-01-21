import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["creator", "brand"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    originalAmount: {
      type: Number,
      required: true, // Giá gốc trước khi giảm giá
    },
    transferContent: {
      type: String,
      required: true, // Nội dung chuyển khoản: REVLIVE [Username] [Gói dịch vụ]
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    qrCodeUrl: {
      type: String,
      default: "", // URL QR code từ Cloudinary hoặc upload
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
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancelledReason: {
      type: String,
      default: "",
    },
    // Token từ PayOS để verify thanh toán
    payosToken: {
      type: String,
      default: null,
      sparse: true, // Cho phép null và unique chỉ khi có giá trị
      unique: true, // Đảm bảo token unique khi có giá trị
    },
    // Lưu thông tin trước và sau khi nâng cấp để đối soát
    beforeUpgrade: {
      memberType: {
        type: String,
        enum: ["free", "creator", "brand"],
        default: "free",
      },
      premiumExpiredAt: {
        type: Date,
        default: null,
      },
    },
    afterUpgrade: {
      memberType: {
        type: String,
        enum: ["free", "creator", "brand"],
        default: null,
      },
      premiumExpiredAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema);
