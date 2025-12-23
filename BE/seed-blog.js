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

async function seedBlog() {
  try {
    console.log("Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    const staffUser = await User.findOne({ email: "staff@gmail.com" });
    if (!staffUser) {
      console.log("❌ Không tìm thấy staff user. Vui lòng chạy npm run seed trước!");
      process.exit(1);
    }

    console.log("Đang làm sạch dữ liệu cũ...");
    await Blog.deleteMany({});

    console.log("Đang tạo dữ liệu seed mới với nội dung phong phú...");
    await Blog.insertMany([
      {
        title: "Tầm Nhìn Marketing Digital 2025: Khi AI Trở Thành Trợ Thủ Đắc Lực",
        content: `
          <p>Chào mừng bạn đến với kỷ nguyên mới của Marketing. Trong năm 2025, chúng ta không chỉ nói về việc chạy quảng cáo, mà là về <strong>trải nghiệm cá nhân hóa sâu sắc</strong>.</p>
          
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Marketing 2025" style="width:100%; border-radius: 8px; margin: 20px 0;"/>

          <h2>1. Sự Trỗi Dậy Của Tìm Kiếm Bằng Giọng Nói (Voice Search)</h2>
          <p>Với sự phổ biến của các thiết bị thông minh, việc tối ưu hóa SEO không còn chỉ dừng lại ở từ khóa văn bản. Người dùng đang hỏi Google như hỏi một người bạn. Các doanh nghiệp cần:</p>
          <ul>
            <li>Tập trung vào các cụm từ tìm kiếm dài (Long-tail keywords).</li>
            <li>Sử dụng ngôn ngữ tự nhiên, gần gũi.</li>
            <li>Tối ưu hóa cho các câu hỏi "Làm thế nào", "Tại sao".</li>
          </ul>

          <h2>2. Nội Dung Video Ngắn (Short-form Video) Vẫn Là "Vua"</h2>
          <p>TikTok và Reels đã thay đổi cách chúng ta tiêu thụ thông tin. Trong năm 2025, các video 15-30 giây mang tính giáo dục và giải trí sẽ chiếm 80% lưu lượng truy cập mạng xã hội.</p>
          <blockquote>"Nội dung không chỉ cần hay, nó cần phải nhanh và chạm đúng nỗi đau của khách hàng ngay trong 3 giây đầu tiên."</blockquote>

          <h2>3. Trí Tuệ Nhân Tạo (AI) Trong Sáng Tạo Nội Dung</h2>
          <p>AI không thay thế con người, nhưng <em>người dùng AI sẽ thay thế người không dùng AI</em>. Việc sử dụng các mô hình ngôn ngữ lớn để lên kế hoạch nội dung và phân tích hành vi khách hàng sẽ giúp tiết kiệm 50% thời gian cho các Marketer.</p>
          
          <h2>Kết luận</h2>
          <p>Đừng đứng ngoài cuộc chơi công nghệ. Hãy bắt đầu thử nghiệm với AI và tập trung vào chất lượng hơn là số lượng để giữ chân khách hàng của bạn.</p>
        `,
        excerpt: "Khám phá chiến lược Marketing Digital đỉnh cao cho năm 2025: Từ tối ưu hóa Voice Search đến sức mạnh của Video ngắn và AI toàn diện.",
        author: staffUser._id,
        authorName: staffUser.username || "Staff",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        featured: true,
        category: "Business",
        tags: ["Marketing", "Digital", "Trends", "2025", "AI"],
        views: 2450,
        likes: [staffUser._id],
        ratings: [{ userId: staffUser._id, rating: 5 }],
        comments: [
          {
            userId: staffUser._id,
            username: staffUser.username || "Staff",
            content: "Nội dung rất sâu sắc, đặc biệt là phần về Voice Search!",
            createdAt: new Date(),
          },
        ],
        isPublished: true,
      },
      {
        title: "Cuộc Cách Mạng Trí Tuệ Nhân Tạo: Tương Lai Hay Mối Đe Dọa?",
        content: `
          <h2>Kỷ Nguyên Của Những Cỗ Máy Biết Suy Nghĩ</h2>
          <p>Chúng ta đang sống trong những năm tháng bản lề của lịch sử nhân loại. Trí tuệ nhân tạo (AI) đã bước ra khỏi những bộ phim viễn tưởng để len lỏi vào từng chiếc điện thoại, từng quy trình làm việc.</p>
          
          <h3>Ứng dụng đột phá trong y tế</h3>
          <p>Các hệ thống AI hiện nay có khả năng chẩn đoán hình ảnh chính xác hơn cả bác sĩ chuyên khoa trong một số trường hợp. Điều này mở ra cơ hội cứu sống hàng triệu người thông qua việc phát hiện sớm bệnh lý.</p>
          
          <h3>Thách thức về đạo đức và việc làm</h3>
          <p>Tuy nhiên, sự phát triển nóng của AI cũng đặt ra những câu hỏi hóc búa:</p>
          <ul>
            <li><strong>Bảo mật dữ liệu:</strong> Ai là người sở hữu thông tin mà AI học được?</li>
            <li><strong>Việc làm:</strong> Những công việc lặp đi lặp lại sẽ đi về đâu?</li>
            <li><strong>Đạo đức:</strong> Làm sao để AI không mang định kiến của con người?</li>
          </ul>

          <p>Dù có nhiều lo ngại, chúng ta không thể phủ nhận rằng AI đang giúp con người giải quyết những bài toán phức tạp mà trước đây mất hàng thập kỷ mới có lời giải.</p>
          <p><em>Hãy cùng đón chờ xem AI sẽ đưa chúng ta đi xa đến đâu trong 10 năm tới.</em></p>
        `,
        excerpt: "Phân tích đa chiều về sự phát triển của AI, từ những ứng dụng kỳ diệu trong y tế đến những thách thức đạo đức mà nhân loại phải đối mặt.",
        author: staffUser._id,
        authorName: staffUser.username || "Staff",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        featured: true,
        category: "Technology",
        tags: ["AI", "Technology", "Future", "Ethics"],
        views: 1890,
        likes: [],
        ratings: [],
        comments: [],
        isPublished: true,
      },
      {
        title: "7 Bước Xây Dựng Đế Chế Kinh Doanh Online Từ Con Số 0",
        content: `
          <p>Bạn muốn khởi nghiệp nhưng không có quá nhiều vốn? Kinh doanh online chính là cánh cửa dành cho bạn. Nhưng hãy nhớ, <strong>đây không phải là con đường trải đầy hoa hồng</strong>.</p>
          
          <h2>Lộ trình thực chiến</h2>
          <ol>
            <li><strong>Nghiên cứu thị trường ngách:</strong> Đừng bán thứ gì cũng có, hãy bán thứ mà khách hàng đang khao khát tìm kiếm.</li>
            <li><strong>Xây dựng thương hiệu cá nhân:</strong> Trong thế giới số, lòng tin là đơn vị tiền tệ quý giá nhất.</li>
            <li><strong>Lựa chọn nền tảng phù hợp:</strong> TikTok, Facebook hay Website riêng? Mỗi nơi có một "luật chơi" khác nhau.</li>
            <li><strong>Tối ưu hóa quy trình vận hành:</strong> Tự động hóa càng nhiều càng tốt để tập trung vào chiến lược.</li>
          </ol>

          <p>Nhiều người thất bại vì họ bỏ cuộc ngay khi gặp khó khăn về quảng cáo hay đơn hàng đầu tiên bị hoàn. Bí quyết thực sự nằm ở <strong>sự kiên trì</strong> và <strong>khả năng thích nghi</strong>.</p>
          <p>Nếu bạn bắt đầu ngay hôm nay với một kế hoạch bài bản, bạn đã đi trước 90% những người chỉ dừng lại ở mức "suy nghĩ".</p>
        `,
        excerpt: "Hướng dẫn chi tiết từng bước cho người mới bắt đầu khởi nghiệp kinh doanh trên nền tảng số với số vốn tối ưu.",
        author: staffUser._id,
        authorName: staffUser.username || "Staff",
        image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62",
        featured: false,
        category: "Business",
        tags: ["Business", "Online", "Startup", "Success"],
        views: 1150,
        likes: [],
        ratings: [],
        comments: [],
        isPublished: true,
      },
    ]);

    console.log("✅ Seed Blog thành công với nội dung chất lượng cao!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
}

seedBlog();