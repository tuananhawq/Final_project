import Cv from "../../models/Cv.js";

// Tất cả API dưới đây đều assume đã qua authGuard + roleGuard("creator")

// Tạo hoặc cập nhật CV của Creator (mỗi Creator chỉ có 1 CV)
export const createCreatorCv = async (req, res) => {
  try {
    const { fullName, title, mainSkills, experienceYears, experienceDetail, tags, isPublic, cvFileUrl, cvFileType } = req.body;

    if (!fullName || !title) {
      return res.status(400).json({ error: "MISSING_REQUIRED_FIELDS" });
    }

    // 🔥 Mỗi Creator chỉ có 1 CV: nếu đã có thì update, chưa có thì tạo mới
    const cv = await Cv.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        fullName,
        title,
        mainSkills: mainSkills || [],
        experienceYears: experienceYears || 0,
        experienceDetail: experienceDetail || "",
        tags: tags || [],
        isPublic: isPublic !== undefined ? isPublic : true,
        cvFileUrl: cvFileUrl || "",
        cvFileType: cvFileType || "",
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
    if (err.code === 11000) {
      return res.status(400).json({ error: "CREATOR_ALREADY_HAS_CV" });
    }
    return res.status(500).json({ error: "SERVER_ERROR" });
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

