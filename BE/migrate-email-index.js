import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Fix cho ESM + Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load file .env
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Connect DB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp_db";

async function migrateEmailIndex() {
  try {
    console.log("🔌 Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    console.log("📋 Kiểm tra indexes hiện tại...");
    const indexes = await collection.indexes();
    console.log("Indexes hiện tại:", indexes.map(idx => ({ name: idx.name, key: idx.key })));

    // Drop old unique index on email if it exists
    try {
      console.log("🗑️  Đang xóa unique index cũ trên email...");
      await collection.dropIndex({ email: 1 });
      console.log("✅ Đã xóa unique index cũ");
    } catch (error) {
      if (error.code === 27) {
        console.log("ℹ️  Unique index cũ không tồn tại, bỏ qua...");
      } else {
        console.log("⚠️  Lỗi khi xóa index cũ:", error.message);
      }
    }

    // Create new compound unique index
    console.log("🔧 Đang tạo compound unique index mới...");
    await collection.createIndex(
      { email: 1, isDeleted: 1 }, 
      { 
        unique: true,
        partialFilterExpression: { isDeleted: false },
        name: "email_isDeleted_unique"
      }
    );
    console.log("✅ Đã tạo compound unique index mới");

    // Verify new indexes
    console.log("🔍 Kiểm tra indexes sau khi migration...");
    const newIndexes = await collection.indexes();
    console.log("Indexes mới:", newIndexes.map(idx => ({ name: idx.name, key: idx.key, partialFilterExpression: idx.partialFilterExpression })));

    console.log("🎉 Migration hoàn thành!");
    console.log("📝 Giờ bạn có thể đăng ký lại bằng email đã bị xóa!");

  } catch (error) {
    console.error("❌ Lỗi khi migration:", error);
  } finally {
    console.log("🔌 Đang đóng kết nối MongoDB...");
    await mongoose.connection.close();
    console.log("✅ Đã đóng kết nối MongoDB");
    process.exit(0);
  }
}

// Run the migration
migrateEmailIndex();