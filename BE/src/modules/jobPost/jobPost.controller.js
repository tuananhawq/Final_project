import JobPost from "../../models/JobPost.js";
import Brand from "../../models/Brand.js";

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
  const brand = await Brand.findOne({ user: userId, isActive: true });
  if (!brand) {
    throw new Error("BRAND_PROFILE_NOT_FOUND");
  }
  return brand;
};

export const createMyJobPost = async (req, res) => {
  try {
    const brand = await ensureBrandFromUser(req.user.id);

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


