import Application from "../../models/Application.js";
import JobPost from "../../models/JobPost.js";
import Cv from "../../models/Cv.js";
import User from "../../models/User.js";
import Brand from "../../models/Brand.js";

// Creator ứng tuyển vào JobPost
export const createApplication = async (req, res) => {
  try {
    const { jobPostId, message } = req.body;
    const creatorId = req.user.id;

    if (!jobPostId) {
      return res.status(400).json({ error: "MISSING_JOB_POST_ID" });
    }

    // Kiểm tra JobPost có tồn tại và đang active không
    const jobPost = await JobPost.findById(jobPostId);
    if (!jobPost || !jobPost.isActive) {
      return res.status(404).json({ error: "JOB_POST_NOT_FOUND" });
    }

    // Kiểm tra đã ứng tuyển chưa
    const existing = await Application.findOne({
      jobPost: jobPostId,
      creator: creatorId,
    });

    if (existing) {
      return res.status(400).json({ error: "ALREADY_APPLIED" });
    }

    // Tìm CV của Creator (nếu có)
    const creatorCv = await Cv.findOne({ user: creatorId });

    // Tạo application
    const application = await Application.create({
      jobPost: jobPostId,
      creator: creatorId,
      cv: creatorCv?._id || null,
      message: message || "",
      status: "pending",
    });

    return res.status(201).json({ application });
  } catch (err) {
    console.error("createApplication error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "ALREADY_APPLIED" });
    }
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Creator xem danh sách đã ứng tuyển
export const getCreatorApplications = async (req, res) => {
  try {
    const creatorId = req.user.id;

    const applications = await Application.find({ creator: creatorId })
      .populate({
        path: "jobPost",
        populate: { path: "brand", select: "companyName logo" },
      })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = applications.map((app) => ({
      _id: app._id,
      jobPost: {
        _id: app.jobPost._id,
        title: app.jobPost.title,
        brandName: app.jobPost.brandName,
        jobType: app.jobPost.jobType,
        budget: app.jobPost.budget,
        workTime: app.jobPost.workTime,
        logo: app.jobPost.brand?.logo || "",
      },
      status: app.status,
      message: app.message,
      approvalMessage: app.approvalMessage || "",
      rejectionReason: app.rejectionReason || "",
      createdAt: app.createdAt,
    }));

    return res.json({ applications: formatted });
  } catch (err) {
    console.error("getCreatorApplications error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Brand xem danh sách ứng viên của 1 JobPost
export const getJobPostApplications = async (req, res) => {
  try {
    const { id } = req.params;
    const brandId = req.user.id;

    // Tìm Brand profile
    const brand = await Brand.findOne({ user: brandId });
    if (!brand) {
      return res.status(404).json({ error: "BRAND_PROFILE_NOT_FOUND" });
    }

    // Kiểm tra JobPost thuộc về Brand này
    const jobPost = await JobPost.findById(id);
    if (!jobPost || jobPost.brand.toString() !== brand._id.toString()) {
      return res.status(403).json({ error: "FORBIDDEN" });
    }

    // Lấy danh sách applications
    const applications = await Application.find({ jobPost: id })
      .populate({
        path: "creator",
        select: "username email avatar",
      })
      .populate({
        path: "cv",
      })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = applications.map((app) => ({
      _id: app._id,
      creator: {
        _id: app.creator._id,
        username: app.creator.username,
        email: app.creator.email,
        avatar: app.creator.avatar,
      },
      cv: app.cv
        ? {
            _id: app.cv._id,
            fullName: app.cv.fullName,
            title: app.cv.title,
            mainSkills: app.cv.mainSkills || [],
            experienceYears: app.cv.experienceYears || 0,
            experienceDetail: app.cv.experienceDetail || "",
            tags: app.cv.tags || [],
            cvFileUrl: app.cv.cvFileUrl || "",
            cvFileType: app.cv.cvFileType || "",
          }
        : null,
      status: app.status,
      message: app.message,
      approvalMessage: app.approvalMessage || "",
      rejectionReason: app.rejectionReason || "",
      createdAt: app.createdAt,
    }));

    return res.json({ applications: formatted });
  } catch (err) {
    console.error("getJobPostApplications error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Brand phê duyệt/từ chối ứng viên
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id, applicationId } = req.params;
    const { status, approvalMessage, rejectionReason } = req.body;
    const brandId = req.user.id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "INVALID_STATUS" });
    }

    // Tìm Brand profile
    const brand = await Brand.findOne({ user: brandId });
    if (!brand) {
      return res.status(404).json({ error: "BRAND_PROFILE_NOT_FOUND" });
    }

    // Kiểm tra JobPost thuộc về Brand này
    const jobPost = await JobPost.findById(id);
    if (!jobPost || jobPost.brand.toString() !== brand._id.toString()) {
      return res.status(403).json({ error: "FORBIDDEN" });
    }

    // Chuẩn bị update data
    const updateData = { status };
    if (status === "approved" && approvalMessage) {
      updateData.approvalMessage = approvalMessage;
      updateData.rejectionReason = ""; // Clear rejection reason nếu approve
    } else if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
      updateData.approvalMessage = ""; // Clear approval message nếu reject
    }

    // Cập nhật status và message
    const application = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        jobPost: id,
      },
      updateData,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "APPLICATION_NOT_FOUND" });
    }

    return res.json({ application });
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

