// BE/src/modules/brand/brand.controller.js
import mongoose from "mongoose";
import Brand from "../../models/Brand.js";
import User from "../../models/User.js";

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
    
    // Kiểm tra xem id có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }
    
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

// ========== BRAND PROFILE MANAGEMENT ==========

// Lấy brand profile của user hiện tại
export const getMyBrandProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let brand = await Brand.findOne({ user: userId })
      .populate("user", "username email avatar bio");
    
    // Nếu chưa có, tạo mặc định
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
      
      await brand.populate("user", "username email avatar bio");
    }
    
    res.json({ brand });
  } catch (err) {
    console.error("getMyBrandProfile error:", err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Tạo hoặc cập nhật brand profile
export const createOrUpdateBrandProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      companyName,
      description,
      logo,
      website,
      industry,
      followers,
    } = req.body;
    
    // Validate required fields
    if (!companyName || !companyName.trim()) {
      return res.status(400).json({ 
        error: "MISSING_REQUIRED_FIELDS", 
        message: "Tên công ty là bắt buộc" 
      });
    }
    
    if (!description || !description.trim()) {
      return res.status(400).json({ 
        error: "MISSING_REQUIRED_FIELDS", 
        message: "Mô tả là bắt buộc" 
      });
    }
    
    // Tìm brand profile hiện tại hoặc tạo mới
    const brand = await Brand.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        companyName: companyName.trim(),
        description: description.trim(),
        logo: logo || "",
        website: website || "",
        industry: industry || "",
        followers: followers || "0",
        isActive: true,
      },
      {
        upsert: true, // Tạo mới nếu chưa có, update nếu đã có
        new: true, // Trả về document sau khi update
        runValidators: true, // Chạy validation
      }
    ).populate("user", "username email avatar bio");
    
    res.status(201).json({ brand });
  } catch (err) {
    console.error("createOrUpdateBrandProfile error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        error: "VALIDATION_ERROR", 
        message: err.message 
      });
    }
    res.status(500).json({ error: "SERVER_ERROR" });
  }
};