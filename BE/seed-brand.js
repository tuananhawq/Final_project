import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Brand from "./src/models/Brand.js";
import JobPost from "./src/models/JobPost.js";
import Cv from "./src/models/Cv.js";

// 👉 fix cho ESM + Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 LOAD ĐÚNG FILE .env (ở thư mục BE)
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Connect DB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp_db";

async function seedBrand() {
  try {
    console.log("Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    // Hash password mặc định cho Brand users và Creator users
    const brandPassword = await bcrypt.hash("Brand123!", 10);
    const creatorPassword = await bcrypt.hash("Creator123!", 10);

    // Xóa dữ liệu cũ (optional - để tránh duplicate)
    console.log("Đang xóa dữ liệu cũ...");
    await JobPost.deleteMany({});
    await Brand.deleteMany({});
    await Cv.deleteMany({});
    await User.deleteMany({
      email: { 
        $in: [
          "brand1@revlive.com",
          "brand2@revlive.com",
          "brand3@revlive.com",
          "brand4@revlive.com",
          "creator1@revlive.com",
          "creator2@revlive.com",
          "creator3@revlive.com",
          "creator4@revlive.com",
          "creator5@revlive.com",
          "creator6@revlive.com"
        ] 
      }
    });
    console.log("✅ Đã xóa dữ liệu cũ (nếu có)");

    // Tạo Users có role brand
    console.log("Đang tạo Brand users...");
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
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/800px-Coca-Cola_logo.svg.png",
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
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/800px-Pepsi_logo_2014.svg.png",
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
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/800px-Samsung_Logo.svg.png",
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
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/800px-Logo_NIKE.svg.png",
      },
    ]);
    console.log(`✅ Đã tạo ${brandUsers.length} Brand users`);

    // Tạo Brand profiles
    console.log("Đang tạo Brand profiles...");
    const brands = await Brand.insertMany([
      {
        user: brandUsers[0]._id,
        companyName: "Coca-Cola Vietnam",
        description: "Thương hiệu nước giải khát hàng đầu thế giới, luôn tìm kiếm các Creator sáng tạo để quảng bá sản phẩm.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/800px-Coca-Cola_logo.svg.png",
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
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/800px-Pepsi_logo_2014.svg.png",
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
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/800px-Samsung_Logo.svg.png",
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
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/800px-Logo_NIKE.svg.png",
        website: "https://www.nike.com/vn",
        industry: "Thời trang - Thể thao",
        followers: "800K",
        isActive: true,
        order: 4,
      },
    ]);
    console.log(`✅ Đã tạo ${brands.length} Brand profiles`);

    // Tạo JobPosts (bài đăng tuyển dụng)
    console.log("Đang tạo JobPosts...");
    const jobPosts = await JobPost.insertMany([
      // Coca-Cola - 3 bài
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
        brand: brands[0]._id,
        brandName: brands[0].companyName,
        title: "Tuyển Video Creator cho YouTube Channel",
        jobType: "Video Creator",
        workTime: "Part-time, remote",
        content: "Cần Creator có kênh YouTube từ 20K subscribers để sản xuất series video về cuộc sống hàng ngày, tích hợp sản phẩm một cách tự nhiên. Mỗi video dài 8-12 phút.",
        budget: "25,000,000 - 40,000,000 VNĐ/video",
        requirements: "Kênh YouTube từ 20K subscribers, có khả năng quay và edit video chất lượng 1080p trở lên, có phong cách nội dung phù hợp với thương hiệu.",
        benefits: "Hợp đồng 6-12 tháng, hỗ trợ thiết bị quay phim, được đào tạo về brand guidelines, cơ hội xuất hiện trên các kênh truyền thông chính thức.",
        isActive: true,
      },
      // Pepsi - 2 bài
      {
        brand: brands[1]._id,
        brandName: brands[1].companyName,
        title: "Tuyển Creator cho chiến dịch Pepsi Challenge",
        jobType: "Content Creator",
        workTime: "Part-time",
        content: "Tìm kiếm Creator tham gia thử thách Pepsi Challenge trên TikTok. Tạo nội dung vui nhộn, sáng tạo về sản phẩm. Mỗi Creator sẽ đăng 3-5 video trong 1 tháng.",
        budget: "10,000,000 - 25,000,000 VNĐ/tháng",
        requirements: "Từ 15K followers trên TikTok, có khả năng tạo trend, engagement rate cao, phong cách nội dung phù hợp với giới trẻ.",
        benefits: "Tham gia giải thưởng lớn, được feature trên kênh chính thức, nhận sản phẩm và quà tặng độc quyền.",
        isActive: true,
      },
      {
        brand: brands[1]._id,
        brandName: brands[1].companyName,
        title: "Hợp tác với Micro-Influencer cho sản phẩm mới",
        jobType: "Micro-Influencer",
        workTime: "One-time project",
        content: "Ra mắt sản phẩm mới, cần các Micro-Influencer (5K-50K followers) để tạo buzz ban đầu. Mỗi Creator sẽ đăng 1 bài review và 2-3 stories.",
        budget: "5,000,000 - 15,000,000 VNĐ/bài",
        requirements: "Từ 5K followers, có niche phù hợp (food, lifestyle, entertainment), engagement rate tốt, có khả năng chụp ảnh đẹp.",
        benefits: "Nhận sản phẩm miễn phí, cơ hội hợp tác dài hạn, được hỗ trợ concept và hình ảnh từ brand.",
        isActive: true,
      },
      // Samsung - 3 bài
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
        brand: brands[2]._id,
        brandName: brands[2].companyName,
        title: "Tìm Creator cho chiến dịch Galaxy Watch",
        jobType: "Lifestyle Creator",
        workTime: "Part-time",
        content: "Tuyển Creator lifestyle/fitness để quảng bá Galaxy Watch. Tạo nội dung về sức khỏe, thể thao, và cuộc sống hàng ngày với smartwatch.",
        budget: "20,000,000 - 35,000,000 VNĐ/tháng",
        requirements: "Từ 20K followers, có nội dung về fitness, health, hoặc lifestyle, có khả năng tạo video vlog chất lượng.",
        benefits: "Nhận Galaxy Watch miễn phí, hợp đồng 3-6 tháng, được đào tạo về sản phẩm, cơ hội hợp tác với các thương hiệu thể thao khác.",
        isActive: true,
      },
      {
        brand: brands[2]._id,
        brandName: brands[2].companyName,
        title: "Tuyển Content Creator cho Samsung Store",
        jobType: "Content Creator",
        workTime: "Full-time hoặc Part-time",
        content: "Cần Creator để quay và chỉnh sửa video giới thiệu sản phẩm tại các cửa hàng Samsung Store. Tạo nội dung cho TikTok, Instagram, và Facebook.",
        budget: "15,000,000 - 25,000,000 VNĐ/tháng",
        requirements: "Có kinh nghiệm quay video tại cửa hàng, khả năng edit video nhanh, hiểu về sản phẩm điện tử, có portfolio về retail content.",
        benefits: "Làm việc tại môi trường chuyên nghiệp, được đào tạo về sản phẩm, cơ hội thăng tiến trong công ty.",
        isActive: true,
      },
      // Nike - 2 bài
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
      {
        brand: brands[3]._id,
        brandName: brands[3].companyName,
        title: "Tuyển Creator cho chiến dịch Just Do It",
        jobType: "Motivational Creator",
        workTime: "Part-time",
        content: "Chiến dịch truyền cảm hứng 'Just Do It'. Cần Creator có khả năng tạo nội dung động lực, kể câu chuyện về vượt qua thử thách, và truyền cảm hứng cho cộng đồng.",
        budget: "30,000,000 - 50,000,000 VNĐ/tháng",
        requirements: "Từ 30K followers, có phong cách nội dung truyền cảm hứng, có câu chuyện cá nhân về thể thao hoặc vượt qua khó khăn, khả năng storytelling tốt.",
        benefits: "Trở thành đại sứ thương hiệu, tham gia các chiến dịch quảng cáo lớn, được feature trên các kênh truyền thông quốc tế, nhận sản phẩm độc quyền.",
        isActive: true,
      },
    ]);
    console.log(`✅ Đã tạo ${jobPosts.length} JobPosts`);

    // Tạo Creator users
    console.log("Đang tạo Creator users...");
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
    console.log(`✅ Đã tạo ${creatorUsers.length} Creator users`);

    // Tạo CV cho Creator
    console.log("Đang tạo CV cho Creator...");
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
        experienceDetail: "5 năm kinh nghiệm trong lĩnh vực influencer marketing. Đã thực hiện hơn 50 chiến dịch cho các thương hiệu lớn. Chuyên về beauty, fashion và lifestyle. Có 150K+ followers trên Instagram và TikTok.",
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
        experienceDetail: "6 năm kinh nghiệm trong lĩnh vực fitness và health. Certified personal trainer, tạo nội dung về workout, nutrition và healthy lifestyle. 200K+ followers trên Instagram, YouTube 50K subscribers. Đã hợp tác với Nike, Adidas, các thương hiệu thể thao.",
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
    console.log(`✅ Đã tạo ${cvs.length} CV cho Creator`);

    console.log("\n🎉 Seed Brand thành công!");
    console.log("\n📊 Tóm tắt:");
    console.log(`  - ${brandUsers.length} Brand users đã được tạo`);
    console.log(`  - ${brands.length} Brand profiles đã được tạo`);
    console.log(`  - ${jobPosts.length} JobPosts đã được tạo`);
    console.log(`  - ${creatorUsers.length} Creator users đã được tạo`);
    console.log(`  - ${cvs.length} CV đã được tạo`);
    console.log("\n🔑 Thông tin đăng nhập Brand:");
    brandUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email} | Password: Brand123! | Brand: ${brands[index].companyName}`);
    });
    console.log("\n🔑 Thông tin đăng nhập Creator:");
    creatorUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email} | Password: Creator123! | Username: ${user.username}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
}

seedBrand();

