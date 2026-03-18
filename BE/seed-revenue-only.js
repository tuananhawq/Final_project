import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
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

// Revenue generation from March 1 to March 13, 2026
function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePayosToken() {
  // Generate unique token to avoid duplicate key errors
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  return `PAYOS_${timestamp}_${random}`;
}

function generateTransferContent(username, plan) {
  return `REVLIVE ${username} ${plan.toUpperCase()}`;
}

async function seedRevenue() {
  try {
    console.log("🔌 Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    // Get all users (excluding admin and staff)
    const users = await User.find({
      roles: { $nin: ["admin", "staff"] },
      isActive: true,
      isDeleted: false
    });

    console.log(`👥 Tìm thấy ${users.length} users để tạo doanh thu`);

    if (users.length === 0) {
      console.log("❌ Không có users để tạo doanh thu");
      return;
    }

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
      // Random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      // Random plan
      const plans = ["creator", "brand"];
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const planConfig = plansConfig[randomPlan];
      
      // Random date within range
      const transactionDate = generateRandomDate(startDate, endDate);
      
      // Create transaction
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
          premiumExpiredAt: new Date(transactionDate.getTime() + (365 * 24 * 60 * 60 * 1000)) // 1 year from transaction
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
    const batchSize = 10;
    let createdCount = 0;

    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      
      try {
        const insertedTransactions = await Transaction.insertMany(batch, { ordered: false });
        createdCount += insertedTransactions.length;
        console.log(`✅ Đã tạo ${createdCount}/${numberOfTransactions} giao dịch`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Một số giao dịch bị trùng lặp trong batch ${Math.floor(i/batchSize) + 1}, tiếp tục...`);
          if (error.insertedDocs) {
            createdCount += error.insertedDocs.length;
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

    console.log("\n📊 THỐNG KÊ DOANH THU:");
    console.log(`💰 Tổng doanh thu: ${totalRevenue.toLocaleString('vi-VN')} VNĐ`);
    console.log(`👤 Doanh thu Creator: ${creatorRevenue.toLocaleString('vi-VN')} VNĐ`);
    console.log(`🏢 Doanh thu Brand: ${brandRevenue.toLocaleString('vi-VN')} VNĐ`);
    console.log(`📈 Số giao dịch thành công: ${createdCount}`);

    console.log("🎉 Seed doanh thu hoàn thành!");
    
  } catch (error) {
    console.error("❌ Lỗi khi tạo doanh thu:", error);
  } finally {
    console.log("🔌 Đang đóng kết nối MongoDB...");
    await mongoose.connection.close();
    console.log("✅ Đã đóng kết nối MongoDB");
    process.exit(0);
  }
}

// Run the seed function
seedRevenue();