// BE/src/modules/brand/brand.controller.js
import Brand from "../../models/Brand.js";

// Lấy danh sách Brand - hiển thị TẤT CẢ brands (không filter isActive)
export const getFeaturedBrands = async (req, res) => {
  try {
    // Lấy TẤT CẢ brands, không filter isActive để hiển thị tất cả
    const brands = await Brand.find({})
      .populate("user", "username email roles")
      .sort({ order: 1, createdAt: -1 });

    const formatted = brands.map(b => ({
      _id: b._id,
      companyName: b.companyName,
      description: b.description,
      logo: b.logo,
      website: b.website,
      industry: b.industry,
      followers: b.followers,
      username: b.user?.username,
      isActive: b.isActive // Thêm field isActive để frontend có thể filter nếu cần
    }));

    res.json({ brands: formatted });
  } catch (err) {
    console.error("getFeaturedBrands error:", err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Lấy chi tiết Brand - hiển thị TẤT CẢ brands (không filter isActive)
export const getBrandDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id)
      .populate("user", "username email");

    if (!brand) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    res.json({ brand });
  } catch (err) {
    console.error("getBrandDetail error:", err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};