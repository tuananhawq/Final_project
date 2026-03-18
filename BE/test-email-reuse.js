import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";

// Fix cho ESM + Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load file .env
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Connect DB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp_db";

async function testEmailReuse() {
  try {
    console.log("🔌 Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    const testEmail = "test-reuse@example.com";
    const passwordHash = await bcrypt.hash("TestPassword123!", 10);

    console.log(`\n🧪 Test email reuse với: ${testEmail}`);

    // Step 1: Create a test user
    console.log("1️⃣ Tạo user test...");
    try {
      const user1 = await User.create({
        email: testEmail,
        username: "testuser1",
        passwordHash,
        roles: ["user"],
        provider: "local",
        isVerified: true,
        isActive: true,
        isDeleted: false
      });
      console.log(`✅ Đã tạo user: ${user1.email} (ID: ${user1._id})`);
    } catch (error) {
      if (error.code === 11000) {
        console.log("ℹ️  User với email này đã tồn tại, tiếp tục test...");
      } else {
        throw error;
      }
    }

    // Step 2: Soft delete the user
    console.log("2️⃣ Soft delete user...");
    const userToDelete = await User.findOne({ email: testEmail, isDeleted: false });
    if (userToDelete) {
      userToDelete.isDeleted = true;
      userToDelete.deletedAt = new Date();
      await userToDelete.save();
      console.log(`✅ Đã soft delete user: ${userToDelete.email}`);
    } else {
      console.log("⚠️  Không tìm thấy user để delete");
    }

    // Step 3: Try to create a new user with the same email
    console.log("3️⃣ Thử tạo user mới với cùng email...");
    try {
      const user2 = await User.create({
        email: testEmail,
        username: "testuser2",
        passwordHash,
        roles: ["user"],
        provider: "local",
        isVerified: true,
        isActive: true,
        isDeleted: false
      });
      console.log(`✅ THÀNH CÔNG! Đã tạo user mới: ${user2.email} (ID: ${user2._id})`);
      console.log("🎉 Email reuse hoạt động chính xác!");
    } catch (error) {
      console.error("❌ THẤT BẠI! Không thể tạo user mới với email đã xóa:");
      console.error(error.message);
    }

    // Step 4: Verify database state
    console.log("4️⃣ Kiểm tra trạng thái database...");
    const allUsersWithEmail = await User.find({ email: testEmail });
    console.log(`📊 Tổng số users với email ${testEmail}: ${allUsersWithEmail.length}`);
    
    allUsersWithEmail.forEach((user, index) => {
      console.log(`   User ${index + 1}: ID=${user._id}, isDeleted=${user.isDeleted}, username=${user.username}`);
    });

    // Cleanup: Remove test users
    console.log("5️⃣ Dọn dẹp test data...");
    const deleteResult = await User.deleteMany({ email: testEmail });
    console.log(`✅ Đã xóa ${deleteResult.deletedCount} test users`);

  } catch (error) {
    console.error("❌ Lỗi khi test:", error);
  } finally {
    console.log("🔌 Đang đóng kết nối MongoDB...");
    await mongoose.connection.close();
    console.log("✅ Đã đóng kết nối MongoDB");
    process.exit(0);
  }
}

// Run the test
testEmailReuse();