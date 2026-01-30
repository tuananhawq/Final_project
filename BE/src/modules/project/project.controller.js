import Project from "../../models/Project.js";
import Brand from "../../models/Brand.js";
import User from "../../models/User.js";
import Transaction from "../../models/Transaction.js";

// Kiểm tra brand có gói premium (499k) không
const checkBrandProjectPackage = async (userId) => {
  // Tìm transaction với plan = "brand", amount >= 499000 và status = "completed"
  const transaction = await Transaction.findOne({
    user: userId,
    plan: "brand",
    amount: { $gte: 499000 },
    status: "completed",
  });

  return !!transaction;
};

// ========== BRAND: TẠO DỰ ÁN ==========
export const createProject = async (req, res) => {
  try {
    const userId = req.user.id;

    // Kiểm tra brand có gói 499k không
    const hasPackage = await checkBrandProjectPackage(userId);
    if (!hasPackage) {
      return res.status(403).json({
        error: "PACKAGE_REQUIRED",
        message: "Bạn cần đăng ký gói 499,000 VNĐ để đăng dự án",
      });
    }

    // Tìm brand của user
    let brand = await Brand.findOne({ user: userId });
    if (!brand) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
      }
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

    const {
      title,
      description,
      content,
      images,
      category,
      budget,
      deadline,
    } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ error: "MISSING_REQUIRED_FIELDS" });
    }

    const project = await Project.create({
      brand: brand._id,
      brandName: brand.companyName,
      title,
      description,
      content,
      images: images || [],
      category: category || "",
      budget: budget || "",
      deadline: deadline || null,
      status: "pending",
    });

    return res.status(201).json({ project });
  } catch (err) {
    console.error("createProject error:", err);
    return res.status(500).json({ error: "SERVER_ERROR", message: err.message });
  }
};

// ========== BRAND: LẤY DANH SÁCH DỰ ÁN CỦA MÌNH ==========
export const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const brand = await Brand.findOne({ user: userId });

    if (!brand) {
      return res.json({ projects: [] });
    }

    const projects = await Project.find({ brand: brand._id })
      .populate("approvedBy", "username email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ projects });
  } catch (err) {
    console.error("getMyProjects error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// ========== BRAND: CẬP NHẬT DỰ ÁN CỦA MÌNH ==========
export const updateMyProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const brand = await Brand.findOne({ user: userId });

    if (!brand) {
      return res.status(404).json({ error: "BRAND_NOT_FOUND" });
    }

    const project = await Project.findOne({ _id: id, brand: brand._id });
    if (!project) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    // Chỉ cho phép cập nhật khi chưa được duyệt hoặc bị từ chối
    if (project.status === "approved") {
      return res.status(400).json({
        error: "CANNOT_UPDATE",
        message: "Không thể cập nhật dự án đã được duyệt",
      });
    }

    const {
      title,
      description,
      content,
      images,
      category,
      budget,
      deadline,
    } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (content !== undefined) project.content = content;
    if (images !== undefined) project.images = images;
    if (category !== undefined) project.category = category;
    if (budget !== undefined) project.budget = budget;
    if (deadline !== undefined) project.deadline = deadline;

    // Reset status về pending nếu đang rejected
    if (project.status === "rejected") {
      project.status = "pending";
      project.rejectedReason = "";
    }

    await project.save();

    return res.json({ project });
  } catch (err) {
    console.error("updateMyProject error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// ========== BRAND: XÓA DỰ ÁN CỦA MÌNH ==========
export const deleteMyProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const brand = await Brand.findOne({ user: userId });

    if (!brand) {
      return res.status(404).json({ error: "BRAND_NOT_FOUND" });
    }

    const project = await Project.findOneAndDelete({ _id: id, brand: brand._id });
    if (!project) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteMyProject error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// ========== PUBLIC: LẤY DANH SÁCH DỰ ÁN ĐÃ DUYỆT ==========
export const getPublicProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { status: "approved", isPublished: true };

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate("brand", "companyName logo")
      .sort({ approvedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({
      projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("getPublicProjects error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// ========== PUBLIC: LẤY CHI TIẾT DỰ ÁN ==========
export const getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("brand", "companyName logo description")
      .populate("approvedBy", "username email");

    if (!project || project.status !== "approved" || !project.isPublished) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json({ project });
  } catch (err) {
    console.error("getProjectDetail error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// ========== STAFF: LẤY TẤT CẢ DỰ ÁN (CHỜ DUYỆT) ==========
export const getAllProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const projects = await Project.find(filter)
      .populate("brand", "companyName logo")
      .populate("approvedBy", "username email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ projects });
  } catch (err) {
    console.error("getAllProjects error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// ========== STAFF: DUYỆT DỰ ÁN ==========
export const approveProject = async (req, res) => {
  try {
    const { id } = req.params;
    const staffId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    if (project.status !== "pending") {
      return res.status(400).json({
        error: "INVALID_STATUS",
        message: "Chỉ có thể duyệt dự án đang chờ xử lý",
      });
    }

    project.status = "approved";
    project.approvedBy = staffId;
    project.approvedAt = new Date();
    project.isPublished = true;
    await project.save();

    return res.json({
      message: "Duyệt dự án thành công",
      project,
    });
  } catch (err) {
    console.error("approveProject error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// ========== STAFF: TỪ CHỐI DỰ ÁN ==========
export const rejectProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const staffId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    if (project.status !== "pending") {
      return res.status(400).json({
        error: "INVALID_STATUS",
        message: "Chỉ có thể từ chối dự án đang chờ xử lý",
      });
    }

    project.status = "rejected";
    project.approvedBy = staffId;
    project.approvedAt = new Date();
    project.rejectedReason = reason || "Không đáp ứng yêu cầu";
    project.isPublished = false;
    await project.save();

    return res.json({
      message: "Từ chối dự án thành công",
      project,
    });
  } catch (err) {
    console.error("rejectProject error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};
