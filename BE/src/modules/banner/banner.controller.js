// BE/src/modules/banner/banner.controller.js
import Banner from "../../models/Banner.js";
import cloudinary from "../../config/cloudinary.js";

// GET tất cả banner đang active, sắp xếp theo order
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select("title slug image description");

    res.json({ banners });
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};
// Lấy 1 banner chi tiết theo slug hoặc id
export const getBannerDetail = async (req, res) => {
  try {
    const { id } = req.params; // đổi tên param thành id

    const banner = await Banner.findById(id)
  .select("title image description likes comments isActive");


    if (!banner || !banner.isActive) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    res.json({ banner });
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};
// POST - Tạo banner mới (dành cho admin sau này)
export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_IMAGE" });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "MISSING_FIELDS" });
    }

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "banners" }
    );

    const banner = await Banner.create({
      title,
      description,
      image: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({ banner });
  } catch (err) {
    console.error("CREATE BANNER ERROR:", err);
    res.status(500).json({ error: "CREATE_FAILED" });
  }
};