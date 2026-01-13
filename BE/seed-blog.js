import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Blog from "./src/models/Blog.js";
import User from "./src/models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp_db";

// Chỉ giữ lại 10 bài viết (các bài đầu tiên trong danh sách gốc)
const rawBlogs = [
  {
    title: "10 Xu Hướng Lập Trình Web Cần Chú Ý Trong Năm 2026",
    content: "<h2>Kỷ nguyên của AI-Driven Development</h2><p>Việc tích hợp AI vào quy trình code không còn là lựa chọn mà là bắt buộc...</p>",
    excerpt: "Điểm qua những công nghệ web đột phá như WebAssembly, AI coding assistants và kiến trúc serverless.",
    category: "Technology",
    tags: ["Programming", "Web", "2026", "AI"],
    views: 1200,
    featured: true, // nổi bật
  },
  {
    title: "Bí Quyết Quản Lý Tài Chính Cá Nhân Cho Gen Z",
    content: "<h2>Quy tắc 50/30/20 cải tiến</h2><p>Làm thế nào để đầu tư chứng khoán và crypto một cách thông minh từ số vốn nhỏ...</p>",
    excerpt: "Hướng dẫn chi tiết cách quản lý chi tiêu và đầu tư hiệu quả cho người trẻ khởi nghiệp.",
    category: "Finance",
    tags: ["Money", "GenZ", "Investment"],
    views: 850,
    featured: false,
  },
  {
    title: "Cách Xây Dựng Thương Hiệu Cá Nhân Trên LinkedIn",
    content: "<h2>Tại sao LinkedIn quan trọng?</h2><p>Profile của bạn chính là bộ mặt thương hiệu chuyên nghiệp...</p>",
    excerpt: "Tối ưu hóa hồ sơ LinkedIn để thu hút nhà tuyển dụng và đối tác kinh doanh.",
    category: "Business",
    tags: ["LinkedIn", "Career", "Branding"],
    views: 2100,
    featured: true, // nổi bật
  },
  {
    title: "Tương Lai Của Năng Lượng Tái Tạo",
    content: "<h2>Pin mặt trời thế hệ mới</h2><p>Công nghệ lưu trữ năng lượng đang thay đổi bộ mặt ngành điện lực...</p>",
    excerpt: "Khám phá các giải pháp năng lượng xanh giúp bảo vệ môi trường bền vững.",
    category: "Environment",
    tags: ["Green Energy", "Future", "Solar"],
    views: 560,
    featured: false,
  },
  {
    title: "5 Công Thức Nấu Ăn Eat Clean Cho Người Bận Rộn",
    content: "<h2>Bữa sáng đủ chất trong 5 phút</h2><p>Sử dụng yến mạch và hạt chia để có năng lượng cả ngày...</p>",
    excerpt: "Tổng hợp các món ăn nhanh, gọn, lẹ nhưng vẫn đảm bảo sức khỏe và vóc dáng.",
    category: "Lifestyle",
    tags: ["Health", "Food", "EatClean"],
    views: 3200,
    featured: true, // nổi bật
  },
  {
    title: "Sự Trỗi Dậy Của Thương Mại Điện Tử Xuyên Biên Giới",
    content: "<h2>Bán hàng ra thế giới qua Amazon và Etsy</h2><p>Cơ hội cho các sản phẩm thủ công mỹ nghệ Việt Nam...</p>",
    excerpt: "Phân tích tiềm năng và thách thức khi đưa sản phẩm nội địa ra thị trường quốc tế.",
    category: "Business",
    tags: ["E-commerce", "Global", "Sales"],
    views: 1450,
    featured: false,
  },
  {
    title: "Hiểu Về Tâm Lý Học Người Tiêu Dùng Năm 2026",
    content: "<h2>Hành vi mua sắm thay đổi như thế nào?</h2><p>Người dùng ưu tiên các giá trị đạo đức và sự minh bạch của nhãn hàng...</p>",
    excerpt: "Nắm bắt tâm lý khách hàng để tối ưu hóa tỷ lệ chuyển đổi trong marketing.",
    category: "Marketing",
    tags: ["Psychology", "Consumer", "Insight"],
    views: 980,
    featured: false,
  },
  {
    title: "Top 5 Thành Phố Đáng Ghé Thăm Tại Đông Nam Á",
    content: "<h2>Hành trình khám phá Bangkok và Hội An</h2><p>Những trải nghiệm văn hóa không thể bỏ qua...</p>",
    excerpt: "Gợi ý lịch trình du lịch giá rẻ nhưng cực chất cho mùa hè này.",
    category: "Travel",
    tags: ["Travel", "Asia", "Summer"],
    views: 4100,
    featured: false,
  },
  {
    title: "Ứng Dụng Blockchain Ngoài Tiền Điện Tử",
    content: "<h2>Blockchain trong quản lý chuỗi cung ứng</h2><p>Minh bạch hóa nguồn gốc thực phẩm bằng công nghệ sổ cái...</p>",
    excerpt: "Blockchain không chỉ có Bitcoin, hãy xem nó đang thay đổi các ngành công nghiệp khác ra sao.",
    category: "Technology",
    tags: ["Blockchain", "Tech", "SupplyChain"],
    views: 720,
    featured: false,
  },
  {
    title: "Nghệ Thuật Quản Lý Thời Gian Với Phương Pháp Deep Work",
    content: "<h2>Làm việc sâu để đạt hiệu suất tối đa</h2><p>Loại bỏ các thông báo mạng xã hội và tập trung tuyệt đối...</p>",
    excerpt: "Cách rèn luyện khả năng tập trung cao độ trong một thế giới đầy xao nhãng.",
    category: "Productivity",
    tags: ["Work", "Focus", "Success"],
    views: 2800,
    featured: false,
  },
];

async function seedBlog() {
  try {
    console.log("Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    const staffUser = await User.findOne({ email: "staff@gmail.com" });
    if (!staffUser) {
      console.log("❌ Không tìm thấy staff user. Vui lòng chạy lệnh tạo user trước!");
      process.exit(1);
    }

    console.log("Đang làm sạch dữ liệu cũ...");
    await Blog.deleteMany({});

    // Cố định thời gian bắt đầu
    const BASE_DATE = new Date("2024-01-01T08:00:00Z");
    console.log("Đang chuẩn bị 10 bài viết cố định...");

    const blogsToSeed = rawBlogs.map((blog, index) => {
      // Ngày tạo cố định: mỗi bài cách nhau 1 ngày
      const createdAt = new Date(BASE_DATE);
      createdAt.setDate(BASE_DATE.getDate() + index);

      return {
        ...blog,
        author: staffUser._id,
        authorName: staffUser.username || "Staff",
        // Ảnh cố định, không random (dùng id từ 10 → 19)
        image: `https://picsum.photos/id/${index + 10}/800/600`,
        isPublished: true,
        createdAt: createdAt,
        updatedAt: createdAt,
      };
    });

    await Blog.insertMany(blogsToSeed);

    console.log(`✅ Thành công: Đã seed ${blogsToSeed.length} bài viết cố định!`);
    console.log("→ 3 bài nổi bật (featured):");
    console.log("  1. " + rawBlogs[0].title);
    console.log("  2. " + rawBlogs[2].title);
    console.log("  3. " + rawBlogs[4].title);

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
}

seedBlog();