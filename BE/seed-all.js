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
        content: "Coca-Cola là thương hiệu nước giải khát hàng đầu thế giới với hơn 130 năm lịch sử. Chúng tôi cam kết mang đến những trải nghiệm tuyệt vời cho người tiêu dùng và tìm kiếm các đối tác Creator sáng tạo để lan tỏa thông điệp tích cực.",
        cvFileUrl: "",
        cvFileType: "",
      },
      {
        owner: brandUsers[1]._id,
        title: "PepsiCo Vietnam - Giới thiệu thương hiệu",
        content: "PepsiCo là tập đoàn đa quốc gia về thực phẩm và đồ uống, với danh mục sản phẩm đa dạng. Chúng tôi tìm kiếm các Creator để hợp tác trong các chiến dịch marketing sáng tạo và hiệu quả.",
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
    console.log(`✅ Đã tạo ${jobPosts.length} JobPosts\n`);

    // ==================== USERS - CREATOR ====================
    console.log("👤 Đang tạo Creator users...");
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
        avatar: "https://i.pravatar.cc/150?img=47",
      },
    ]);
    console.log(`✅ Đã tạo ${creatorUsers.length} Creator users\n`);

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
    console.log(`✅ Đã tạo ${applications.length} Applications\n`);

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
    console.log(`\n🔑 THÔNG TIN ĐĂNG NHẬP BRAND:`);
    brandUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email} | Password: Brand123! | Brand: ${brands[index].companyName}`);
    });
    console.log(`\n🔑 THÔNG TIN ĐĂNG NHẬP CREATOR:`);
    creatorUsers.forEach((user, index) => {
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
