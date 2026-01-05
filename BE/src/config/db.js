// BE/src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env từ thư mục BE (lên 1 cấp từ /src/config)
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

console.log("MONGODB_URI:", process.env.MONGO_URI); // debug

if (!process.env.MONGO_URI) {
  throw new Error("Thiếu MONGO_URI trong .env");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected thành công!");
  } catch (err) {
    console.error("Lỗi kết nối DB:", err.message);
    process.exit(1);
  }
};