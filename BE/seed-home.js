import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Hero from "./src/models/Hero.js";
import Agency from "./src/models/Agency.js";
import Creator from "./src/models/Creator.js";
import Topic from "./src/models/Topic.js";
import Testimonial from "./src/models/Testimonial.js";
import Footer from "./src/models/Footer.js";
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

async function seedHome() {
  try {
    console.log("Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    // Clear existing data
    console.log("Đang xóa dữ liệu cũ...");
    await Hero.deleteMany({});
    await Agency.deleteMany({});
    await Creator.deleteMany({});
    await User.deleteMany({});
    await Topic.deleteMany({});
    await Testimonial.deleteMany({});
    await Footer.deleteMany({});

    // Seed Hero
    console.log("Đang seed Hero...");
    await Hero.create({
      title: "Nền tảng kết nối",
      titleHighlight: "Creator & Brand",
      description: "REVLIVE - Nơi các Agency, Brand và Creator gặp gỡ, hợp tác và phát triển cùng nhau",
      ctaText: "Khám phá ngay",
      backgroundImage: "/src/assets/anhbia3x12136-jp-2200w.png",
      isActive: true,
      order: 0,
    });

    // Seed Agencies
    console.log("Đang seed Agencies...");
    await Agency.insertMany([
      {
        name: "CREATIVE AGENCY",
        rank: "TOP 1",
        image: "/src/assets/anhbia3x12136-jp-2200w.png",
        size: "large",
        isActive: true,
        order: 0,
      },
      {
        name: "DIGITAL BRAND",
        rank: "TOP 2",
        image: "/src/assets/anhbia3x12136-jp-2200w.png",
        size: "small",
        isActive: true,
        order: 1,
      },
      {
        name: "MARKETING PRO",
        rank: "TOP 3",
        image: "/src/assets/anhbia3x12136-jp-2200w.png",
        size: "small",
        isActive: true,
        order: 2,
      },
    ]);

    // Seed Creators
    console.log("Đang seed Creators...");
    
    // Tạo Users trước
    const creatorUsers = await User.insertMany([
      {
        email: "creator1@revlive.com",
        username: "nguyen_van_a",
        passwordHash: "hashedpassword123",
        provider: "local",
        avatar: "/src/assets/logo-revlive.png",
        bio: "Content Creator"
      },
      {
        email: "creator2@revlive.com",
        username: "tran_thi_b",
        passwordHash: "hashedpassword123",
        provider: "local",
        avatar: "/src/assets/logo-revlive.png",
        bio: "Livestream Host"
      },
      {
        email: "creator3@revlive.com",
        username: "le_van_c",
        passwordHash: "hashedpassword123",
        provider: "local",
        avatar: "/src/assets/logo-revlive.png",
        bio: "Gaming Streamer"
      },
      {
        email: "creator4@revlive.com",
        username: "pham_thi_d",
        passwordHash: "hashedpassword123",
        provider: "local",
        avatar: "/src/assets/logo-revlive.png",
        bio: "Beauty Influencer"
      },
      {
        email: "creator5@revlive.com",
        username: "hoang_van_e",
        passwordHash: "hashedpassword123",
        provider: "local",
        avatar: "/src/assets/logo-revlive.png",
        bio: "Tech Reviewer"
      },
      {
        email: "creator6@revlive.com",
        username: "do_thi_f",
        passwordHash: "hashedpassword123",
        provider: "local",
        avatar: "/src/assets/logo-revlive.png",
        bio: "Fashion Creator"
      }
    ]);

    // Tạo Creators liên kết với Users
    await Creator.insertMany([
      {
        user: creatorUsers[0]._id,
        description: "Content Creator",
        avatar: "/src/assets/logo-revlive.png",
        followers: "1.2M",
        isActive: true,
        order: 0,
      },
      {
        user: creatorUsers[1]._id,
        description: "Livestream Host",
        avatar: "/src/assets/logo-revlive.png",
        followers: "850K",
        isActive: true,
        order: 1,
      },
      {
        user: creatorUsers[2]._id,
        description: "Gaming Streamer",
        avatar: "/src/assets/logo-revlive.png",
        followers: "2.1M",
        isActive: true,
        order: 2,
      },
      {
        user: creatorUsers[3]._id,
        description: "Beauty Influencer",
        avatar: "/src/assets/logo-revlive.png",
        followers: "930K",
        isActive: true,
        order: 3,
      },
      {
        user: creatorUsers[4]._id,
        description: "Tech Reviewer",
        avatar: "/src/assets/logo-revlive.png",
        followers: "670K",
        isActive: true,
        order: 4,
      },
      {
        user: creatorUsers[5]._id,
        description: "Fashion Creator",
        avatar: "/src/assets/logo-revlive.png",
        followers: "1.5M",
        isActive: true,
        order: 5,
      },
    ]);

    // Seed Topics
    console.log("Đang seed Topics...");
    await Topic.insertMany([
      {
        title: "Gaming",
        image: "/src/assets/anhbia3x12136-jp-2200w.png",
        position: "left",
        isActive: true,
        order: 0,
      },
      {
        title: "Beauty & Fashion",
        image: "/src/assets/anhbia3x12136-jp-2200w.png",
        position: "center",
        isActive: true,
        order: 1,
      },
      {
        title: "Technology",
        image: "/src/assets/anhbia3x12136-jp-2200w.png",
        position: "right",
        isActive: true,
        order: 2,
      },
    ]);

    // Seed Testimonials
    console.log("Đang seed Testimonials...");
    await Testimonial.insertMany([
      {
        name: "Nguyễn Minh Tuấn",
        role: "CEO - TechStart",
        content: "REVLIVE đã giúp chúng tôi kết nối với những creator tài năng nhất. Nền tảng rất dễ sử dụng và hiệu quả!",
        avatar: "/src/assets/logo-revlive.png",
        isActive: true,
        order: 0,
      },
      {
        name: "Lê Thu Hà",
        role: "Content Creator",
        content: "Tôi đã tìm được nhiều brand uy tín để hợp tác thông qua REVLIVE. Đây là nền tảng tuyệt vời cho các creator!",
        avatar: "/src/assets/logo-revlive.png",
        isActive: true,
        order: 1,
      },
      {
        name: "Trần Đức Anh",
        role: "Marketing Manager - Fashion Brand",
        content: "Chất lượng creator trên REVLIVE rất cao. Chúng tôi đã có nhiều chiến dịch thành công nhờ nền tảng này.",
        avatar: "/src/assets/logo-revlive.png",
        isActive: true,
        order: 2,
      },
    ]);

    // Seed Footer
    console.log("Đang seed Footer...");
    await Footer.create({
      description: "Simple Recipes That Make You Feel Good",
      supportPhone: "036.333.5981",
      officeLocation: "REVLIVE",
      socialLinks: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
      },
      footerLinks: [
        { label: "Giới thiệu", url: "/about" },
        { label: "Tuyển dụng", url: "/careers" },
        { label: "Gửi khiếu nại", url: "/complaints" },
      ],
    });

    console.log("✅ Seed Home thành công!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
}

seedHome();

