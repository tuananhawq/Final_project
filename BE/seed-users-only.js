import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

// Fix cho ESM + Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load file .env
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Connect DB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp_db";

// Vietnamese names for realistic data
const firstNames = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng",
  "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Đào", "Lương", "Tạ"
];

const lastNames = [
  "Văn Minh", "Thị Lan", "Văn Hùng", "Thị Mai", "Văn Đức", "Thị Hoa", "Văn Nam", "Thị Linh",
  "Văn Tuấn", "Thị Nga", "Văn Khoa", "Thị Thu", "Văn Long", "Thị Hương", "Văn Phong",
  "Thị Trang", "Văn Quang", "Thị Nhung", "Văn Tài", "Thị Yến", "Văn Bình", "Thị Thảo",
  "Văn Cường", "Thị Loan", "Văn Dũng", "Thị Oanh", "Văn Hiếu", "Thị Vân", "Văn Thành",
  "Thị Xuân", "Văn Hải", "Thị Diệu", "Văn Sơn", "Thị Phương", "Văn Toàn", "Thị Kim",
  "Văn Đạt", "Thị Hạnh", "Văn Kiên", "Thị Thúy", "Văn Lâm", "Thị Hồng", "Văn Tùng",
  "Thị Bích", "Văn Hoàng", "Thị Liên", "Văn Thắng", "Thị Dung", "Văn Trung", "Thị Mỹ"
];

const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

function generateRandomEmail(index) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  // Create unique email with timestamp and index to avoid duplicates
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  const emailName = `${firstName.toLowerCase().replace(/\s+/g, '')}${lastName.toLowerCase().replace(/\s+/g, '')}${index}${randomNum}`;
  
  return `${emailName}@${domain}`;
}

function generateRandomUsername(index) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const timestamp = Date.now().toString().slice(-4);
  
  return `${firstName.toLowerCase().replace(/\s+/g, '')}${lastName.toLowerCase().replace(/\s+/g, '')}${index}${timestamp}`;
}

async function seedUsers() {
  try {
    console.log("🔌 Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    // Check current user count
    const currentUserCount = await User.countDocuments();
    console.log(`📊 Hiện tại có ${currentUserCount} users trong database`);

    // Hash password for all new users
    console.log("🔐 Đang hash password...");
    const userPassword = await bcrypt.hash("A123123123", 10);

    const usersToCreate = [];
    
    console.log("👥 Đang tạo 100 users mới...");
    
    for (let i = 1; i <= 100; i++) {
      const email = generateRandomEmail(i);
      const username = generateRandomUsername(i);
      
      const user = {
        email: email,
        username: username,
        passwordHash: userPassword,
        provider: "local",
        roles: ["user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        bio: `User ${i} - Thành viên RevLive`,
        avatar: "",
        blogWarningCount: 0,
        isLocked: false,
        lockedReason: ""
      };
      
      usersToCreate.push(user);
      
      if (i % 10 === 0) {
        console.log(`✅ Đã chuẩn bị ${i}/100 users`);
      }
    }

    // Insert users in batches to avoid memory issues
    console.log("💾 Đang lưu users vào database...");
    const batchSize = 20;
    let createdCount = 0;
    
    for (let i = 0; i < usersToCreate.length; i += batchSize) {
      const batch = usersToCreate.slice(i, i + batchSize);
      
      try {
        const insertedUsers = await User.insertMany(batch, { ordered: false });
        createdCount += insertedUsers.length;
        console.log(`✅ Đã tạo ${createdCount}/100 users`);
      } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate key errors
          console.log(`⚠️  Một số users bị trùng lặp trong batch ${Math.floor(i/batchSize) + 1}, tiếp tục...`);
          // Count successful inserts from the error details
          if (error.insertedDocs) {
            createdCount += error.insertedDocs.length;
          }
        } else {
          throw error;
        }
      }
    }

    // Final count check
    const finalUserCount = await User.countDocuments();
    console.log(`📊 Tổng số users sau khi seed: ${finalUserCount}`);
    console.log(`✅ Đã thêm ${finalUserCount - currentUserCount} users mới`);

    console.log("🎉 Seed users hoàn thành!");
    
  } catch (error) {
    console.error("❌ Lỗi khi tạo users:", error);
  } finally {
    console.log("🔌 Đang đóng kết nối MongoDB...");
    await mongoose.connection.close();
    console.log("✅ Đã đóng kết nối MongoDB");
    process.exit(0);
  }
}

// Run the seed function
seedUsers();