// BE/seed-banners.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Banner from "./src/models/Banner.js";
import { connectDB } from "./src/config/db.js";// giả sử bạn có file db.js để connect

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Danh sách banner mẫu (6 cái - giống hình bạn gửi)
const bannerData = [
  {
    title: "CÁC AGENCY/BRAND NỔI BẬT TRONG TUẦN",
    slug: "agency-noi-bat-tuan-nay",
    image: "https://picsum.photos/500/300",
    description: "Top Agency/Brand khuấy đảo Revlive tuần này!",
    order: 1,
  },
  {
    title: "CÁC HOST/CREATOR NỔI BẬT TRONG TUẦN",
    slug: "creator-noi-bat-tuan-nay",
    image: "https://i.imgur.com/your-creator-image-link.jpg",
    description: "Những gương mặt nổi bật nhất tuần qua",
    order: 2,
  },
  {
    title: "CHỦ ĐỀ YÊU THÍCH TRONG TUẦN",
    slug: "chu-de-yeu-thich-tuan-nay",
    image: "https://i.imgur.com/your-topic-image-link.jpg",
    description: "Các chủ đề đang hot nhất trên Revlive",
    order: 3,
  },
];

const seedBanners = async () => {
  try {
    await connectDB(); // kết nối DB

    // Xóa dữ liệu cũ
    await Banner.deleteMany({});
    console.log("Đã xóa banner cũ");

    // Thêm dữ liệu mới
    await Banner.insertMany(bannerData);
    console.log("Đã thêm 6 banner mẫu thành công!");

    console.log("Seed hoàn tất! Bạn có thể chạy FE để xem ngay.");
    process.exit(0);
  } catch (err) {
    console.error("Lỗi seed banner:", err);
    process.exit(1);
  }
};

seedBanners();