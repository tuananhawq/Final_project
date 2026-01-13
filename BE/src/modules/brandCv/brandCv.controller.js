import BrandCv from "../../models/BrandCv.js";

// Tất cả API dưới đây đều assume đã qua authGuard + roleGuard("brand")

export const createBrandCv = async (req, res) => {
  try {
    const { title, content, cvFileUrl, cvFileType } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "MISSING_REQUIRED_FIELDS", message: "Tiêu đề là bắt buộc" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "MISSING_REQUIRED_FIELDS", message: "Nội dung là bắt buộc" });
    }

    // Validate và chuẩn hóa cvFileType nếu có cvFileUrl
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

    // 🔥 Mỗi Brand chỉ có 1 CV: nếu đã có thì update, chưa có thì tạo mới
    const cv = await BrandCv.findOneAndUpdate(
      { owner: req.user.id },
      {
        owner: req.user.id,
        title: title.trim(),
        content: content.trim(),
        cvFileUrl: cvFileUrl || "",
        cvFileType: normalizedCvFileType,
      },
      {
        upsert: true, // Tạo mới nếu chưa có, update nếu đã có
        new: true, // Trả về document sau khi update
        runValidators: true, // Chạy validation
      }
    );

    return res.status(201).json({ cv });
  } catch (err) {
    console.error("createBrandCv error:", err);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      errors: err.errors
    });
    
    // Nếu lỗi do duplicate (không nên xảy ra với unique + upsert, nhưng để an toàn)
    if (err.code === 11000) {
      return res.status(400).json({ error: "BRAND_ALREADY_HAS_CV", message: "Brand đã có CV" });
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

export const getBrandCvs = async (req, res) => {
  try {
    // 🔥 Mỗi Brand chỉ có 1 CV, nên chỉ cần findOne
    const cv = await BrandCv.findOne({ owner: req.user.id }).lean();

    // Trả về dạng array để tương thích với frontend (hoặc có thể trả về object)
    return res.json({ cvs: cv ? [cv] : [] });
  } catch (err) {
    console.error("getBrandCvs error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

export const updateBrandCv = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, cvFileUrl, cvFileType } = req.body;

    const cv = await BrandCv.findOne({ _id: id, owner: req.user.id });
    if (!cv) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    if (title !== undefined) cv.title = title;
    if (content !== undefined) cv.content = content;
    if (cvFileUrl !== undefined) cv.cvFileUrl = cvFileUrl;
    if (cvFileType !== undefined) cv.cvFileType = cvFileType;
    await cv.save();

    return res.json({ cv });
  } catch (err) {
    console.error("updateBrandCv error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

export const deleteBrandCv = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await BrandCv.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteBrandCv error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};


