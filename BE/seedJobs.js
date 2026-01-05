// BE/seedJobs.js
import { connectDB } from "./src/config/db.js";
import Job from "./src/models/Job.js";
import Brand from "./src/models/Brand.js";

const brandsAndJobs = [
  {
    companyName: "Ogilvy Vietnam",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Ogilvy_logo.svg/800px-Ogilvy_logo.svg.png",
    description: "Ogilvy Vietnam đang tìm kiếm các Creator trẻ, sáng tạo để hợp tác lâu dài trong các chiến dịch quảng cáo lớn cuối năm.",
    requirements: [
      "Có kinh nghiệm content creation ít nhất 1 năm",
      "Sở hữu kênh TikTok/YouTube/Facebook có từ 50k followers trở lên",
      "Kỹ năng storytelling và biên tập video tốt"
    ],
    benefits: [
      "Thu nhập từ 20-50 triệu/tháng theo hiệu suất",
      "Hỗ trợ sản phẩm miễn phí từ brand",
      "Bonus viral + thưởng dự án",
      "Cơ hội hợp tác dài hạn với các thương hiệu quốc tế"
    ],
    location: "TP. Hồ Chí Minh & Hà Nội",
    salary: "20.000.000 - 50.000.000 VNĐ/tháng",
    order: 1
  },
  {
    companyName: "Mindshare Vietnam",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Mindshare_logo.svg/800px-Mindshare_logo.svg.png",
    description: "Mindshare cần KOL chuyên beauty & lifestyle để đẩy mạnh chiến dịch cho các thương hiệu lớn.",
    requirements: [
      "Chuyên beauty/skincare/lifestyle",
      "Có cộng đồng tương tác cao",
      "Kinh nghiệm hợp tác brand từ 6 tháng trở lên"
    ],
    benefits: [
      "Thu nhập cao + quà tặng sản phẩm cao cấp",
      "Hỗ trợ content production",
      "Thưởng hiệu suất + bonus cuối năm"
    ],
    location: "TP. Hồ Chí Minh",
    salary: "Thoả thuận theo năng lực",
    order: 2
  },
  {
    companyName: "Admicro",
    logo: "https://admicro.vn/images/logo-admicro.png",
    description: "Tuyển Creator chuyên livestream và video ngắn cho các nền tảng news & entertainment.",
    requirements: [
      "Kỹ năng livestream tốt, tương tác cao",
      "Có kinh nghiệm làm video Reels/TikTok",
      "Ưu tiên creator có kiến thức về tin tức, giải trí"
    ],
    benefits: [
      "Hỗ trợ thiết bị quay phim chuyên nghiệp",
      "Thu nhập theo view + doanh số",
      "Cơ hội làm việc với các kênh lớn"
    ],
    location: "Hà Nội",
    salary: "15.000.000 - 40.000.000 VNĐ/tháng",
    order: 3
  },
  {
    companyName: "FPT Shop",
    logo: "https://fptshop.com.vn/uploads/images/logo-fpt-shop.png",
    description: "FPT Shop tuyển reviewer công nghệ để unbox và đánh giá sản phẩm mới.",
    requirements: [
      "Am hiểu công nghệ, điện thoại, laptop",
      "Kỹ năng quay dựng video tốt",
      "Có kênh YouTube/TikTok về tech"
    ],
    benefits: [
      "Được giữ sản phẩm trải nghiệm dài hạn",
      "Thu nhập hấp dẫn + hoa hồng bán hàng",
      "Tham gia sự kiện ra mắt sản phẩm"
    ],
    location: "Toàn quốc",
    salary: "Thoả thuận + hoa hồng",
    order: 4
  },
  {
    companyName: "Hugs Agency",
    logo: "https://hugsagency.com/wp-content/uploads/2023/08/logo-hugs.png",
    description: "Hugs Agency cần TikToker/Reels Creator cho các chiến dịch viral ngắn.",
    requirements: [
      "Chuyên trend TikTok/Reels",
      "Có khả năng diễn xuất tự nhiên",
      "Tương tác cao, dễ viral"
    ],
    benefits: [
      "Thu nhập theo view + bonus viral",
      "Hỗ trợ kịch bản và sản xuất",
      "Cơ hội làm việc với brand lớn"
    ],
    location: "TP. Hồ Chí Minh",
    salary: "Theo hiệu suất (cao)",
    order: 5
  },
  {
    companyName: "Beau Agency",
    logo: "https://beau.vn/wp-content/uploads/2022/06/beau-logo.png",
    description: "Beau Agency tuyển Beauty Creator chuyên review mỹ phẩm và skincare.",
    requirements: [
      "Chuyên sâu về mỹ phẩm, skincare",
      "Kỹ năng review chân thực, thuyết phục",
      "Có kiến thức về thành phần sản phẩm"
    ],
    benefits: [
      "Nhận sản phẩm miễn phí từ các brand cao cấp",
      "Thu nhập ổn định + bonus",
      "Tham gia event làm đẹp"
    ],
    location: "TP. Hồ Chí Minh",
    salary: "18.000.000 - 35.000.000 VNĐ/tháng",
    order: 6
  },
  {
    companyName: "T Agency",
    logo: "https://t-agency.vn/wp-content/uploads/2023/05/t-agency-logo.png",
    description: "T Agency đang tìm partner content cho phim ngắn và series YouTube.",
    requirements: [
      "Có khả năng viết kịch bản",
      "Kỹ năng diễn xuất hoặc quay dựng",
      "Đam mê làm phim"
    ],
    benefits: [
      "Hỗ trợ ngân sách sản xuất",
      "Chia sẻ doanh thu video",
      "Cơ hội phát triển kênh"
    ],
    location: "Hà Nội",
    salary: "Thoả thuận theo dự án",
    order: 7
  },
  {
    companyName: "Dentsu Redder",
    logo: "https://dentsu.com.vn/wp-content/uploads/2022/10/dentsu-redder-logo.png",
    description: "Dentsu Redder tuyển Creator chuyên FMCG (thực phẩm, đồ uống).",
    requirements: [
      "Kinh nghiệm làm nội dung FMCG",
      "Hiểu biết về thị trường tiêu dùng",
      "Kỹ năng sáng tạo nội dung đời thường"
    ],
    benefits: [
      "Hỗ trợ sản phẩm + ngân sách quay",
      "Thu nhập cao theo dự án",
      "Làm việc với team chuyên nghiệp"
    ],
    location: "TP. Hồ Chí Minh",
    salary: "Thoả thuận",
    order: 8
  },
  {
    companyName: "Golden Communication",
    logo: "https://goldencommunication.vn/wp-content/uploads/2023/04/golden-logo.png",
    description: "Golden cần Food Reviewer và Travel Creator cho chiến dịch du lịch.",
    requirements: [
      "Đam mê ăn uống và du lịch",
      "Kỹ năng quay vlog tốt",
      "Có phong cách riêng"
    ],
    benefits: [
      "Hỗ trợ chi phí ăn uống, di chuyển",
      "Thu nhập cao + quà tặng",
      "Cơ hội đi du lịch miễn phí"
    ],
    location: "Toàn quốc",
    salary: "20.000.000 - 40.000.000 VNĐ/tháng",
    order: 9
  },
  {
    companyName: "VNG Corporation",
    logo: "https://vng.com.vn/wp-content/uploads/2023/10/vng-logo.png",
    description: "VNG tuyển Gaming Creator để quảng bá tựa game mới.",
    requirements: [
      "Chơi game giỏi, có kỹ năng stream",
      "Có cộng đồng game thủ",
      "Ưu tiên streamer lâu năm"
    ],
    benefits: [
      "Thu nhập cao + gift code game",
      "Tham gia beta test game mới",
      "Hỗ trợ thiết bị gaming"
    ],
    location: "TP. Hồ Chí Minh",
    salary: "Thoả thuận + bonus",
    order: 10
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log("Kết nối MongoDB thành công!");

    // Xóa sạch data cũ
    await Job.deleteMany({});
    await Brand.deleteMany({});
    console.log("Đã xóa sạch Job và Brand cũ");

    const createdBrands = [];
    for (let data of brandsAndJobs) {
      const brand = await Brand.create({
        user: null,
        companyName: data.companyName,
        description: "Brand chính thức - " + data.companyName,
        logo: data.logo,
      });
      createdBrands.push(brand);
      console.log(`Tạo Brand: ${data.companyName}`);
    }

    const jobDocs = createdBrands.map((brand, i) => ({
      brand: brand._id,
      title: "Tuyển Creator/KOL",
      description: brandsAndJobs[i].description,
      requirements: brandsAndJobs[i].requirements,
      benefits: brandsAndJobs[i].benefits,
      location: brandsAndJobs[i].location,
      salary: brandsAndJobs[i].salary,
      order: brandsAndJobs[i].order,
    }));

    await Job.insertMany(jobDocs);
    console.log("Seed 10 jobs với đầy đủ thông tin thành công!");
    process.exit(0);
  } catch (err) {
    console.error("Lỗi seed:", err.message);
    process.exit(1);
  }
};

seed();