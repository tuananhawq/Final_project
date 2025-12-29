// BE/src/modules/brand/brand.controller.js
import Brand from "../../models/Brand.js";

// Lấy danh sách Brand nổi bật
export const getFeaturedBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true })
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
      username: b.user?.username
    }));

    res.json({ brands: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Lấy chi tiết Brand
export const getBrandDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id)
      .populate("user", "username email");

    if (!brand || !brand.isActive) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    res.json({ brand });
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};