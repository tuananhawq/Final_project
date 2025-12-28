// BE/seed-creators.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Creator from "./src/models/Creator.js";
import { connectDB } from "./src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const creatorsData = [
  {
    name: "Võ Hà Linh",
    description: "Chuyên review mỹ phẩm, lifestyle, livestream bán hàng cực đỉnh",
    avatar: "https://i.imgur.com/8mPqR5t.jpeg",
    followers: "2.1M",
    order: 1,
  },
  {
    name: "Khoai Lang Thang",
    description: "Vua livestream bán hàng, food review và travel vlog",
    avatar: "https://i.imgur.com/2kL5jYk.jpeg",
    followers: "3.4M",
    order: 2,
  },
  {
    name: "Tina Thảo Thy",
    description: "Thế hệ Gen Z, fashion, makeup, nội dung trẻ trung năng động",
    avatar: "https://i.imgur.com/6nT3vXp.jpeg",
    followers: "1.8M",
    order: 3,
  },
  {
    name: "Quang Linh Vlogs",
    description: "Vlog từ thiện châu Phi, nội dung ý nghĩa và truyền cảm hứng",
    avatar: "https://i.imgur.com/quanglinhvlogs.jpg", // thay link thật nếu có
    followers: "5.2M",
    order: 4,
  },
  {
    name: "Hậu Hoàng",
    description: "Comedy, reaction, nội dung giải trí viral",
    avatar: "https://i.imgur.com/hauhoang.jpg",
    followers: "4.1M",
    order: 5,
  },
  {
    name: "Changmakeup",
    description: "Makeup artist chuyên nghiệp, tutorial chi tiết",
    avatar: "https://i.imgur.com/changmakeup.jpg",
    followers: "2.8M",
    order: 6,
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Creator.deleteMany({});
    await Creator.insertMany(creatorsData);

    console.log("✅ Đã seed thành công 6 Creator thật!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
    process.exit(1);
  }
};

seed();