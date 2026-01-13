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

const rawBlogs = [
  {
    title: "10 Xu Hướng Lập Trình Web Cần Chú Ý Trong Năm 2026",
    content: "<h2>Kỷ nguyên của AI-Driven Development</h2><p>Việc tích hợp AI vào quy trình code không còn là lựa chọn mà là bắt buộc...</p>",
    excerpt: "Điểm qua những công nghệ web đột phá như WebAssembly, AI coding assistants và kiến trúc serverless.",
    category: "Technology",
    tags: ["Programming", "Web", "2026", "AI"],
    views: 1200,
    featured: true,
  },
  {
    title: "Bí Quyết Quản Lý Tài Chính Cá Nhân Cho Gen Z",
    content: "<h2>Quy tắc 50/30/20 cải tiến</h2><p>Làm thế nào để đầu tư chứng khoán và crypto một cách thông minh từ số vốn nhỏ...</p>",
    excerpt: "Hướng dẫn chi tiết cách quản lý chi tiêu và đầu tư hiệu quả cho người trẻ khởi nghiệp.",
    category: "Finance",
    tags: ["Money", "GenZ", "Investment"],
    views: 850,
  },
  {
    title: "Cách Xây Dựng Thương Hiệu Cá Nhân Trên LinkedIn",
    content: "<h2>Tại sao LinkedIn quan trọng?</h2><p>Profile của bạn chính là bộ mặt thương hiệu chuyên nghiệp...</p>",
    excerpt: "Tối ưu hóa hồ sơ LinkedIn để thu hút nhà tuyển dụng và đối tác kinh doanh.",
    category: "Business",
    tags: ["LinkedIn", "Career", "Branding"],
    views: 2100,
    featured: true,
  },
  {
    title: "Tương Lai Của Năng Lượng Tái Tạo",
    content: "<h2>Pin mặt trời thế hệ mới</h2><p>Công nghệ lưu trữ năng lượng đang thay đổi bộ mặt ngành điện lực...</p>",
    excerpt: "Khám phá các giải pháp năng lượng xanh giúp bảo vệ môi trường bền vững.",
    category: "Environment",
    tags: ["Green Energy", "Future", "Solar"],
    views: 560,
  },
  {
    title: "5 Công Thức Nấu Ăn Eat Clean Cho Người Bận Rộn",
    content: "<h2>Bữa sáng đủ chất trong 5 phút</h2><p>Sử dụng yến mạch và hạt chia để có năng lượng cả ngày...</p>",
    excerpt: "Tổng hợp các món ăn nhanh, gọn, lẹ nhưng vẫn đảm bảo sức khỏe và vóc dáng.",
    category: "Lifestyle",
    tags: ["Health", "Food", "EatClean"],
    views: 3200,
    featured: true,
  },
  {
    title: "Sự Trỗi Dậy Của Thương Mại Điện Tử Xuyên Biên Giới",
    content: "<h2>Bán hàng ra thế giới qua Amazon và Etsy</h2><p>Cơ hội cho các sản phẩm thủ công mỹ nghệ Việt Nam...</p>",
    excerpt: "Phân tích tiềm năng và thách thức khi đưa sản phẩm nội địa ra thị trường quốc tế.",
    category: "Business",
    tags: ["E-commerce", "Global", "Sales"],
    views: 1450,
  },
  {
    title: "Hiểu Về Tâm Lý Học Người Tiêu Dùng Năm 2026",
    content: "<h2>Hành vi mua sắm thay đổi như thế nào?</h2><p>Người dùng ưu tiên các giá trị đạo đức và sự minh bạch của nhãn hàng...</p>",
    excerpt: "Nắm bắt tâm lý khách hàng để tối ưu hóa tỷ lệ chuyển đổi trong marketing.",
    category: "Marketing",
    tags: ["Psychology", "Consumer", "Insight"],
    views: 980,
  },
  {
    title: "Top 5 Thành Phố Đáng Ghé Thăm Tại Đông Nam Á",
    content: "<h2>Hành trình khám phá Bangkok và Hội An</h2><p>Những trải nghiệm văn hóa không thể bỏ qua...</p>",
    excerpt: "Gợi ý lịch trình du lịch giá rẻ nhưng cực chất cho mùa hè này.",
    category: "Travel",
    tags: ["Travel", "Asia", "Summer"],
    views: 4100,
    featured: true,
  },
  {
    title: "Ứng Dụng Blockchain Ngoài Tiền Điện Tử",
    content: "<h2>Blockchain trong quản lý chuỗi cung ứng</h2><p>Minh bạch hóa nguồn gốc thực phẩm bằng công nghệ sổ cái...</p>",
    excerpt: "Blockchain không chỉ có Bitcoin, hãy xem nó đang thay đổi các ngành công nghiệp khác ra sao.",
    category: "Technology",
    tags: ["Blockchain", "Tech", "SupplyChain"],
    views: 720,
  },
  {
    title: "Nghệ Thuật Quản Lý Thời Gian Với Phương Pháp Deep Work",
    content: "<h2>Làm việc sâu để đạt hiệu suất tối đa</h2><p>Loại bỏ các thông báo mạng xã hội và tập trung tuyệt đối...</p>",
    excerpt: "Cách rèn luyện khả năng tập trung cao độ trong một thế giới đầy xao nhãng.",
    category: "Productivity",
    tags: ["Work", "Focus", "Success"],
    views: 2800,
    featured: true,
  },
  {
    title: "Tại Sao Bạn Nên Học Một Ngôn Ngữ Mới?",
    content: "<h2>Mở rộng tư duy qua ngôn ngữ</h2><p>Học ngoại ngữ giúp cải thiện trí nhớ và mở ra cơ hội việc làm toàn cầu...</p>",
    excerpt: "Những lợi ích kinh ngạc của việc thông thạo từ 2 ngôn ngữ trở lên.",
    category: "Education",
    tags: ["Language", "Learning", "Skills"],
    views: 650,
  },
  {
    title: "Cybersecurity: Bảo Vệ Bản Thân Trên Không Gian Mạng",
    content: "<h2>Cách tạo mật khẩu mạnh và bảo mật 2 lớp</h2><p>Đừng để dữ liệu cá nhân bị đánh cắp bởi những thủ đoạn đơn giản...</p>",
    excerpt: "Cẩm nang an toàn thông tin dành cho người dùng không chuyên về kỹ thuật.",
    category: "Security",
    tags: ["Cyber", "Privacy", "Internet"],
    views: 1100,
  },
  {
    title: "Xu Hướng Thời Trang Bền Vững (Sustainable Fashion)",
    content: "<h2>Nói không với Fast Fashion</h2><p>Sử dụng chất liệu tái chế và ủng hộ các thương hiệu địa phương...</p>",
    excerpt: "Làm thế nào để mặc đẹp mà vẫn góp phần bảo vệ hành tinh.",
    category: "Fashion",
    tags: ["Sustainable", "Style", "Green"],
    views: 1300,
  },
  {
    title: "Lợi Ích Của Việc Thiền Định Mỗi Ngày",
    content: "<h2>10 phút tĩnh lặng cho tâm hồn</h2><p>Giảm stress và lo âu hiệu quả chỉ bằng hơi thở...</p>",
    excerpt: "Hướng dẫn thực hành thiền đơn giản cho người mới bắt đầu.",
    category: "Health",
    tags: ["Meditation", "MentalHealth", "Peace"],
    views: 2200,
    featured: true,
  },
  {
    title: "Khám Phá Vũ Trụ: Những Nhiệm Vụ Sao Hỏa Sắp Tới",
    content: "<h2>Tham vọng định cư trên Sao Hỏa của SpaceX</h2><p>Những bước tiến mới trong công nghệ tên lửa đẩy tái sử dụng...</p>",
    excerpt: "Cập nhật những tin tức mới nhất về cuộc đua vào không gian của các cường quốc.",
    category: "Science",
    tags: ["Space", "Mars", "NASA"],
    views: 3500,
    featured: true,
  },
  {
    title: "Cách Viết Nội Dung Chuẩn SEO Năm 2026",
    content: "<h2>Ưu tiên trải nghiệm người dùng (EEAT)</h2><p>Google đánh giá cao những bài viết có chuyên môn và độ tin cậy cao...</p>",
    excerpt: "Kỹ thuật viết bài giúp blog của bạn luôn đứng top tìm kiếm.",
    category: "Marketing",
    tags: ["SEO", "Content", "Google"],
    views: 1950,
  },
  {
    title: "Sức Mạnh Của Podcast Trong Truyền Thông",
    content: "<h2>Tại sao mọi người thích nghe Podcast?</h2><p>Sự tiện lợi khi vừa có thể lái xe, tập gym vừa học hỏi kiến thức...</p>",
    excerpt: "Cách xây dựng một kênh Podcast cá nhân thu hút hàng ngàn lượt nghe.",
    category: "Media",
    tags: ["Podcast", "Audio", "Trend"],
    views: 1200,
  },
  {
    title: "Phát Triển Tư Duy Phản Biện (Critical Thinking)",
    content: "<h2>Đặt câu hỏi trước mọi thông tin</h2><p>Kỹ năng quan trọng nhất trong thời đại tin giả tràn lan...</p>",
    excerpt: "Rèn luyện tư duy sắc bén để đưa ra những quyết định đúng đắn.",
    category: "Education",
    tags: ["Thinking", "Mindset", "Logic"],
    views: 890,
  },
  {
    title: "Làm Chủ Kỹ Năng Thuyết Trình Trước Đám Đông",
    content: "<h2>Vượt qua nỗi sợ đứng trước ống kính</h2><p>Cấu trúc bài thuyết trình đỉnh cao theo phong cách TED Talks...</p>",
    excerpt: "Biến những buổi thuyết trình nhàm chán thành những màn trình diễn đầy cảm hứng.",
    category: "Skills",
    tags: ["Presentation", "PublicSpeaking", "Confidence"],
    views: 1550,
    featured: true,
  },
  {
    title: "Tương Lai Của Công Việc Remote (Làm Việc Từ Xa)",
    content: "<h2>Mô hình Hybrid Work lên ngôi</h2><p>Sự cân bằng giữa cuộc sống và công việc khi không còn phải đến văn phòng...</p>",
    excerpt: "Các công cụ và văn hóa cần thiết để quản lý đội ngũ làm việc từ xa hiệu quả.",
    category: "Business",
    tags: ["Remote", "WorkLife", "DigitalNomad"],
    views: 2300,
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

    // 1. Cố định thời gian bắt đầu
    const BASE_DATE = new Date("2024-01-01T08:00:00Z");

    console.log("Đang chuẩn bị 20 bài viết cố định...");
    const blogsToSeed = rawBlogs.map((blog, index) => {
      // 2. Cố định ngày tạo: Mỗi bài cách nhau đúng 1 ngày từ mốc BASE_DATE
      const createdAt = new Date(BASE_DATE);
      createdAt.setDate(BASE_DATE.getDate() + index);

      return {
        ...blog,
        author: staffUser._id,
        authorName: staffUser.username || "Staff",
        // 3. Cố định hình ảnh: Sử dụng ảnh theo ID cố định (từ id 1 đến 20)
        // Điều này giúp trình duyệt cache ảnh và không bị load lại ngẫu nhiên
        image: `https://picsum.photos/id/${index + 10}/800/600`,
        isPublished: true,
        createdAt: createdAt,
        updatedAt: createdAt,
      };
    });

    await Blog.insertMany(blogsToSeed);

    console.log(`✅ Thành công: Đã seed ${blogsToSeed.length} bài viết cố định!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
}

seedBlog();