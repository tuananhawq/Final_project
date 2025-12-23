import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
  description: {
    type: String,
    default: "Simple Recipes That Make You Feel Good",
  },
  supportPhone: {
    type: String,
    default: "036.333.5981",
  },
  officeLocation: {
    type: String,
    default: "REVLIVE",
  },
  socialLinks: {
    facebook: {
      type: String,
      default: "https://facebook.com",
    },
    twitter: {
      type: String,
      default: "https://twitter.com",
    },
    instagram: {
      type: String,
      default: "https://instagram.com",
    },
  },
  footerLinks: [{
    label: String,
    url: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.model("Footer", footerSchema);

