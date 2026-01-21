import mongoose from "mongoose";

const legalConfigSchema = new mongoose.Schema(
  {
    termsContent: {
      type: String,
      default: "",
    },
    privacyContent: {
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

// Ensure there is always exactly one config document
legalConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

export default mongoose.model("LegalConfig", legalConfigSchema);

