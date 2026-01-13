import Cv from "../../models/Cv.js";

// Tất cả API dưới đây đều assume đã qua authGuard + roleGuard("creator")

// Tạo hoặc cập nhật CV của Creator (mỗi Creator chỉ có 1 CV)
export const createCreatorCv = async (req, res) => {
  try {
    const { fullName, title, mainSkills, experienceYears, experienceDetail, tags, isPublic, cvFileUrl, cvFileType } = req.body;

    // Validate required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "MISSING_REQUIRED_FIELDS", message: "Họ tên là bắt buộc" });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "MISSING_REQUIRED_FIELDS", message: "Tiêu đề CV là bắt buộc" });
    }

    // Validate và chuẩn hóa dữ liệu
    const normalizedMainSkills = Array.isArray(mainSkills) 
      ? mainSkills.filter(s => s && s.trim()).map(s => s.trim())
      : [];
    
    const normalizedTags = Array.isArray(tags)
      ? tags.filter(t => t && t.trim()).map(t => t.trim())
      : [];

    const normalizedExperienceYears = experienceYears 
      ? (typeof experienceYears === 'number' ? experienceYears : parseInt(experienceYears) || 0)
      : 0;

    // Validate cvFileType nếu có cvFileUrl
    let normalizedCvFileType = cvFileType || "";
    if (cvFileUrl && !normalizedCvFileType) {
      // Tự động detect file type từ URL
      if (cvFileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        normalizedCvFileType = "image";
      } else if (cvFileUrl.match(/\.pdf$/i)) {
        normalizedCvFileType = "pdf";
      } else {
        normalizedCvFileType = "other";
      }
    }

    // 🔥 Mỗi Creator chỉ có 1 CV: nếu đã có thì update, chưa có thì tạo mới
    const cv = await Cv.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        fullName: fullName.trim(),
        title: title.trim(),
        mainSkills: normalizedMainSkills,
        experienceYears: normalizedExperienceYears,
        experienceDetail: experienceDetail ? experienceDetail.trim() : "",
        tags: normalizedTags,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
        cvFileUrl: cvFileUrl || "",
        cvFileType: normalizedCvFileType,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return res.status(201).json({ cv });
  } catch (err) {
    console.error("createCreatorCv error:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      errors: err.errors
    });
    
    if (err.code === 11000) {
      return res.status(400).json({ error: "CREATOR_ALREADY_HAS_CV", message: "Creator đã có CV" });
    }
    
    // Validation errors từ Mongoose
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ 
        error: "VALIDATION_ERROR", 
        message: `Lỗi validation: ${validationErrors}` 
      });
    }
    
    return res.status(500).json({ 
      error: "SERVER_ERROR", 
      message: err.message || "Có lỗi xảy ra khi tạo CV" 
    });
  }
};

// Lấy CV của Creator hiện tại
export const getCreatorCv = async (req, res) => {
  try {
    const cv = await Cv.findOne({ user: req.user.id }).lean();

    return res.json({ cv: cv || null });
  } catch (err) {
    console.error("getCreatorCv error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Cập nhật CV của Creator
export const updateCreatorCv = async (req, res) => {
  try {
    const { fullName, title, mainSkills, experienceYears, experienceDetail, tags, isPublic, cvFileUrl, cvFileType } = req.body;

    const cv = await Cv.findOne({ user: req.user.id });
    if (!cv) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    if (fullName !== undefined) cv.fullName = fullName;
    if (title !== undefined) cv.title = title;
    if (mainSkills !== undefined) cv.mainSkills = mainSkills;
    if (experienceYears !== undefined) cv.experienceYears = experienceYears;
    if (experienceDetail !== undefined) cv.experienceDetail = experienceDetail;
    if (tags !== undefined) cv.tags = tags;
    if (isPublic !== undefined) cv.isPublic = isPublic;
    if (cvFileUrl !== undefined) cv.cvFileUrl = cvFileUrl;
    if (cvFileType !== undefined) cv.cvFileType = cvFileType;

    await cv.save();

    return res.json({ cv });
  } catch (err) {
    console.error("updateCreatorCv error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Xóa CV của Creator
export const deleteCreatorCv = async (req, res) => {
  try {
    const deleted = await Cv.findOneAndDelete({ user: req.user.id });

    if (!deleted) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteCreatorCv error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

