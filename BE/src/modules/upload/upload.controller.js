import cloudinary from "../../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "avatars" }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "UPLOAD_FAILED" });
  }
};

// Upload ảnh CV cho Brand CV (chỉ chấp nhận hình ảnh)
export const uploadCvFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    // 🔥 CHỈ CHẤP NHẬN HÌNH ẢNH
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh (JPG, PNG, etc.)"
      });
    }

    // Upload ảnh lên Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "brand-cv",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      fileType: "image", // Luôn là image
    });
  } catch (err) {
    console.error("UPLOAD CV ERROR:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload file. Vui lòng thử lại."
    });
  }
};