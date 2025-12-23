import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

// 👉 fix cho ESM + Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 LOAD ĐÚNG FILE .env (ở thư mục BE)
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Connect DB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp_db";

async function seed() {
  try {
    console.log("Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    // Hash passwords
    console.log("Đang hash passwords...");
    const staffPassword = await bcrypt.hash("Staff123!", 10);
    const userPassword = await bcrypt.hash("A123123123", 10);

    // Xóa users cũ nếu đã tồn tại (optional - để tránh duplicate)
    console.log("Đang kiểm tra users cũ...");
    await User.deleteMany({
      email: { $in: ["staff@gmail.com", "minhanh27082004@gmail.com"] }
    });
    console.log("✅ Đã xóa users cũ (nếu có)");

    // Insert vào DB
    console.log("Đang insert users...");
    const users = await User.insertMany([
      {
        email: "staff@gmail.com",
        username: "staff",
        passwordHash: staffPassword,
        provider: "local",
        roles: ["staff"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
      },
      {
        email: "minhanh27082004@gmail.com",
        username: "minhanh27082004",
        passwordHash: userPassword,
        provider: "local",
        roles: ["user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
      },
    ]);

    console.log("✅ Seed thành công!");
    console.log(`Đã tạo ${users.length} users:`);
    users.forEach((user) => {
      console.log(`  - ${user.email} (${user.roles.join(", ")})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
}

seed();

