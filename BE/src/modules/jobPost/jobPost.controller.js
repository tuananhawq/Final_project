import JobPost from "../../models/JobPost.js";
import Brand from "../../models/Brand.js";
import User from "../../models/User.js";
import Transaction from "../../models/Transaction.js";
import Notification from "../../models/Notification.js";

// ========== PUBLIC: NEWS FEED ==========

export const getPublicJobPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    const total = await JobPost.countDocuments(filter);

    const posts = await JobPost.find(filter)
      .populate("brand")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formatted = posts.map((p) => ({
      _id: p._id,
      brandName: p.brand?.companyName || p.brandName,
      title: p.title,
      jobType: p.jobType,
      workTime: p.workTime,
      budget: p.budget,
      createdAt: p.createdAt,
    }));

    return res.json({
      posts: formatted,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("getPublicJobPosts error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

export const getJobPostDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await JobPost.findById(id).populate("brand");

    if (!post || !post.isActive) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json({
      post: {
        _id: post._id,
        brandName: post.brand?.companyName || post.brandName,
        title: post.title,
        jobType: post.jobType,
        workTime: post.workTime,
        content: post.content,
        budget: post.budget,
        requirements: post.requirements,
        benefits: post.benefits,
        createdAt: post.createdAt,
      },
    });
  } catch (err) {
    console.error("getJobPostDetail error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// ========== BRAND: MY JOB POSTS ==========

const ensureBrandFromUser = async (userId) => {
  let brand = await Brand.findOne({ user: userId });
  
  // Nếu chưa có Brand profile, tự động tạo mặc định dựa trên thông tin User
  if (!brand) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    
    // Tạo Brand profile mặc định từ thông tin User
    brand = await Brand.create({
      user: userId,
      companyName: user.username || user.email?.split("@")[0] || "Brand mới",
      description: user.bio || `Brand profile của ${user.username || user.email}`,
      logo: user.avatar || "",
      website: "",
      industry: "",
      followers: "0",
      isActive: true,
      order: 0,
    });
  }
  
  // Đảm bảo brand đang active - REMOVED AUTO REACTIVATE
  // if (!brand.isActive) {
  //   brand.isActive = true;
  //   await brand.save();
  // }
  
  return brand;
};

export const createMyJobPost = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Kiểm tra brand đã đăng ký gói (199k hoặc 499k) chưa
    const transaction = await Transaction.findOne({
      user: userId,
      plan: "brand",
      status: "completed",
    });

    if (!transaction) {
      return res.status(403).json({
        error: "PACKAGE_REQUIRED",
        message: "Bạn cần đăng ký gói Brand (199,000 VNĐ hoặc 499,000 VNĐ) để đăng tin tuyển dụng",
      });
    }

    const brand = await ensureBrandFromUser(userId);

    // Check if locked
    if (brand.isActive === false) {
      return res.status(403).json({ error: "BRAND_LOCKED", message: "Tài khoản Brand của bạn đã bị khoá." });
    }

    const {
      title,
      jobType,
      workTime,
      content,
      budget,
      requirements,
      benefits,
    } = req.body;

    if (
      !title ||
      !jobType ||
      !workTime ||
      !content ||
      !budget ||
      !requirements ||
      !benefits
    ) {
      return res.status(400).json({ error: "MISSING_REQUIRED_FIELDS" });
    }

    const post = await JobPost.create({
      brand: brand._id,
      brandName: brand.companyName,
      title,
      jobType,
      workTime,
      content,
      budget,
      requirements,
      benefits,
    });

    return res.status(201).json({ post });
  } catch (err) {
    console.error("createMyJobPost error:", err);
    if (err.message === "BRAND_PROFILE_NOT_FOUND") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

export const getMyJobPosts = async (req, res) => {
  try {
    const brand = await ensureBrandFromUser(req.user.id);

    const posts = await JobPost.find({ brand: brand._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ posts });
  } catch (err) {
    console.error("getMyJobPosts error:", err);
    if (err.message === "BRAND_PROFILE_NOT_FOUND") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

export const updateMyJobPost = async (req, res) => {
  try {
    const brand = await ensureBrandFromUser(req.user.id);
    const { id } = req.params;

    const post = await JobPost.findOne({ _id: id, brand: brand._id });
    if (!post) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    const {
      title,
      jobType,
      workTime,
      content,
      budget,
      requirements,
      benefits,
      isActive,
    } = req.body;

    if (title !== undefined) post.title = title;
    if (jobType !== undefined) post.jobType = jobType;
    if (workTime !== undefined) post.workTime = workTime;
    if (content !== undefined) post.content = content;
    if (budget !== undefined) post.budget = budget;
    if (requirements !== undefined) post.requirements = requirements;
    if (benefits !== undefined) post.benefits = benefits;
    if (isActive !== undefined) post.isActive = isActive;

    await post.save();

    return res.json({ post });
  } catch (err) {
    console.error("updateMyJobPost error:", err);
    if (err.message === "BRAND_PROFILE_NOT_FOUND") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

export const deleteMyJobPost = async (req, res) => {
  try {
    const brand = await ensureBrandFromUser(req.user.id);
    const { id } = req.params;

    const post = await JobPost.findOneAndDelete({ _id: id, brand: brand._id });
    if (!post) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteMyJobPost error:", err);
    if (err.message === "BRAND_PROFILE_NOT_FOUND") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};



// ========== ADMIN/STAFF: MANAGEMENT ==========

// Get all job posts for admin/staff
export const adminGetJobPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20; // Admin list bigger
    const skip = (page - 1) * limit;

    const total = await JobPost.countDocuments({}); // All posts

    const posts = await JobPost.find({})
      .populate("brand") // To see warnings count and warning status
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (err) {
    console.error("adminGetJobPosts error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Warn Brand about a post
export const adminWarnBrandPost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "REASON_REQUIRED" });
    }

    const post = await JobPost.findById(id).populate("brand");
    if (!post) {
      return res.status(404).json({ error: "POST_NOT_FOUND" });
    }

    const brand = await Brand.findById(post.brand._id || post.brand);
    if (!brand) {
      return res.status(404).json({ error: "BRAND_NOT_FOUND" });
    }

    // Increment warnings
    brand.warnings = (brand.warnings || 0) + 1;
    
    // Check if limit exceeded > 3
    let accountLocked = false;
    if (brand.warnings > 3) {
      brand.isActive = false; // Lock Brand
      accountLocked = true;
    }

    await brand.save();

    // Create Notification
    await Notification.create({
      recipient: brand.user, // Brand has 'user' field ref User
      type: "warning",
      title: "Vi phạm nội dung bài đăng",
      message: `Bài đăng "${post.title}" của bạn bị cảnh báo. Lý do: ${reason}. (Cảnh báo ${brand.warnings}/3)`,
      metadata: { jobId: post._id, warnings: brand.warnings }
    });

    if (accountLocked) {
       await Notification.create({
        recipient: brand.user,
        type: "error",
        title: "Tài khoản bị khoá",
        message: "Tài khoản Brand của bạn đã bị khoá do vi phạm quá 3 lần.",
        metadata: { warnings: brand.warnings }
      });
    }

    return res.json({ 
      success: true, 
      warnings: brand.warnings, 
      isLocked: accountLocked,
      message: accountLocked ? "Brand has been locked due to excessive warnings." : "Warning sent."
    });

  } catch (err) {
    console.error("adminWarnBrandPost error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Admin delete post
export const adminDeleteJobPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await JobPost.findByIdAndDelete(id);
    
    if (!post) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json({ success: true, message: "Post deleted by admin." });
  } catch (err) {
    console.error("adminDeleteJobPost error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};
