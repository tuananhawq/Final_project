import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Brand from "./src/models/Brand.js";
import JobPost from "./src/models/JobPost.js";
import Cv from "./src/models/Cv.js";
import BrandCv from "./src/models/BrandCv.js";
import Application from "./src/models/Application.js";
import Hero from "./src/models/Hero.js";
import Agency from "./src/models/Agency.js";
import Creator from "./src/models/Creator.js";
import Topic from "./src/models/Topic.js";
import Testimonial from "./src/models/Testimonial.js";
import Footer from "./src/models/Footer.js";
import Transaction from "./src/models/Transaction.js";
import PaymentConfig from "./src/models/PaymentConfig.js";
import Blog from "./src/models/Blog.js";

// 👉 fix cho ESM + Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 LOAD ĐÚNG FILE .env (ở thư mục BE)
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Connect DB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp_db";

async function seedAll() {
  try {
    console.log("🚀 Bắt đầu seed tất cả dữ liệu...");
    console.log("Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!\n");

    // Hash password mặc định
    const brandPassword = await bcrypt.hash("Brand123!", 10);
    const creatorPassword = await bcrypt.hash("Creator123!", 10);

    // ==================== XÓA DỮ LIỆU CŨ ====================
    console.log("🧹 Đang xóa dữ liệu cũ...");
    await Transaction.deleteMany({});
    await PaymentConfig.deleteMany({});
    await Blog.deleteMany({});
    await Application.deleteMany({});
    await BrandCv.deleteMany({});
    await JobPost.deleteMany({});
    await Brand.deleteMany({});
    await Cv.deleteMany({});
    await Hero.deleteMany({});
    await Agency.deleteMany({});
    await Creator.deleteMany({});
    await Topic.deleteMany({});
    await Testimonial.deleteMany({});
    await Footer.deleteMany({});
    
    // Xóa users cũ
    const emailsToDelete = [
      "brand1@revlive.com",
      "brand2@revlive.com",
      "brand3@revlive.com",
      "brand4@revlive.com",
      "creator1@revlive.com",
      "creator2@revlive.com",
      "creator3@revlive.com",
      "creator4@revlive.com",
      "creator5@revlive.com",
      "creator6@revlive.com",
      "creator7@revlive.com",
      "creator8@revlive.com",
      "brand5@revlive.com",
      "brand6@revlive.com",
      "brand7@revlive.com",
      "brand8@revlive.com",
      "brand9@revlive.com",
      "brand10@revlive.com",
      "creator9@revlive.com",
      "creator10@revlive.com",
      "creator11@revlive.com",
      "creator12@revlive.com",
      "creator13@revlive.com",
      "creator14@revlive.com",
      "creator15@revlive.com",
      "creator16@revlive.com",
      "creator17@revlive.com",
      "creator18@revlive.com",
    ];
    await User.deleteMany({ email: { $in: emailsToDelete } });
    console.log("✅ Đã xóa dữ liệu cũ\n");

    // ==================== HOME - HERO ====================
    console.log("📝 Đang tạo Hero...");
    const heroes = await Hero.insertMany([
      {
        title: "Kết nối Creator & Brand",
        titleHighlight: "Creator & Brand",
        description: "Nền tảng kết nối các Creator tài năng với các thương hiệu hàng đầu. Tạo cơ hội hợp tác, phát triển sự nghiệp và xây dựng thương hiệu cá nhân.",
        ctaText: "Khám phá ngay",
        backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920",
        isActive: true,
        order: 1,
      },
    ]);
    console.log(`✅ Đã tạo ${heroes.length} Hero\n`);

    // ==================== HOME - AGENCIES ====================
    console.log("🏢 Đang tạo Agencies (Home)...");
    const homeAgencies = await Agency.insertMany([
      {
        name: "Coca-Cola Vietnam",
        rank: "TOP 1",
        image: "https://logos-world.net/wp-content/uploads/2020/04/Coca-Cola-Logo.png",
        description: "Coca-Cola Vietnam là thương hiệu nước giải khát hàng đầu thế giới, luôn tìm kiếm các Creator sáng tạo để quảng bá sản phẩm. Với hơn 130 năm kinh nghiệm, chúng tôi cam kết mang đến những trải nghiệm tuyệt vời cho người tiêu dùng và đối tác. Chúng tôi tự hào hợp tác với các Creator tài năng để lan tỏa thông điệp tích cực và tạo ra những nội dung ý nghĩa.",
        size: "large",
        isActive: true,
        order: 1,
      },
      {
        name: "Samsung Electronics",
        rank: "TOP 2",
        image: "https://logos-world.net/wp-content/uploads/2020/06/Samsung-Logo.png",
        description: "Samsung Electronics Vietnam là nhà sản xuất điện tử hàng đầu, cần Creator để review và giới thiệu sản phẩm công nghệ mới nhất. Với sứ mệnh 'Inspire the World, Create the Future', chúng tôi không ngừng đổi mới và tạo ra những sản phẩm công nghệ tiên tiến. Chúng tôi tìm kiếm các Creator có đam mê công nghệ để chia sẻ những trải nghiệm thực tế và giá trị của sản phẩm Samsung đến với người tiêu dùng.",
        size: "small",
        isActive: true,
        order: 2,
      },
      {
        name: "Nike Vietnam",
        rank: "TOP 3",
        image: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
        description: "Nike Vietnam là thương hiệu thể thao toàn cầu, hợp tác với các Creator thể thao và lifestyle để truyền cảm hứng. Với triết lý 'Just Do It', chúng tôi tin rằng mọi người đều có thể vượt qua giới hạn của chính mình. Chúng tôi tìm kiếm các Creator có đam mê thể thao, có câu chuyện truyền cảm hứng và khả năng lan tỏa năng lượng tích cực đến cộng đồng.",
        size: "small",
        isActive: true,
        order: 3,
      },
    ]);
    console.log(`✅ Đã tạo ${homeAgencies.length} Agencies\n`);

    // ==================== USERS - BRAND ====================
    console.log("👤 Đang tạo Brand users...");
    const brandUsers = await User.insertMany([
      {
        email: "brand1@revlive.com",
        username: "cocacola_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "brand",
        premiumExpiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày từ bây giờ
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/Coca-Cola-Logo.png",
      },
      {
        email: "brand2@revlive.com",
        username: "pepsi_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "brand",
        premiumExpiredAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 ngày từ bây giờ
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/Pepsi-Logo.png",
      },
      {
        email: "brand3@revlive.com",
        username: "samsung_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        avatar: "https://logos-world.net/wp-content/uploads/2020/06/Samsung-Logo.png",
      },
      {
        email: "brand4@revlive.com",
        username: "nike_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "brand",
        premiumExpiredAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 ngày từ bây giờ
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
      },
    ]);
    console.log(`✅ Đã tạo ${brandUsers.length} Brand users\n`);

    // ==================== BRANDS ====================
    console.log("🏢 Đang tạo Brand profiles...");
    const brands = await Brand.insertMany([
      {
        user: brandUsers[0]._id,
        companyName: "Coca-Cola Vietnam",
        description: "Thương hiệu nước giải khát hàng đầu thế giới, luôn tìm kiếm các Creator sáng tạo để quảng bá sản phẩm.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/Coca-Cola-Logo.png",
        website: "https://www.coca-cola.com.vn",
        industry: "FMCG - Nước giải khát",
        followers: "500K",
        isActive: true,
        order: 1,
      },
      {
        user: brandUsers[1]._id,
        companyName: "PepsiCo Vietnam",
        description: "Tập đoàn đa quốc gia về thực phẩm và đồ uống, tìm kiếm đối tác Creator cho các chiến dịch marketing.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/Pepsi-Logo.png",
        website: "https://www.pepsico.com.vn",
        industry: "FMCG - Nước giải khát",
        followers: "300K",
        isActive: true,
        order: 2,
      },
      {
        user: brandUsers[2]._id,
        companyName: "Samsung Electronics Vietnam",
        description: "Nhà sản xuất điện tử hàng đầu, cần Creator để review và giới thiệu sản phẩm công nghệ mới nhất.",
        logo: "https://logos-world.net/wp-content/uploads/2020/06/Samsung-Logo.png",
        website: "https://www.samsung.com/vn",
        industry: "Công nghệ - Điện tử",
        followers: "1.2M",
        isActive: true,
        order: 3,
      },
      {
        user: brandUsers[3]._id,
        companyName: "Nike Vietnam",
        description: "Thương hiệu thể thao toàn cầu, hợp tác với các Creator thể thao và lifestyle để truyền cảm hứng.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
        website: "https://www.nike.com/vn",
        industry: "Thời trang - Thể thao",
        followers: "800K",
        isActive: true,
        order: 4,
      },
    ]);
    console.log(`✅ Đã tạo ${brands.length} Brand profiles\n`);

    // ==================== BRAND CVs ====================
    console.log("📄 Đang tạo Brand CVs...");
    const brandCvs = await BrandCv.insertMany([
      {
        owner: brandUsers[0]._id,
        title: "Coca-Cola Vietnam - Thông tin thương hiệu",
        content: "Coca-Cola là thương hiệu nước giải khát hàng đầu thế giới với hơn 130 năm lịch sử. Chúng tôi cam kết mang đến những trải nghiệm tuyệt vời cho người tiêu dùng và tìm kiếm các đối tác Creator sáng tạo để lan tỏa thông điệp tích cực. Chúng tôi hợp tác với các Creator có từ 50K followers trở lên, chuyên về lifestyle, food & beverage, và có khả năng tạo nội dung sáng tạo, tích cực.",
        cvFileUrl: "",
        cvFileType: "",
      },
      {
        owner: brandUsers[1]._id,
        title: "PepsiCo Vietnam - Giới thiệu thương hiệu",
        content: "PepsiCo là tập đoàn đa quốc gia về thực phẩm và đồ uống, với danh mục sản phẩm đa dạng. Chúng tôi tìm kiếm các Creator để hợp tác trong các chiến dịch marketing sáng tạo và hiệu quả. Chúng tôi ưu tiên các Creator có kinh nghiệm với các thương hiệu FMCG, có khả năng tạo nội dung viral và engagement rate cao.",
        cvFileUrl: "",
        cvFileType: "",
      },
      {
        owner: brandUsers[2]._id,
        title: "Samsung Electronics Vietnam - Thông tin thương hiệu",
        content: "Samsung Electronics Vietnam là nhà sản xuất điện tử hàng đầu thế giới. Chúng tôi tìm kiếm các Creator chuyên về công nghệ để review và giới thiệu các sản phẩm mới nhất. Yêu cầu: Creator có từ 100K followers trở lên, chuyên về tech review, unboxing, và có khả năng tạo nội dung kỹ thuật nhưng dễ hiểu.",
        cvFileUrl: "",
        cvFileType: "",
      },
      {
        owner: brandUsers[3]._id,
        title: "Nike Vietnam - Giới thiệu thương hiệu",
        content: "Nike Vietnam là thương hiệu thể thao toàn cầu, hợp tác với các Creator thể thao và lifestyle để truyền cảm hứng. Chúng tôi tìm kiếm các Creator chuyên về fitness, sports, và healthy lifestyle. Yêu cầu: Creator có từ 80K followers trở lên, có kinh nghiệm tạo nội dung về thể thao, workout, và có thể tham gia các sự kiện thể thao offline.",
        cvFileUrl: "",
        cvFileType: "",
      },
    ]);
    console.log(`✅ Đã tạo ${brandCvs.length} Brand CVs\n`);

    // ==================== JOB POSTS ====================
    console.log("📋 Đang tạo JobPosts...");
    const jobPosts = await JobPost.insertMany([
      {
        brand: brands[0]._id,
        brandName: brands[0].companyName,
        title: "Tuyển Creator Content cho chiến dịch Tết 2025",
        jobType: "Content Creator",
        workTime: "Part-time, linh hoạt",
        content: "Chúng tôi đang tìm kiếm các Creator có khả năng sáng tạo nội dung về Tết Nguyên Đán 2025. Nhiệm vụ bao gồm: tạo video TikTok/Instagram Reels, viết bài blog, chụp ảnh sản phẩm, và tham gia các sự kiện offline của thương hiệu.",
        budget: "15,000,000 - 30,000,000 VNĐ/bài",
        requirements: "Có từ 10K followers trên TikTok hoặc Instagram. Kinh nghiệm tạo nội dung về lifestyle, food & beverage. Có khả năng quay và edit video chất lượng cao.",
        benefits: "Hợp đồng dài hạn, tham gia các sự kiện độc quyền, nhận sản phẩm miễn phí, cơ hội hợp tác với các thương hiệu lớn khác trong hệ sinh thái.",
        isActive: true,
      },
      {
        brand: brands[0]._id,
        brandName: brands[0].companyName,
        title: "Tìm Influencer cho chiến dịch Summer Campaign",
        jobType: "Influencer Marketing",
        workTime: "Full-time hoặc Part-time",
        content: "Chiến dịch quảng bá sản phẩm nước giải khát mùa hè. Yêu cầu Creator có lượng tương tác cao, đặc biệt là Gen Z và Millennials. Sẽ có 5-7 bài đăng trong vòng 2 tháng.",
        budget: "20,000,000 - 50,000,000 VNĐ/tháng",
        requirements: "Từ 50K followers trên các nền tảng. Engagement rate > 3%. Có kinh nghiệm hợp tác với các thương hiệu FMCG.",
        benefits: "Ngân sách marketing lớn, hỗ trợ sản phẩm và concept, team hỗ trợ chuyên nghiệp, cơ hội trở thành đại sứ thương hiệu.",
        isActive: true,
      },
      {
        brand: brands[2]._id,
        brandName: brands[2].companyName,
        title: "Tuyển Tech Reviewer cho dòng Galaxy mới",
        jobType: "Tech Reviewer",
        workTime: "Part-time",
        content: "Cần Creator chuyên về công nghệ để review chi tiết dòng điện thoại Galaxy mới nhất. Bao gồm: unboxing, camera test, performance test, và so sánh với đối thủ.",
        budget: "30,000,000 - 60,000,000 VNĐ/video",
        requirements: "Kênh YouTube/TikTok về công nghệ từ 30K followers, có kiến thức về smartphone, khả năng quay và edit video chuyên nghiệp.",
        benefits: "Được dùng thử sản phẩm trước khi ra mắt, hợp tác với team marketing chuyên nghiệp, cơ hội tham gia các sự kiện công nghệ lớn.",
        isActive: true,
      },
      {
        brand: brands[3]._id,
        brandName: brands[3].companyName,
        title: "Tuyển Fitness Influencer cho dòng giày chạy bộ",
        jobType: "Fitness Influencer",
        workTime: "Part-time",
        content: "Tìm kiếm Creator chuyên về chạy bộ và fitness để review và quảng bá dòng giày chạy bộ mới. Tạo nội dung về training, marathon, và lifestyle.",
        budget: "25,000,000 - 45,000,000 VNĐ/tháng",
        requirements: "Từ 25K followers, có nội dung về running/fitness, có kinh nghiệm chạy bộ, khả năng tạo video động lực và truyền cảm hứng.",
        benefits: "Nhận giày và trang phục Nike miễn phí, tham gia các giải chạy được tài trợ, hợp tác với các vận động viên chuyên nghiệp.",
        isActive: true,
      },
    ]);
    
    // Thêm nhiều Brands hơn trước khi tạo JobPosts
    console.log("🏢 Đang tạo thêm Brand users và profiles...");
    const additionalBrandUsers = await User.insertMany([
      {
        email: "brand5@revlive.com",
        username: "adidas_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "brand",
        premiumExpiredAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
      },
      {
        email: "brand6@revlive.com",
        username: "apple_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "brand",
        premiumExpiredAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
      },
      {
        email: "brand7@revlive.com",
        username: "mcdonalds_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png",
      },
      {
        email: "brand8@revlive.com",
        username: "starbucks_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "brand",
        premiumExpiredAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/Starbucks-Logo.png",
      },
      {
        email: "brand9@revlive.com",
        username: "unilever_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "brand",
        premiumExpiredAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/Unilever-Logo.png",
      },
      {
        email: "brand10@revlive.com",
        username: "loreal_brand",
        passwordHash: brandPassword,
        provider: "local",
        roles: ["brand", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "brand",
        premiumExpiredAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        avatar: "https://logos-world.net/wp-content/uploads/2020/04/Loreal-Logo.png",
      },
    ]);

    const additionalBrands = await Brand.insertMany([
      {
        user: additionalBrandUsers[0]._id,
        companyName: "Adidas Vietnam",
        description: "Thương hiệu thể thao hàng đầu thế giới, tìm kiếm các Creator thể thao và lifestyle.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
        website: "https://www.adidas.com.vn",
        industry: "Thời trang - Thể thao",
        followers: "900K",
        isActive: true,
        order: 5,
      },
      {
        user: additionalBrandUsers[1]._id,
        companyName: "Apple Vietnam",
        description: "Công ty công nghệ hàng đầu thế giới, cần Creator để review và giới thiệu sản phẩm Apple.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
        website: "https://www.apple.com/vn",
        industry: "Công nghệ - Điện tử",
        followers: "2.5M",
        isActive: true,
        order: 6,
      },
      {
        user: additionalBrandUsers[2]._id,
        companyName: "McDonald's Vietnam",
        description: "Chuỗi nhà hàng thức ăn nhanh hàng đầu, tìm kiếm Creator cho các chiến dịch marketing.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png",
        website: "https://www.mcdonalds.com.vn",
        industry: "F&B - Nhà hàng",
        followers: "1.5M",
        isActive: true,
        order: 7,
      },
      {
        user: additionalBrandUsers[3]._id,
        companyName: "Starbucks Vietnam",
        description: "Thương hiệu cà phê hàng đầu thế giới, hợp tác với Creator để lan tỏa văn hóa cà phê.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/Starbucks-Logo.png",
        website: "https://www.starbucks.com.vn",
        industry: "F&B - Cà phê",
        followers: "800K",
        isActive: true,
        order: 8,
      },
      {
        user: additionalBrandUsers[4]._id,
        companyName: "Unilever Vietnam",
        description: "Tập đoàn hàng tiêu dùng hàng đầu, tìm kiếm Creator cho các sản phẩm chăm sóc cá nhân và gia đình.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/Unilever-Logo.png",
        website: "https://www.unilever.com.vn",
        industry: "FMCG - Hàng tiêu dùng",
        followers: "600K",
        isActive: true,
        order: 9,
      },
      {
        user: additionalBrandUsers[5]._id,
        companyName: "L'Oréal Vietnam",
        description: "Thương hiệu mỹ phẩm hàng đầu thế giới, hợp tác với Beauty Influencer để quảng bá sản phẩm.",
        logo: "https://logos-world.net/wp-content/uploads/2020/04/Loreal-Logo.png",
        website: "https://www.loreal.com.vn",
        industry: "Mỹ phẩm - Làm đẹp",
        followers: "1.8M",
        isActive: true,
        order: 10,
      },
    ]);
    console.log(`✅ Đã tạo thêm ${additionalBrandUsers.length} Brand users và ${additionalBrands.length} Brand profiles\n`);

    // Merge với brands array
    const allBrands = [...brands, ...additionalBrands];
    const allBrandUsers = [...brandUsers, ...additionalBrandUsers];
    
    // Thêm nhiều JobPosts hơn từ các brands mới
    const additionalJobPosts = await JobPost.insertMany([
      {
        brand: allBrands[4]._id,
        brandName: allBrands[4].companyName,
        title: "Tuyển Creator cho chiến dịch Adidas Originals",
        jobType: "Lifestyle Creator",
        workTime: "Part-time",
        content: "Tìm kiếm Creator có phong cách streetwear và lifestyle để quảng bá dòng Adidas Originals. Tạo nội dung về fashion, sneaker culture và urban lifestyle.",
        budget: "30,000,000 - 60,000,000 VNĐ/tháng",
        requirements: "Từ 50K followers, có nội dung về streetwear/fashion, có phong cách riêng biệt và độc đáo.",
        benefits: "Nhận sản phẩm Adidas miễn phí, tham gia các sự kiện độc quyền, hợp tác với các nghệ sĩ và influencer lớn.",
        isActive: true,
      },
      {
        brand: allBrands[5]._id,
        brandName: allBrands[5].companyName,
        title: "Tuyển Tech Reviewer cho iPhone mới",
        jobType: "Tech Reviewer",
        workTime: "Part-time",
        content: "Cần Creator chuyên về công nghệ để review iPhone mới nhất. Bao gồm camera test, performance review, và so sánh với các flagship khác.",
        budget: "50,000,000 - 100,000,000 VNĐ/video",
        requirements: "Kênh YouTube/TikTok về công nghệ từ 100K followers, có kiến thức sâu về Apple ecosystem.",
        benefits: "Được dùng thử sản phẩm trước khi ra mắt, hợp tác với Apple Vietnam, cơ hội tham gia các sự kiện công nghệ lớn.",
        isActive: true,
      },
      {
        brand: allBrands[6]._id,
        brandName: allBrands[6].companyName,
        title: "Tuyển Food Creator cho chiến dịch McDonald's",
        jobType: "Food Content Creator",
        workTime: "Part-time",
        content: "Tìm kiếm Creator chuyên về food để review và quảng bá các món ăn mới của McDonald's. Tạo nội dung về trải nghiệm ẩm thực và văn hóa fast food.",
        budget: "20,000,000 - 40,000,000 VNĐ/tháng",
        requirements: "Từ 30K followers, có nội dung về food/restaurant review, có khả năng tạo video hấp dẫn.",
        benefits: "Nhận voucher McDonald's miễn phí, tham gia các sự kiện ra mắt sản phẩm mới, hợp tác với team marketing chuyên nghiệp.",
        isActive: true,
      },
      {
        brand: allBrands[7]._id,
        brandName: allBrands[7].companyName,
        title: "Tuyển Lifestyle Creator cho Starbucks",
        jobType: "Lifestyle Influencer",
        workTime: "Part-time",
        content: "Tìm kiếm Creator có phong cách sống hiện đại để quảng bá văn hóa cà phê Starbucks. Tạo nội dung về coffee culture, workspace lifestyle và moments.",
        budget: "25,000,000 - 45,000,000 VNĐ/tháng",
        requirements: "Từ 40K followers, có nội dung về lifestyle/coffee culture, có aesthetic đẹp và nhất quán.",
        benefits: "Nhận Starbucks card miễn phí, tham gia các workshop về cà phê, hợp tác với các barista chuyên nghiệp.",
        isActive: true,
      },
      {
        brand: allBrands[8]._id,
        brandName: allBrands[8].companyName,
        title: "Tuyển Beauty Creator cho Unilever",
        jobType: "Beauty Influencer",
        workTime: "Part-time",
        content: "Tìm kiếm Creator chuyên về beauty để review và quảng bá các sản phẩm chăm sóc cá nhân của Unilever. Tạo nội dung về skincare, haircare và personal care.",
        budget: "22,000,000 - 42,000,000 VNĐ/tháng",
        requirements: "Từ 35K followers, có nội dung về beauty/skincare, có kiến thức về các sản phẩm chăm sóc cá nhân.",
        benefits: "Nhận sản phẩm Unilever miễn phí, tham gia các workshop về skincare, hợp tác với các chuyên gia làm đẹp.",
        isActive: true,
      },
      {
        brand: allBrands[9]._id,
        brandName: allBrands[9].companyName,
        title: "Tuyển Makeup Artist cho L'Oréal",
        jobType: "Makeup Artist",
        workTime: "Part-time",
        content: "Tìm kiếm Makeup Artist chuyên nghiệp để tạo tutorial và review các sản phẩm mỹ phẩm L'Oréal. Tạo nội dung về makeup techniques và product reviews.",
        budget: "35,000,000 - 65,000,000 VNĐ/tháng",
        requirements: "Professional makeup artist, từ 50K followers, có portfolio đẹp và chuyên nghiệp.",
        benefits: "Nhận bộ sưu tập mỹ phẩm L'Oréal miễn phí, tham gia các sự kiện beauty lớn, hợp tác với các makeup artist hàng đầu.",
        isActive: true,
      },
      {
        brand: brands[0]._id,
        brandName: brands[0].companyName,
        title: "Tuyển Creator cho chiến dịch Coca-Cola Zero",
        jobType: "Content Creator",
        workTime: "Part-time",
        content: "Tìm kiếm Creator để quảng bá Coca-Cola Zero - sản phẩm không đường mới. Tạo nội dung về healthy lifestyle và zero sugar trend.",
        budget: "18,000,000 - 35,000,000 VNĐ/tháng",
        requirements: "Từ 25K followers, có nội dung về lifestyle/health, có khả năng tạo video sáng tạo.",
        benefits: "Nhận sản phẩm Coca-Cola Zero miễn phí, tham gia các sự kiện healthy lifestyle, hợp tác với các thương hiệu khác.",
        isActive: true,
      },
      {
        brand: brands[1]._id,
        brandName: brands[1].companyName,
        title: "Tuyển Creator cho chiến dịch Pepsi Max",
        jobType: "Influencer Marketing",
        workTime: "Part-time",
        content: "Tìm kiếm Creator để quảng bá Pepsi Max - phiên bản không đường. Tạo nội dung về energy và bold taste.",
        budget: "20,000,000 - 38,000,000 VNĐ/tháng",
        requirements: "Từ 30K followers, có nội dung về lifestyle/entertainment, có engagement rate cao.",
        benefits: "Nhận sản phẩm Pepsi Max miễn phí, tham gia các sự kiện giải trí, hợp tác với các thương hiệu lớn.",
        isActive: true,
      },
      {
        brand: brands[2]._id,
        brandName: brands[2].companyName,
        title: "Tuyển Creator cho dòng Galaxy Watch",
        jobType: "Tech Reviewer",
        workTime: "Part-time",
        content: "Cần Creator để review Galaxy Watch mới nhất. Bao gồm fitness tracking, health monitoring và smart features.",
        budget: "40,000,000 - 70,000,000 VNĐ/video",
        requirements: "Kênh về công nghệ từ 40K followers, có kiến thức về smartwatch và wearable tech.",
        benefits: "Được dùng thử Galaxy Watch trước khi ra mắt, hợp tác với Samsung Vietnam, cơ hội review các sản phẩm công nghệ khác.",
        isActive: true,
      },
      {
        brand: brands[3]._id,
        brandName: brands[3].companyName,
        title: "Tuyển Creator cho dòng Nike Air Max",
        jobType: "Fashion Influencer",
        workTime: "Part-time",
        content: "Tìm kiếm Creator để quảng bá dòng giày Nike Air Max. Tạo nội dung về sneaker culture và street style.",
        budget: "28,000,000 - 48,000,000 VNĐ/tháng",
        requirements: "Từ 35K followers, có nội dung về fashion/sneakers, có phong cách streetwear.",
        benefits: "Nhận giày Nike Air Max miễn phí, tham gia các sự kiện sneaker culture, hợp tác với các thương hiệu streetwear.",
        isActive: true,
      },
      {
        brand: allBrands[4]._id,
        brandName: allBrands[4].companyName,
        title: "Tuyển Creator cho chiến dịch Adidas Sportswear",
        jobType: "Sports Influencer",
        workTime: "Part-time",
        content: "Tìm kiếm Creator chuyên về thể thao để quảng bá dòng Adidas Sportswear. Tạo nội dung về training, sports performance và athletic lifestyle.",
        budget: "32,000,000 - 55,000,000 VNĐ/tháng",
        requirements: "Từ 45K followers, có nội dung về sports/fitness, có kinh nghiệm trong thể thao.",
        benefits: "Nhận trang phục thể thao Adidas miễn phí, tham gia các giải đấu được tài trợ, hợp tác với các vận động viên chuyên nghiệp.",
        isActive: true,
      },
      {
        brand: allBrands[5]._id,
        brandName: allBrands[5].companyName,
        title: "Tuyển Creator cho iPad Pro",
        jobType: "Tech Content Creator",
        workTime: "Part-time",
        content: "Cần Creator để review iPad Pro mới nhất. Bao gồm productivity features, creative capabilities và Apple Pencil experience.",
        budget: "45,000,000 - 85,000,000 VNĐ/video",
        requirements: "Kênh về công nghệ từ 60K followers, có kiến thức về tablet và creative workflows.",
        benefits: "Được dùng thử iPad Pro trước khi ra mắt, hợp tác với Apple Vietnam, cơ hội review các sản phẩm Apple khác.",
        isActive: true,
      },
      {
        brand: allBrands[6]._id,
        brandName: allBrands[6].companyName,
        title: "Tuyển Creator cho chiến dịch Big Mac",
        jobType: "Food Content Creator",
        workTime: "Part-time",
        content: "Tìm kiếm Creator để quảng bá Big Mac - biểu tượng của McDonald's. Tạo nội dung về iconic burger và fast food culture.",
        budget: "24,000,000 - 44,000,000 VNĐ/tháng",
        requirements: "Từ 40K followers, có nội dung về food/restaurant, có khả năng tạo video hấp dẫn về ẩm thực.",
        benefits: "Nhận voucher McDonald's miễn phí, tham gia các sự kiện đặc biệt, hợp tác với các food creator khác.",
        isActive: true,
      },
      {
        brand: allBrands[7]._id,
        brandName: allBrands[7].companyName,
        title: "Tuyển Creator cho Starbucks Reserve",
        jobType: "Coffee Content Creator",
        workTime: "Part-time",
        content: "Tìm kiếm Creator để quảng bá Starbucks Reserve - dòng cà phê cao cấp. Tạo nội dung về specialty coffee và coffee tasting experience.",
        budget: "26,000,000 - 46,000,000 VNĐ/tháng",
        requirements: "Từ 35K followers, có nội dung về coffee/lifestyle, có kiến thức về specialty coffee.",
        benefits: "Nhận Starbucks Reserve miễn phí, tham gia các cuộc thi cà phê, hợp tác với các barista chuyên nghiệp.",
        isActive: true,
      },
      {
        brand: allBrands[8]._id,
        brandName: allBrands[8].companyName,
        title: "Tuyển Creator cho Dove",
        jobType: "Beauty Influencer",
        workTime: "Part-time",
        content: "Tìm kiếm Creator để quảng bá Dove - sản phẩm chăm sóc da. Tạo nội dung về real beauty và body positivity.",
        budget: "23,000,000 - 43,000,000 VNĐ/tháng",
        requirements: "Từ 30K followers, có nội dung về beauty/skincare, có thông điệp tích cực về body image.",
        benefits: "Nhận sản phẩm Dove miễn phí, tham gia các chiến dịch body positivity, hợp tác với các beauty influencer.",
        isActive: true,
      },
      {
        brand: allBrands[9]._id,
        brandName: allBrands[9].companyName,
        title: "Tuyển Creator cho Maybelline",
        jobType: "Makeup Influencer",
        workTime: "Part-time",
        content: "Tìm kiếm Creator để quảng bá Maybelline - thương hiệu mỹ phẩm giá cả phải chăng. Tạo tutorial makeup và product reviews.",
        budget: "30,000,000 - 50,000,000 VNĐ/tháng",
        requirements: "Từ 40K followers, có nội dung về makeup/beauty, có khả năng tạo tutorial chuyên nghiệp.",
        benefits: "Nhận bộ sưu tập Maybelline miễn phí, tham gia các sự kiện beauty, hợp tác với các makeup artist.",
        isActive: true,
      },
    ]);
    
    const allJobPosts = [...jobPosts, ...additionalJobPosts];
    console.log(`✅ Đã tạo ${allJobPosts.length} JobPosts (${jobPosts.length} ban đầu + ${additionalJobPosts.length} thêm)\n`);

    // ==================== USERS - CREATOR ====================
    console.log("👤 Đang tạo Creator users...");
    const nowForUsers = new Date();
    const creatorUsers = await User.insertMany([
      {
        email: "creator1@revlive.com",
        username: "minh_creator",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 ngày từ bây giờ
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        email: "creator2@revlive.com",
        username: "linh_content",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 ngày từ bây giờ
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      {
        email: "creator3@revlive.com",
        username: "tech_reviewer",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      {
        email: "creator4@revlive.com",
        username: "fitness_lifestyle",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 ngày từ bây giờ
        avatar: "https://i.pravatar.cc/150?img=20",
      },
      {
        email: "creator5@revlive.com",
        username: "foodie_vlogger",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        avatar: "https://i.pravatar.cc/150?img=33",
      },
      {
        email: "creator6@revlive.com",
        username: "beauty_influencer",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 ngày từ bây giờ
        avatar: "https://i.pravatar.cc/150?img=47",
      },
    ]);
    console.log(`✅ Đã tạo ${creatorUsers.length} Creator users\n`);

    // Thêm nhiều Creator users hơn
    console.log("👤 Đang tạo thêm Creator users...");
    const additionalCreatorUsers = await User.insertMany([
      {
        email: "creator9@revlive.com",
        username: "gaming_streamer",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(nowForUsers.getTime() + 18 * 24 * 60 * 60 * 1000),
        avatar: "https://i.pravatar.cc/150?img=53",
        createdAt: new Date(nowForUsers.getTime() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        email: "creator10@revlive.com",
        username: "music_producer",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        avatar: "https://i.pravatar.cc/150?img=54",
        createdAt: new Date(nowForUsers.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 ngày trước (khách hàng mới)
      },
      {
        email: "creator11@revlive.com",
        username: "fashion_stylist",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(nowForUsers.getTime() + 22 * 24 * 60 * 60 * 1000),
        avatar: "https://i.pravatar.cc/150?img=55",
        createdAt: new Date(nowForUsers.getTime() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        email: "creator12@revlive.com",
        username: "pet_content",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        avatar: "https://i.pravatar.cc/150?img=56",
        createdAt: new Date(nowForUsers.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 ngày trước (khách hàng mới)
      },
      {
        email: "creator13@revlive.com",
        username: "comedy_creator",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(nowForUsers.getTime() + 28 * 24 * 60 * 60 * 1000),
        avatar: "https://i.pravatar.cc/150?img=57",
        createdAt: new Date(nowForUsers.getTime() - 22 * 24 * 60 * 60 * 1000),
      },
      {
        email: "creator14@revlive.com",
        username: "education_content",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        avatar: "https://i.pravatar.cc/150?img=58",
        createdAt: new Date(nowForUsers.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 ngày trước (khách hàng mới)
      },
      {
        email: "creator15@revlive.com",
        username: "diy_crafts",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(nowForUsers.getTime() + 15 * 24 * 60 * 60 * 1000),
        avatar: "https://i.pravatar.cc/150?img=59",
        createdAt: new Date(nowForUsers.getTime() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        email: "creator16@revlive.com",
        username: "travel_vlogger",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(nowForUsers.getTime() + 30 * 24 * 60 * 60 * 1000),
        avatar: "https://i.pravatar.cc/150?img=60",
        createdAt: new Date(nowForUsers.getTime() - 28 * 24 * 60 * 60 * 1000),
      },
      {
        email: "creator17@revlive.com",
        username: "sports_analyst",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "free",
        memberType: "free",
        premiumExpiredAt: null,
        avatar: "https://i.pravatar.cc/150?img=61",
        createdAt: new Date(nowForUsers.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 ngày trước (khách hàng mới)
      },
      {
        email: "creator18@revlive.com",
        username: "parenting_tips",
        passwordHash: creatorPassword,
        provider: "local",
        roles: ["creator", "user"],
        isVerified: true,
        isActive: true,
        isDeleted: false,
        premiumStatus: "premium",
        memberType: "creator",
        premiumExpiredAt: new Date(nowForUsers.getTime() + 12 * 24 * 60 * 60 * 1000),
        avatar: "https://i.pravatar.cc/150?img=62",
        createdAt: new Date(nowForUsers.getTime() - 16 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`✅ Đã tạo thêm ${additionalCreatorUsers.length} Creator users\n`);

    // Merge với creatorUsers array
    const allCreatorUsers = [...creatorUsers, ...additionalCreatorUsers];

    // ==================== HOME - CREATORS ====================
    console.log("⭐ Đang tạo Creators (Home)...");
    const homeCreators = await Creator.insertMany([
      {
        user: creatorUsers[0]._id,
        name: "Nguyễn Văn Minh",
        description: "Content Creator chuyên về Lifestyle & Travel - 150K followers",
        avatar: "https://i.pravatar.cc/150?img=1",
        followers: "150K",
        isActive: true,
        order: 1,
      },
      {
        user: creatorUsers[1]._id,
        name: "Trần Thị Linh",
        description: "Influencer Marketing chuyên nghiệp - 200K followers",
        avatar: "https://i.pravatar.cc/150?img=5",
        followers: "200K",
        isActive: true,
        order: 2,
      },
      {
        user: creatorUsers[2]._id,
        name: "Lê Hoàng Anh",
        description: "Tech Reviewer & Unboxing Specialist - 120K followers",
        avatar: "https://i.pravatar.cc/150?img=12",
        followers: "120K",
        isActive: true,
        order: 3,
      },
      {
        user: creatorUsers[3]._id,
        name: "Phạm Thị Hương",
        description: "Fitness & Health Content Creator - 250K followers",
        avatar: "https://i.pravatar.cc/150?img=20",
        followers: "250K",
        isActive: true,
        order: 4,
      },
      {
        user: creatorUsers[4]._id,
        name: "Võ Đức Thành",
        description: "Food Vlogger & Restaurant Reviewer - 80K followers",
        avatar: "https://i.pravatar.cc/150?img=33",
        followers: "80K",
        isActive: true,
        order: 5,
      },
      {
        user: creatorUsers[5]._id,
        name: "Đỗ Thị Mai",
        description: "Beauty Influencer & Makeup Artist - 180K followers",
        avatar: "https://i.pravatar.cc/150?img=47",
        followers: "180K",
        isActive: true,
        order: 6,
      },
    ]);
    console.log(`✅ Đã tạo ${homeCreators.length} Creators (Home)\n`);

    // ==================== CREATOR CVs ====================
    console.log("📄 Đang tạo Creator CVs...");
    const cvs = await Cv.insertMany([
      {
        user: creatorUsers[0]._id,
        fullName: "Nguyễn Văn Minh",
        title: "Content Creator chuyên về Lifestyle & Travel",
        mainSkills: ["Video Editing", "Photography", "Storytelling", "Social Media Marketing"],
        experienceYears: 3,
        experienceDetail: "3 năm kinh nghiệm tạo nội dung cho các thương hiệu FMCG, du lịch và lifestyle. Đã hợp tác với hơn 20 thương hiệu lớn như Coca-Cola, Samsung, Nike. Chuyên tạo video TikTok, Instagram Reels và YouTube vlog.",
        tags: ["lifestyle", "travel", "vlog", "tiktok", "instagram"],
        isPublic: true,
      },
      {
        user: creatorUsers[1]._id,
        fullName: "Trần Thị Linh",
        title: "Influencer Marketing chuyên nghiệp",
        mainSkills: ["Influencer Marketing", "Brand Partnership", "Content Strategy", "Analytics"],
        experienceYears: 5,
        experienceDetail: "5 năm kinh nghiệm trong lĩnh vực influencer marketing. Đã thực hiện hơn 50 chiến dịch cho các thương hiệu lớn. Chuyên về beauty, fashion và lifestyle. Có 200K+ followers trên Instagram và TikTok.",
        tags: ["beauty", "fashion", "lifestyle", "influencer", "marketing"],
        isPublic: true,
      },
      {
        user: creatorUsers[2]._id,
        fullName: "Lê Hoàng Anh",
        title: "Tech Reviewer & Unboxing Specialist",
        mainSkills: ["Tech Review", "Video Production", "Product Testing", "Technical Writing"],
        experienceYears: 4,
        experienceDetail: "4 năm review công nghệ, chuyên về smartphone, laptop và thiết bị điện tử. Kênh YouTube 80K subscribers, TikTok 120K followers. Đã hợp tác với Samsung, Apple, Xiaomi và nhiều thương hiệu công nghệ khác.",
        tags: ["tech", "review", "unboxing", "smartphone", "gadgets"],
        isPublic: true,
      },
      {
        user: creatorUsers[3]._id,
        fullName: "Phạm Thị Hương",
        title: "Fitness & Health Content Creator",
        mainSkills: ["Fitness Training", "Health Content", "Motivational Speaking", "Video Editing"],
        experienceYears: 6,
        experienceDetail: "6 năm kinh nghiệm trong lĩnh vực fitness và health. Certified personal trainer, tạo nội dung về workout, nutrition và healthy lifestyle. 250K+ followers trên Instagram, YouTube 50K subscribers. Đã hợp tác với Nike, Adidas, các thương hiệu thể thao.",
        tags: ["fitness", "health", "workout", "nutrition", "motivation"],
        isPublic: true,
      },
      {
        user: creatorUsers[4]._id,
        fullName: "Võ Đức Thành",
        title: "Food Vlogger & Restaurant Reviewer",
        mainSkills: ["Food Photography", "Video Editing", "Restaurant Review", "Culinary Content"],
        experienceYears: 2,
        experienceDetail: "2 năm kinh nghiệm tạo nội dung về ẩm thực. Chuyên review nhà hàng, quán ăn và tạo recipe video. TikTok 80K followers, Instagram 60K followers. Đã hợp tác với các thương hiệu F&B như KFC, McDonald's, các nhà hàng địa phương.",
        tags: ["food", "restaurant", "review", "cooking", "vlog"],
        isPublic: true,
      },
      {
        user: creatorUsers[5]._id,
        fullName: "Đỗ Thị Mai",
        title: "Beauty Influencer & Makeup Artist",
        mainSkills: ["Makeup Artistry", "Beauty Content", "Product Review", "Tutorial Creation"],
        experienceYears: 4,
        experienceDetail: "4 năm kinh nghiệm trong lĩnh vực beauty. Professional makeup artist, tạo tutorial makeup, review mỹ phẩm và skincare. Instagram 180K followers, TikTok 150K followers. Đã hợp tác với L'Oréal, Maybelline, các thương hiệu mỹ phẩm hàng đầu.",
        tags: ["beauty", "makeup", "skincare", "tutorial", "review"],
        isPublic: true,
      },
      // Thêm CVs cho các Creator users còn lại
      {
        user: additionalCreatorUsers[0]._id, // creator9 - gaming_streamer
        fullName: "Nguyễn Văn Đức",
        title: "Gaming Streamer & Esports Content Creator",
        mainSkills: ["Gaming Content", "Live Streaming", "Esports Commentary", "Video Editing"],
        experienceYears: 3,
        experienceDetail: "3 năm kinh nghiệm streaming game và tạo nội dung esports. Chuyên về các tựa game MOBA, FPS và Battle Royale. Twitch 50K followers, YouTube 30K subscribers. Đã hợp tác với các thương hiệu gaming như Razer, Logitech, và các game publishers.",
        tags: ["gaming", "streaming", "esports", "twitch", "youtube"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[1]._id, // creator10 - music_producer
        fullName: "Trần Minh Tuấn",
        title: "Music Producer & Audio Content Creator",
        mainSkills: ["Music Production", "Audio Editing", "Sound Design", "Podcast Creation"],
        experienceYears: 5,
        experienceDetail: "5 năm kinh nghiệm trong lĩnh vực music production và audio content. Chuyên sản xuất nhạc nền, jingles và podcast. Spotify 20K monthly listeners, YouTube 15K subscribers. Đã hợp tác với các thương hiệu để tạo nhạc quảng cáo và audio branding.",
        tags: ["music", "production", "audio", "podcast", "sound"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[2]._id, // creator11 - fashion_stylist
        fullName: "Lê Thị Hoa",
        title: "Fashion Stylist & Style Content Creator",
        mainSkills: ["Fashion Styling", "Outfit Coordination", "Fashion Photography", "Trend Analysis"],
        experienceYears: 4,
        experienceDetail: "4 năm kinh nghiệm trong lĩnh vực fashion styling. Chuyên tạo nội dung về outfit ideas, fashion trends và style tips. Instagram 120K followers, TikTok 90K followers. Đã hợp tác với các thương hiệu thời trang như Zara, H&M, và các local brands.",
        tags: ["fashion", "styling", "outfit", "trends", "style"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[3]._id, // creator12 - pet_content
        fullName: "Phạm Văn Long",
        title: "Pet Content Creator & Animal Lover",
        mainSkills: ["Pet Photography", "Animal Content", "Pet Care Tips", "Video Editing"],
        experienceYears: 2,
        experienceDetail: "2 năm kinh nghiệm tạo nội dung về thú cưng. Chuyên về chó, mèo và các động vật nhỏ. Instagram 80K followers, TikTok 100K followers. Đã hợp tác với các thương hiệu pet food và pet care như Royal Canin, Pedigree.",
        tags: ["pet", "animal", "dog", "cat", "care"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[4]._id, // creator13 - comedy_creator
        fullName: "Võ Thị Lan",
        title: "Comedy Creator & Entertainment Content",
        mainSkills: ["Comedy Writing", "Sketch Creation", "Entertainment Content", "Video Production"],
        experienceYears: 3,
        experienceDetail: "3 năm kinh nghiệm tạo nội dung giải trí và hài kịch. Chuyên về sketch comedy, prank videos và entertainment content. TikTok 200K followers, YouTube 60K subscribers. Đã hợp tác với các thương hiệu để tạo nội dung quảng cáo vui nhộn và thu hút.",
        tags: ["comedy", "entertainment", "sketch", "funny", "viral"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[5]._id, // creator14 - education_content
        fullName: "Đỗ Văn Hùng",
        title: "Education Content Creator & Teacher",
        mainSkills: ["Educational Content", "Teaching", "Tutorial Creation", "Knowledge Sharing"],
        experienceYears: 6,
        experienceDetail: "6 năm kinh nghiệm trong lĩnh vực giáo dục. Chuyên tạo nội dung giáo dục về toán, lý, hóa và kỹ năng sống. YouTube 100K subscribers, TikTok 150K followers. Đã hợp tác với các nền tảng giáo dục và các thương hiệu sách giáo khoa.",
        tags: ["education", "teaching", "tutorial", "learning", "knowledge"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[6]._id, // creator15 - diy_crafts
        fullName: "Nguyễn Thị Hương",
        title: "DIY & Crafts Content Creator",
        mainSkills: ["DIY Projects", "Craft Making", "Tutorial Creation", "Creative Content"],
        experienceYears: 4,
        experienceDetail: "4 năm kinh nghiệm tạo nội dung về DIY và crafts. Chuyên về handmade, home decor và creative projects. Instagram 90K followers, YouTube 40K subscribers. Đã hợp tác với các thương hiệu craft supplies và home decor.",
        tags: ["diy", "crafts", "handmade", "creative", "tutorial"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[7]._id, // creator16 - travel_vlogger
        fullName: "Trần Văn Nam",
        title: "Travel Vlogger & Adventure Content Creator",
        mainSkills: ["Travel Vlogging", "Adventure Content", "Travel Photography", "Video Editing"],
        experienceYears: 5,
        experienceDetail: "5 năm kinh nghiệm tạo nội dung về du lịch và khám phá. Chuyên về travel vlog, adventure content và destination reviews. YouTube 150K subscribers, Instagram 200K followers. Đã hợp tác với các tourism boards, hotels và travel brands.",
        tags: ["travel", "vlog", "adventure", "exploration", "tourism"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[8]._id, // creator17 - sports_analyst
        fullName: "Lê Văn An",
        title: "Sports Analyst & Sports Content Creator",
        mainSkills: ["Sports Analysis", "Sports Commentary", "Sports Content", "Video Production"],
        experienceYears: 4,
        experienceDetail: "4 năm kinh nghiệm phân tích và tạo nội dung về thể thao. Chuyên về bóng đá, bóng rổ và các môn thể thao phổ biến. YouTube 80K subscribers, TikTok 120K followers. Đã hợp tác với các thương hiệu thể thao và sports media.",
        tags: ["sports", "analysis", "football", "basketball", "commentary"],
        isPublic: true,
      },
      {
        user: additionalCreatorUsers[9]._id, // creator18 - parenting_tips
        fullName: "Phạm Thị Mai",
        title: "Parenting Content Creator & Mom Blogger",
        mainSkills: ["Parenting Tips", "Family Content", "Childcare Advice", "Lifestyle Content"],
        experienceYears: 5,
        experienceDetail: "5 năm kinh nghiệm tạo nội dung về parenting và gia đình. Chuyên về tips chăm sóc trẻ, giáo dục con cái và family lifestyle. Instagram 150K followers, Facebook 100K followers. Đã hợp tác với các thương hiệu baby care, toys và family products.",
        tags: ["parenting", "family", "kids", "lifestyle", "tips"],
        isPublic: true,
      },
    ]);
    console.log(`✅ Đã tạo ${cvs.length} Creator CVs\n`);

    // ==================== APPLICATIONS ====================
    console.log("📝 Đang tạo Applications...");
    const applications = await Application.insertMany([
      {
        jobPost: jobPosts[0]._id,
        creator: creatorUsers[0]._id,
        cv: cvs[0]._id,
        status: "pending",
        message: "Tôi rất quan tâm đến chiến dịch này và có kinh nghiệm tạo nội dung về Tết. Mong được hợp tác!",
      },
      {
        jobPost: jobPosts[0]._id,
        creator: creatorUsers[1]._id,
        cv: cvs[1]._id,
        status: "approved",
        message: "Tôi đã có nhiều kinh nghiệm với các thương hiệu FMCG và rất muốn tham gia chiến dịch Tết 2025.",
        approvalMessage: "Chúng tôi rất vui được hợp tác với bạn! Vui lòng liên hệ: Email: marketing@cocacola.com.vn, SĐT: 0901234567. Chúng tôi sẽ gửi brief chi tiết trong tuần tới.",
      },
      {
        jobPost: jobPosts[2]._id,
        creator: creatorUsers[2]._id,
        cv: cvs[2]._id,
        status: "pending",
        message: "Tôi chuyên review công nghệ và rất muốn được review dòng Galaxy mới.",
      },
      {
        jobPost: jobPosts[3]._id,
        creator: creatorUsers[3]._id,
        cv: cvs[3]._id,
        status: "approved",
        message: "Tôi là fitness creator và rất phù hợp với dòng giày chạy bộ của Nike.",
        approvalMessage: "Chào mừng bạn đến với gia đình Nike! Liên hệ: Email: creator@nike.vn, SĐT: 0912345678. Chúng tôi sẽ gửi sản phẩm và brief trong 3 ngày tới.",
      },
      {
        jobPost: jobPosts[1]._id,
        creator: creatorUsers[4]._id,
        cv: cvs[4]._id,
        status: "rejected",
        message: "Tôi muốn tham gia chiến dịch Summer Campaign.",
        rejectionReason: "Cảm ơn bạn đã quan tâm. Tuy nhiên, chúng tôi đang tìm kiếm Creator có lượng followers lớn hơn (từ 50K) cho chiến dịch này. Mong được hợp tác trong các dự án phù hợp hơn trong tương lai.",
      },
    ]);
    
    // Thêm nhiều Applications hơn
    const additionalApplications = await Application.insertMany([
      {
        jobPost: allJobPosts[4]._id,
        creator: allCreatorUsers[6]._id,
        cv: cvs[0]._id,
        status: "pending",
        message: "Tôi rất quan tâm đến chiến dịch Adidas Originals và có kinh nghiệm với streetwear content.",
      },
      {
        jobPost: allJobPosts[5]._id,
        creator: allCreatorUsers[2]._id,
        cv: cvs[2]._id,
        status: "approved",
        message: "Tôi chuyên review công nghệ và rất muốn được review iPhone mới.",
        approvalMessage: "Chúng tôi rất vui được hợp tác! Vui lòng liên hệ: Email: creator@apple.com.vn, SĐT: 0909876543.",
      },
      {
        jobPost: allJobPosts[6]._id,
        creator: allCreatorUsers[4]._id,
        cv: cvs[4]._id,
        status: "pending",
        message: "Tôi là food vlogger và rất muốn hợp tác với McDonald's.",
      },
      {
        jobPost: allJobPosts[7]._id,
        creator: allCreatorUsers[0]._id,
        cv: cvs[0]._id,
        status: "approved",
        message: "Tôi có phong cách lifestyle phù hợp với Starbucks.",
        approvalMessage: "Chào mừng bạn! Liên hệ: Email: creator@starbucks.vn, SĐT: 0911111111.",
      },
      {
        jobPost: allJobPosts[8]._id,
        creator: allCreatorUsers[5]._id,
        cv: cvs[5]._id,
        status: "pending",
        message: "Tôi là beauty influencer và rất muốn hợp tác với Unilever.",
      },
      {
        jobPost: allJobPosts[9]._id,
        creator: allCreatorUsers[5]._id,
        cv: cvs[5]._id,
        status: "approved",
        message: "Tôi là makeup artist chuyên nghiệp và rất muốn hợp tác với L'Oréal.",
        approvalMessage: "Chúng tôi rất vui được hợp tác! Liên hệ: Email: creator@loreal.vn, SĐT: 0922222222.",
      },
      {
        jobPost: allJobPosts[10]._id,
        creator: allCreatorUsers[1]._id,
        cv: cvs[1]._id,
        status: "pending",
        message: "Tôi muốn tham gia chiến dịch Coca-Cola Zero.",
      },
      {
        jobPost: allJobPosts[11]._id,
        creator: allCreatorUsers[3]._id,
        cv: cvs[3]._id,
        status: "rejected",
        message: "Tôi muốn hợp tác với Pepsi Max.",
        rejectionReason: "Cảm ơn bạn đã quan tâm. Chúng tôi đang tìm kiếm Creator có lượng followers lớn hơn cho chiến dịch này.",
      },
      {
        jobPost: allJobPosts[12]._id,
        creator: allCreatorUsers[2]._id,
        cv: cvs[2]._id,
        status: "pending",
        message: "Tôi chuyên review công nghệ và muốn review Galaxy Watch.",
      },
      {
        jobPost: allJobPosts[13]._id,
        creator: allCreatorUsers[3]._id,
        cv: cvs[3]._id,
        status: "approved",
        message: "Tôi là fitness creator và rất phù hợp với Nike Air Max.",
        approvalMessage: "Chào mừng bạn! Liên hệ: Email: creator@nike.vn, SĐT: 0933333333.",
      },
      {
        jobPost: allJobPosts[14]._id,
        creator: allCreatorUsers[3]._id,
        cv: cvs[3]._id,
        status: "pending",
        message: "Tôi muốn hợp tác với Adidas Sportswear.",
      },
      {
        jobPost: allJobPosts[15]._id,
        creator: allCreatorUsers[2]._id,
        cv: cvs[2]._id,
        status: "pending",
        message: "Tôi muốn review iPad Pro.",
      },
      {
        jobPost: allJobPosts[16]._id,
        creator: allCreatorUsers[4]._id,
        cv: cvs[4]._id,
        status: "approved",
        message: "Tôi là food creator và muốn hợp tác với McDonald's Big Mac.",
        approvalMessage: "Chúng tôi rất vui được hợp tác! Liên hệ: Email: creator@mcdonalds.vn, SĐT: 0944444444.",
      },
      {
        jobPost: allJobPosts[17]._id,
        creator: allCreatorUsers[0]._id,
        cv: cvs[0]._id,
        status: "pending",
        message: "Tôi muốn hợp tác với Starbucks Reserve.",
      },
      {
        jobPost: allJobPosts[18]._id,
        creator: allCreatorUsers[5]._id,
        cv: cvs[5]._id,
        status: "pending",
        message: "Tôi muốn hợp tác với Dove.",
      },
      {
        jobPost: allJobPosts[19]._id,
        creator: allCreatorUsers[5]._id,
        cv: cvs[5]._id,
        status: "approved",
        message: "Tôi muốn hợp tác với Maybelline.",
        approvalMessage: "Chào mừng bạn! Liên hệ: Email: creator@maybelline.vn, SĐT: 0955555555.",
      },
    ]);
    
    const allApplications = [...applications, ...additionalApplications];
    console.log(`✅ Đã tạo ${allApplications.length} Applications (${applications.length} ban đầu + ${additionalApplications.length} thêm)\n`);

    // ==================== HOME - TOPICS ====================
    console.log("🎯 Đang tạo Topics...");
    const topics = await Topic.insertMany([
      {
        title: "Lifestyle & Travel",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
        description: "Khám phá những điểm đến tuyệt đẹp, chia sẻ trải nghiệm du lịch và phong cách sống hiện đại. Từ những thành phố sầm uất đến những vùng đất hoang sơ, chủ đề này mang đến góc nhìn đa chiều về cuộc sống và những hành trình đáng nhớ.",
        position: "left",
        isActive: true,
        order: 1,
      },
      {
        title: "Tech & Innovation",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        description: "Cập nhật những xu hướng công nghệ mới nhất, review sản phẩm công nghệ và khám phá những đổi mới trong lĩnh vực tech. Từ smartphone, laptop đến các thiết bị thông minh, chủ đề này giúp bạn luôn đi đầu trong thế giới công nghệ.",
        position: "center",
        isActive: true,
        order: 2,
      },
      {
        title: "Fitness & Health",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        description: "Chia sẻ kiến thức về sức khỏe, fitness và lối sống lành mạnh. Từ workout routines, nutrition tips đến những câu chuyện truyền cảm hứng về hành trình thay đổi bản thân. Chủ đề này giúp bạn xây dựng một cuộc sống khỏe mạnh và tích cực.",
        position: "right",
        isActive: true,
        order: 3,
      },
    ]);
    console.log(`✅ Đã tạo ${topics.length} Topics\n`);

    // ==================== HOME - TESTIMONIALS ====================
    console.log("💬 Đang tạo Testimonials...");
    const testimonials = await Testimonial.insertMany([
      {
        name: "Nguyễn Văn A",
        role: "CEO - TechStart Vietnam",
        content: "Nền tảng này đã giúp chúng tôi tìm được những Creator tài năng và phù hợp với thương hiệu. Quy trình hợp tác rất chuyên nghiệp và hiệu quả.",
        avatar: "https://i.pravatar.cc/150?img=68",
        isActive: true,
        order: 1,
      },
      {
        name: "Trần Thị B",
        role: "Marketing Director - Fashion Brand",
        content: "Là một Creator, tôi đã tìm được nhiều cơ hội hợp tác thú vị thông qua nền tảng này. Hệ thống rất dễ sử dụng và hỗ trợ tốt.",
        avatar: "https://i.pravatar.cc/150?img=47",
        isActive: true,
        order: 2,
      },
      {
        name: "Lê Văn C",
        role: "Content Creator - 200K followers",
        content: "Đây là nền tảng tốt nhất để kết nối với các thương hiệu. Tôi đã có nhiều hợp đồng giá trị và mối quan hệ hợp tác lâu dài.",
        avatar: "https://i.pravatar.cc/150?img=12",
        isActive: true,
        order: 3,
      },
    ]);
    console.log(`✅ Đã tạo ${testimonials.length} Testimonials\n`);

    // ==================== HOME - FOOTER ====================
    console.log("📄 Đang tạo Footer...");
    const footer = await Footer.create({
      description: "Nền tảng kết nối Creator và Brand hàng đầu Việt Nam. Tạo cơ hội hợp tác, phát triển sự nghiệp và xây dựng thương hiệu cá nhân.",
      supportPhone: "036.333.5981",
      officeLocation: "REVLIVE - 123 Đường ABC, Quận XYZ, TP.HCM",
      socialLinks: {
        facebook: "https://facebook.com/revlive",
        twitter: "https://twitter.com/revlive",
        instagram: "https://instagram.com/revlive",
      },
      footerLinks: [
        { label: "Về chúng tôi", url: "/about" },
        { label: "Điều khoản", url: "/terms" },
        { label: "Chính sách", url: "/privacy" },
        { label: "Liên hệ", url: "/contact" },
      ],
    });
    console.log(`✅ Đã tạo Footer\n`);

    // ==================== BLOG POSTS ====================
    console.log("📰 Đang tạo Blog posts...");
    const blogs = await Blog.insertMany([
      {
        title: "10 Tips để trở thành Creator thành công trong năm 2025",
        content: "Năm 2025 mang đến nhiều cơ hội mới cho các Creator. Trong bài viết này, chúng tôi sẽ chia sẻ 10 tips quan trọng để bạn có thể phát triển sự nghiệp Creator một cách hiệu quả...",
        excerpt: "Khám phá những bí quyết vàng để trở thành Creator thành công trong năm 2025",
        author: allCreatorUsers[0]._id,
        authorName: "Nguyễn Văn Minh",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        featured: true,
        category: "Tips & Tricks",
        tags: ["creator", "tips", "success", "2025"],
        views: 1250,
        isPublished: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Cách Brand và Creator hợp tác hiệu quả",
        content: "Hợp tác giữa Brand và Creator là một trong những xu hướng marketing quan trọng nhất hiện nay. Bài viết này sẽ hướng dẫn cách cả hai bên có thể làm việc cùng nhau một cách hiệu quả...",
        excerpt: "Hướng dẫn chi tiết về cách Brand và Creator có thể hợp tác thành công",
        author: allCreatorUsers[1]._id,
        authorName: "Trần Thị Linh",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        featured: true,
        category: "Collaboration",
        tags: ["brand", "creator", "collaboration", "marketing"],
        views: 980,
        isPublished: true,
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Xu hướng Content Creation năm 2025",
        content: "Năm 2025 chứng kiến sự phát triển mạnh mẽ của các xu hướng content creation mới. Từ AI-generated content đến short-form video, hãy cùng khám phá những xu hướng đang định hình ngành công nghiệp này...",
        excerpt: "Tổng hợp các xu hướng content creation nổi bật trong năm 2025",
        author: allCreatorUsers[2]._id,
        authorName: "Lê Hoàng Anh",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        featured: false,
        category: "Trends",
        tags: ["trends", "content", "2025", "ai"],
        views: 750,
        isPublished: true,
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Hướng dẫn tạo CV Creator chuyên nghiệp",
        content: "CV Creator là công cụ quan trọng để bạn giới thiệu bản thân với các Brand. Trong bài viết này, chúng tôi sẽ hướng dẫn bạn cách tạo một CV Creator chuyên nghiệp và thu hút...",
        excerpt: "Bí quyết tạo CV Creator ấn tượng và chuyên nghiệp",
        author: allCreatorUsers[3]._id,
        authorName: "Phạm Thị Hương",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
        featured: false,
        category: "Guide",
        tags: ["cv", "guide", "professional", "tips"],
        views: 650,
        isPublished: true,
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: "5 Lý do Brand nên hợp tác với Creator",
        content: "Hợp tác với Creator đang trở thành một phần không thể thiếu trong chiến lược marketing của các Brand. Hãy cùng khám phá 5 lý do tại sao Brand nên đầu tư vào Creator partnerships...",
        excerpt: "Tại sao Brand nên hợp tác với Creator trong chiến lược marketing",
        author: allCreatorUsers[1]._id,
        authorName: "Trần Thị Linh",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        featured: false,
        category: "Marketing",
        tags: ["brand", "marketing", "partnership", "creator"],
        views: 890,
        isPublished: true,
        publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Cách tính giá hợp lý cho Creator Content",
        content: "Định giá content là một trong những thách thức lớn nhất đối với Creator. Bài viết này sẽ giúp bạn hiểu cách tính giá hợp lý dựa trên các yếu tố như followers, engagement rate, và loại content...",
        excerpt: "Hướng dẫn chi tiết về cách định giá content cho Creator",
        author: allCreatorUsers[0]._id,
        authorName: "Nguyễn Văn Minh",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        featured: false,
        category: "Business",
        tags: ["pricing", "business", "creator", "money"],
        views: 1120,
        isPublished: true,
        publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Top 10 Creator Tools không thể thiếu",
        content: "Công cụ phù hợp có thể giúp Creator làm việc hiệu quả hơn. Dưới đây là danh sách 10 công cụ không thể thiếu cho mọi Creator, từ video editing đến analytics...",
        excerpt: "Danh sách các công cụ hữu ích nhất cho Creator",
        author: allCreatorUsers[2]._id,
        authorName: "Lê Hoàng Anh",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        featured: false,
        category: "Tools",
        tags: ["tools", "software", "productivity", "creator"],
        views: 540,
        isPublished: true,
        publishedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Case Study: Chiến dịch Creator Marketing thành công",
        content: "Khám phá một case study thực tế về chiến dịch creator marketing thành công. Chúng tôi sẽ phân tích chi tiết cách một Brand đã hợp tác với Creator để đạt được kết quả ấn tượng...",
        excerpt: "Phân tích chi tiết một chiến dịch creator marketing thành công",
        author: allCreatorUsers[5]._id,
        authorName: "Đỗ Thị Mai",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        featured: true,
        category: "Case Study",
        tags: ["case study", "success", "marketing", "campaign"],
        views: 1340,
        isPublished: true,
        publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Cách xây dựng Personal Brand cho Creator",
        content: "Personal brand là yếu tố quan trọng giúp Creator nổi bật trong thị trường cạnh tranh. Bài viết này sẽ hướng dẫn bạn cách xây dựng và phát triển personal brand một cách hiệu quả...",
        excerpt: "Hướng dẫn xây dựng personal brand cho Creator",
        author: allCreatorUsers[4]._id,
        authorName: "Võ Đức Thành",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
        featured: false,
        category: "Branding",
        tags: ["personal brand", "branding", "identity", "creator"],
        views: 720,
        isPublished: true,
        publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Tương lai của Creator Economy",
        content: "Creator Economy đang phát triển với tốc độ chóng mặt. Hãy cùng khám phá những xu hướng và dự đoán về tương lai của ngành công nghiệp này trong những năm tới...",
        excerpt: "Dự đoán về tương lai của Creator Economy",
        author: allCreatorUsers[0]._id,
        authorName: "Nguyễn Văn Minh",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
        featured: true,
        category: "Future",
        tags: ["future", "economy", "trends", "prediction"],
        views: 1560,
        isPublished: true,
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`✅ Đã tạo ${blogs.length} Blog posts\n`);

    // ==================== PAYMENT CONFIG ====================
    console.log("⚙️ Đang tạo Payment Config...");
    const paymentConfig = await PaymentConfig.create({
      qrCodeUrl: "", // Staff sẽ upload QR code sau
      bankName: "Vietcombank",
      accountNumber: "1234567890",
      accountName: "CÔNG TY TNHH REVLIVE",
    });
    console.log(`✅ Đã tạo Payment Config\n`);

    // ==================== TRANSACTIONS ====================
    console.log("💳 Đang tạo Transactions...");
    const now = new Date();
    
    // Helper function để tạo date với giờ cụ thể
    const createDate = (daysAgo, hours = 12, minutes = 0) => {
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const transactions = await Transaction.insertMany([
      // ========== HÔM NAY (completed) ==========
      {
        user: creatorUsers[0]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[0].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(0, 10, 30), // Hôm nay 10:30
        approvedAt: createDate(0, 10, 35),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: brandUsers[0]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${brandUsers[0].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(0, 14, 15), // Hôm nay 14:15
        approvedAt: createDate(0, 14, 20),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: creatorUsers[1]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[1].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(0, 16, 45), // Hôm nay 16:45
        approvedAt: createDate(0, 16, 50),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      
      // ========== HÔM QUA (completed) ==========
      {
        user: brandUsers[1]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${brandUsers[1].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(1, 9, 0), // Hôm qua 9:00
        approvedAt: createDate(1, 9, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: creatorUsers[3]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[3].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(1, 11, 30), // Hôm qua 11:30
        approvedAt: createDate(1, 11, 35),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: creatorUsers[5]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[5].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(1, 15, 20), // Hôm qua 15:20
        approvedAt: createDate(1, 15, 25),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      
      // ========== 2 NGÀY TRƯỚC ==========
      {
        user: brandUsers[3]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${brandUsers[3].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(2, 10, 0),
        approvedAt: createDate(2, 10, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: creatorUsers[0]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[0].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(2, 14, 30),
        approvedAt: createDate(2, 14, 35),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      
      // ========== 3 NGÀY TRƯỚC ==========
      {
        user: creatorUsers[1]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[1].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(3, 9, 15),
        approvedAt: createDate(3, 9, 20),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: brandUsers[0]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${brandUsers[0].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(3, 13, 45),
        approvedAt: createDate(3, 13, 50),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      
      // ========== 4 NGÀY TRƯỚC ==========
      {
        user: creatorUsers[3]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[3].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(4, 11, 0),
        approvedAt: createDate(4, 11, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      
      // ========== 5 NGÀY TRƯỚC ==========
      {
        user: brandUsers[1]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${brandUsers[1].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(5, 10, 30),
        approvedAt: createDate(5, 10, 35),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: creatorUsers[5]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[5].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(5, 16, 0),
        approvedAt: createDate(5, 16, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      
      // ========== 6 NGÀY TRƯỚC ==========
      {
        user: brandUsers[3]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${brandUsers[3].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(6, 9, 45),
        approvedAt: createDate(6, 9, 50),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      
      // ========== TRANSACTIONS PENDING (hôm nay và hôm qua) ==========
      {
        user: creatorUsers[2]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[2].username} Creator VIP 1`,
        status: "pending",
        qrCodeUrl: "",
        createdAt: createDate(0, 8, 0), // Hôm nay 8:00
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: brandUsers[2]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${brandUsers[2].username} Brand VIP 2`,
        status: "pending",
        qrCodeUrl: "",
        createdAt: createDate(0, 12, 30), // Hôm nay 12:30
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: creatorUsers[4]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[4].username} Creator VIP 1`,
        status: "pending",
        qrCodeUrl: "",
        createdAt: createDate(1, 17, 0), // Hôm qua 17:00
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      
      // ========== TRANSACTIONS CANCELLED (trong 30 ngày) ==========
      {
        user: creatorUsers[2]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[2].username} Creator VIP 1`,
        status: "cancelled",
        qrCodeUrl: "",
        cancelReason: "Người dùng yêu cầu hủy",
        createdAt: createDate(3, 15, 0),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: brandUsers[2]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${brandUsers[2].username} Brand VIP 2`,
        status: "cancelled",
        qrCodeUrl: "",
        cancelReason: "Không đủ thông tin thanh toán",
        createdAt: createDate(10, 10, 0),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: creatorUsers[4]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${creatorUsers[4].username} Creator VIP 1`,
        status: "cancelled",
        qrCodeUrl: "",
        cancelReason: "Người dùng không muốn tiếp tục",
        createdAt: createDate(15, 14, 0),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
    ]);
    
    // Thêm nhiều Transactions hơn từ các users mới
    const additionalTransactions = await Transaction.insertMany([
      // Transactions từ các creators mới
      {
        user: allCreatorUsers[6]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[6].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(1, 13, 0),
        approvedAt: createDate(1, 13, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allCreatorUsers[7]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[7].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(2, 10, 0),
        approvedAt: createDate(2, 10, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allCreatorUsers[8]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[8].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(3, 14, 0),
        approvedAt: createDate(3, 14, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allCreatorUsers[9]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[9].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(4, 9, 0),
        approvedAt: createDate(4, 9, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allCreatorUsers[10]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[10].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(5, 11, 0),
        approvedAt: createDate(5, 11, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allCreatorUsers[11]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[11].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(6, 15, 0),
        approvedAt: createDate(6, 15, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      // Transactions từ các brands mới
      {
        user: allBrandUsers[4]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${allBrandUsers[4].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(1, 16, 0),
        approvedAt: createDate(1, 16, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allBrandUsers[5]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${allBrandUsers[5].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(2, 14, 0),
        approvedAt: createDate(2, 14, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allBrandUsers[6]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${allBrandUsers[6].username} Brand VIP 2`,
        status: "pending",
        qrCodeUrl: "",
        createdAt: createDate(0, 9, 0),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allBrandUsers[7]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${allBrandUsers[7].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(3, 12, 0),
        approvedAt: createDate(3, 12, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allBrandUsers[8]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${allBrandUsers[8].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(4, 13, 0),
        approvedAt: createDate(4, 13, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allBrandUsers[9]._id,
        plan: "brand",
        amount: 199000,
        originalAmount: 299000,
        transferContent: `REVLIVE ${allBrandUsers[9].username} Brand VIP 2`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(5, 15, 0),
        approvedAt: createDate(5, 15, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      // Thêm một số transactions pending và cancelled
      {
        user: allCreatorUsers[12]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[12].username} Creator VIP 1`,
        status: "pending",
        qrCodeUrl: "",
        createdAt: createDate(0, 11, 0),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allCreatorUsers[13]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[13].username} Creator VIP 1`,
        status: "cancelled",
        qrCodeUrl: "",
        cancelReason: "Người dùng không muốn tiếp tục",
        createdAt: createDate(7, 10, 0),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
      {
        user: allCreatorUsers[14]._id,
        plan: "creator",
        amount: 99000,
        originalAmount: 199000,
        transferContent: `REVLIVE ${allCreatorUsers[14].username} Creator VIP 1`,
        status: "completed",
        qrCodeUrl: "",
        createdAt: createDate(1, 17, 0),
        approvedAt: createDate(1, 17, 5),
        beforeUpgrade: {
          memberType: "free",
          premiumExpiredAt: null,
        },
      },
    ]);
    
    const allTransactions = [...transactions, ...additionalTransactions];
    console.log(`✅ Đã tạo ${allTransactions.length} Transactions (${transactions.length} ban đầu + ${additionalTransactions.length} thêm)\n`);

    // ==================== TÓM TẮT ====================
    console.log("\n🎉 Seed tất cả dữ liệu thành công!\n");
    console.log("📊 TÓM TẮT:");
    console.log(`  🏠 HOME:`);
    console.log(`    - ${heroes.length} Hero`);
    console.log(`    - ${homeAgencies.length} Agencies`);
    console.log(`    - ${homeCreators.length} Creators`);
    console.log(`    - ${topics.length} Topics`);
    console.log(`    - ${testimonials.length} Testimonials`);
    console.log(`    - 1 Footer`);
    console.log(`  👤 USERS:`);
    console.log(`    - ${brandUsers.length} Brand users`);
    console.log(`    - ${creatorUsers.length} Creator users`);
    console.log(`  🏢 BRANDS:`);
    console.log(`    - ${brands.length} Brand profiles`);
    console.log(`    - ${brandCvs.length} Brand CVs`);
    console.log(`  📋 JOB POSTS:`);
    console.log(`    - ${jobPosts.length} JobPosts`);
    console.log(`  📄 CREATOR CVs:`);
    console.log(`    - ${cvs.length} Creator CVs`);
    console.log(`  📝 APPLICATIONS:`);
    console.log(`    - ${applications.length} Applications`);
    console.log(`  💳 PAYMENT:`);
    console.log(`    - 1 Payment Config`);
    console.log(`    - ${transactions.length} Transactions (${transactions.filter(t => t.status === "completed").length} completed, ${transactions.filter(t => t.status === "pending").length} pending, ${transactions.filter(t => t.status === "cancelled").length} cancelled)`);
    console.log(`\n🔑 THÔNG TIN ĐĂNG NHẬP BRAND:`);
    allBrandUsers.forEach((user, index) => {
      const brand = allBrands.find(b => b.user.toString() === user._id.toString());
      console.log(`  ${index + 1}. Email: ${user.email} | Password: Brand123! | Brand: ${brand?.companyName || "N/A"}`);
    });
    console.log(`\n🔑 THÔNG TIN ĐĂNG NHẬP CREATOR:`);
    allCreatorUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email} | Password: Creator123! | Username: ${user.username}`);
    });
    console.log("\n✨ Tất cả dữ liệu đã sẵn sàng để test!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
}

seedAll();
