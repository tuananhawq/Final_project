import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Transaction from "./src/models/Transaction.js";

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

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePayosToken() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  return `PAYOS_${timestamp}_${random}`;
}

function generateTransferContent(username, plan) {
  return `REVLIVE ${username} ${plan.toUpperCase()}`;
}

async function seedUsersAndRevenue() {
  try {
    console.log("🔌 Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    // STEP 1: Seed Users
    console.log("\n=== BƯỚC 1: TẠO USERS ===");
    const currentUserCount = await User.countDocuments();
    console.log(`📊 Hiện tại có ${currentUserCount} users trong database`);

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
      
      if (i % 20 === 0) {
        console.log(`✅ Đã chuẩn bị ${i}/100 users`);
      }
    }

    // Insert users in batches
    console.log("💾 Đang lưu users vào database...");
    const batchSize = 20;
    let createdUserCount = 0;
    
    for (let i = 0; i < usersToCreate.length; i += batchSize) {
      const batch = usersToCreate.slice(i, i + batchSize);
      
      try {
        const insertedUsers = await User.insertMany(batch, { ordered: false });
        createdUserCount += insertedUsers.length;
        console.log(`✅ Đã tạo ${createdUserCount}/100 users`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Một số users bị trùng lặp trong batch ${Math.floor(i/batchSize) + 1}, tiếp tục...`);
          if (error.insertedDocs) {
            createdUserCount += error.insertedDocs.length;
          }
        } else {
          throw error;
        }
      }
    }

    const finalUserCount = await User.countDocuments();
    console.log(`📊 Tổng số users sau khi seed: ${finalUserCount}`);
    console.log(`✅ Đã thêm ${finalUserCount - currentUserCount} users mới`);

    // STEP 2: Seed Revenue
    console.log("\n=== BƯỚC 2: TẠO DOANH THU ===");
    
    // Get all users (excluding admin and staff)
    const users = await User.find({
      roles: { $nin: ["admin", "staff"] },
      isActive: true,
      isDeleted: false
    });

    console.log(`👥 Tìm thấy ${users.length} users để tạo doanh thu`);

    // Date range: March 1 to March 13, 2026
    const startDate = new Date(2026, 2, 1); // March 1, 2026
    const endDate = new Date(2026, 2, 13, 23, 59, 59); // March 13, 2026

    console.log(`📅 Tạo doanh thu từ ${startDate.toLocaleDateString('vi-VN')} đến ${endDate.toLocaleDateString('vi-VN')}`);

    const transactions = [];
    const plansConfig = {
      creator: { amount: 99000, originalAmount: 149000 },
      brand: { amount: 199000, originalAmount: 299000 }
    };

    // Generate 50-100 transactions randomly distributed across the date range
    const numberOfTransactions = Math.floor(Math.random() * 51) + 50; // 50-100 transactions
    console.log(`💰 Sẽ tạo ${numberOfTransactions} giao dịch`);

    for (let i = 0; i < numberOfTransactions; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const plans = ["creator", "brand"];
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const planConfig = plansConfig[randomPlan];
      const transactionDate = generateRandomDate(startDate, endDate);
      
      const transaction = {
        user: randomUser._id,
        plan: randomPlan,
        amount: planConfig.amount,
        originalAmount: planConfig.originalAmount,
        transferContent: generateTransferContent(randomUser.username || randomUser.email.split('@')[0], randomPlan),
        status: "completed",
        qrCodeUrl: "",
        approvedBy: null,
        approvedAt: transactionDate,
        cancelledAt: null,
        cancelledReason: "",
        payosToken: generatePayosToken(),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null
        },
        afterUpgrade: {
          memberType: randomPlan,
          premiumExpiredAt: new Date(transactionDate.getTime() + (365 * 24 * 60 * 60 * 1000))
        },
        createdAt: transactionDate,
        updatedAt: transactionDate
      };

      transactions.push(transaction);

      if ((i + 1) % 10 === 0) {
        console.log(`✅ Đã chuẩn bị ${i + 1}/${numberOfTransactions} giao dịch`);
      }
    }

    // Insert transactions in batches
    console.log("💾 Đang lưu giao dịch vào database...");
    let createdTransactionCount = 0;

    for (let i = 0; i < transactions.length; i += 10) {
      const batch = transactions.slice(i, i + 10);
      
      try {
        const insertedTransactions = await Transaction.insertMany(batch, { ordered: false });
        createdTransactionCount += insertedTransactions.length;
        console.log(`✅ Đã tạo ${createdTransactionCount}/${numberOfTransactions} giao dịch`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Một số giao dịch bị trùng lặp trong batch ${Math.floor(i/10) + 1}, tiếp tục...`);
          if (error.insertedDocs) {
            createdTransactionCount += error.insertedDocs.length;
          }
        } else {
          throw error;
        }
      }
    }

    // Calculate total revenue
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const creatorRevenue = transactions.filter(t => t.plan === "creator").reduce((sum, t) => sum + t.amount, 0);
    const brandRevenue = transactions.filter(t => t.plan === "brand").reduce((sum, t) => sum + t.amount, 0);

    console.log("\n📊 THỐNG KÊ TỔNG KẾT:");
    console.log(`👥 Tổng số users: ${finalUserCount}`);
    console.log(`💰 Tổng doanh thu: ${totalRevenue.toLocaleString('vi-VN')} VNĐ`);
    console.log(`👤 Doanh thu Creator: ${creatorRevenue.toLocaleString('vi-VN')} VNĐ`);
    console.log(`🏢 Doanh thu Brand: ${brandRevenue.toLocaleString('vi-VN')} VNĐ`);
    console.log(`📈 Số giao dịch thành công: ${createdTransactionCount}`);

    console.log("🎉 Seed hoàn thành!");
    
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
  } finally {
    console.log("🔌 Đang đóng kết nối MongoDB...");
    await mongoose.connection.close();
    console.log("✅ Đã đóng kết nối MongoDB");
    process.exit(0);
  }
}

// Run the seed function
seedUsersAndRevenue();