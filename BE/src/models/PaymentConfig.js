import mongoose from "mongoose";

const paymentConfigSchema = new mongoose.Schema(
  {
    qrCodeUrl: {
      type: String,
      default: "",
    },
    bankName: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    accountHolder: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Chỉ có 1 document duy nhất
paymentConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

export default mongoose.model("PaymentConfig", paymentConfigSchema);
