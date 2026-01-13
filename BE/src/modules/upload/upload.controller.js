import cloudinary from "../../config/cloudinary.js";

// ==================== IMAGE MANAGEMENT ====================

// List tất cả images từ Cloudinary
export const getAllImages = async (req, res) => {
  try {
    const { folder, maxResults = 500 } = req.query;
    const limit = parseInt(maxResults);
    
    let allResources = [];
    let nextCursor = null;
    
    do {
      const options = {
        type: "upload",
        resource_type: "image",
        max_results: Math.min(500, limit - allResources.length),
      };
      
      if (folder) {
        options.prefix = folder;
      }
      
      if (nextCursor) {
        options.next_cursor = nextCursor;
      }

      const result = await cloudinary.api.resources(options);
      allResources = allResources.concat(result.resources || []);
      nextCursor = result.next_cursor;
      
      // Dừng nếu đã đủ số lượng hoặc không còn cursor
      if (allResources.length >= limit || !nextCursor) {
        break;
      }
    } while (allResources.length < limit);

    // Giới hạn số lượng theo maxResults
    const limitedResources = allResources.slice(0, limit);

    const images = limitedResources.map((resource) => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      folder: resource.folder || "",
      filename: resource.filename || resource.public_id.split("/").pop(),
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      createdAt: resource.created_at,
    }));

    res.json({
      images,
      total: allResources.length, // Tổng số thực tế (có thể nhiều hơn limit)
    });
  } catch (err) {
    console.error("GET ALL IMAGES ERROR:", err);
    res.status(500).json({ 
      error: "FETCH_FAILED",
      message: err.message || "Không thể lấy danh sách hình ảnh."
    });
  }
};

// Xóa image từ Cloudinary
export const deleteImage = async (req, res) => {
  try {
    // Lấy publicId từ query parameter thay vì path parameter
    // Để tránh vấn đề với ký tự đặc biệt như "/"
    const { publicId } = req.query;
    
    if (!publicId) {
      return res.status(400).json({ 
        error: "MISSING_PUBLIC_ID",
        message: "publicId là bắt buộc. Sử dụng query parameter: ?publicId=..."
      });
    }

    console.log("Deleting image with publicId:", publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    console.log("Cloudinary delete result:", result);

    if (result.result === "not found") {
      return res.status(404).json({ 
        error: "IMAGE_NOT_FOUND",
        message: "Không tìm thấy hình ảnh với publicId: " + publicId
      });
    }

    res.json({
      message: "Xóa hình ảnh thành công",
      result: result.result,
    });
  } catch (err) {
    console.error("DELETE IMAGE ERROR:", err);
    res.status(500).json({ 
      error: "DELETE_FAILED",
      message: err.message || "Không thể xóa hình ảnh."
    });
  }
};

// Lấy thống kê images theo folder
export const getImageStats = async (req, res) => {
  try {
    const folders = [
      "avatars",
      "brand-cv",
      "banners",
      "home/heroes",
      "home/agencies",
      "home/creators",
      "home/topics",
      "home/testimonials",
      "blog",
      "brands/logos",
    ];

    const stats = await Promise.all(
      folders.map(async (folder) => {
        try {
          // Lấy tất cả resources trong folder (max 500 để đếm chính xác)
          let allResources = [];
          let nextCursor = null;
          
          do {
            const options = {
              type: "upload",
              resource_type: "image",
              prefix: folder,
              max_results: 500,
            };
            
            if (nextCursor) {
              options.next_cursor = nextCursor;
            }
            
            const result = await cloudinary.api.resources(options);
            allResources = allResources.concat(result.resources || []);
            nextCursor = result.next_cursor;
          } while (nextCursor);
          
          return {
            folder,
            count: allResources.length,
          };
        } catch (err) {
          console.error(`Error counting folder ${folder}:`, err.message);
          return {
            folder,
            count: 0,
            error: err.message,
          };
        }
      })
    );

    // Lấy tổng số tất cả images (không filter folder)
    let totalCount = 0;
    try {
      let allResources = [];
      let nextCursor = null;
      
      do {
        const options = {
          type: "upload",
          resource_type: "image",
          max_results: 500,
        };
        
        if (nextCursor) {
          options.next_cursor = nextCursor;
        }
        
        const result = await cloudinary.api.resources(options);
        allResources = allResources.concat(result.resources || []);
        nextCursor = result.next_cursor;
      } while (nextCursor);
      
      totalCount = allResources.length;
    } catch (err) {
      console.error("Error counting total images:", err.message);
      // Fallback: tính tổng từ stats
      totalCount = stats.reduce((sum, stat) => sum + stat.count, 0);
    }

    res.json({
      folders: stats,
      total: totalCount,
    });
  } catch (err) {
    console.error("GET IMAGE STATS ERROR:", err);
    res.status(500).json({ 
      error: "FETCH_FAILED",
      message: err.message || "Không thể lấy thống kê."
    });
  }
};

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

// ==================== HOME MANAGEMENT UPLOADS ====================

// Upload Hero background image
export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh"
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "home/heroes",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD HERO ERROR:", err);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload hình ảnh. Vui lòng thử lại."
    });
  }
};

// Upload Agency image
export const uploadAgencyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh"
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "home/agencies",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD AGENCY ERROR:", err);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload hình ảnh. Vui lòng thử lại."
    });
  }
};

// Upload Creator avatar (for Home page)
export const uploadCreatorAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh"
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "home/creators",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD CREATOR AVATAR ERROR:", err);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload hình ảnh. Vui lòng thử lại."
    });
  }
};

// Upload Topic image
export const uploadTopicImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh"
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "home/topics",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD TOPIC ERROR:", err);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload hình ảnh. Vui lòng thử lại."
    });
  }
};

// Upload Testimonial avatar
export const uploadTestimonialAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh"
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "home/testimonials",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD TESTIMONIAL ERROR:", err);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload hình ảnh. Vui lòng thử lại."
    });
  }
};

// ==================== BLOG UPLOAD ====================

// Upload Blog image
export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh"
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "blog",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD BLOG ERROR:", err);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload hình ảnh. Vui lòng thử lại."
    });
  }
};

// ==================== BRAND UPLOAD ====================

// Upload Brand logo
export const uploadBrandLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh"
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "brands/logos",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD BRAND LOGO ERROR:", err);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload hình ảnh. Vui lòng thử lại."
    });
  }
};

// ==================== PAYMENT QR CODE UPLOAD ====================

// Upload QR Code cho thanh toán (Staff/Admin only)
export const uploadPaymentQRCode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ 
        error: "INVALID_FILE_TYPE",
        message: "Chỉ chấp nhận file hình ảnh"
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "payment/qrcode",
        resource_type: "image",
      }
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD PAYMENT QR CODE ERROR:", err);
    res.status(500).json({ 
      error: "UPLOAD_FAILED",
      message: err.message || "Không thể upload QR code. Vui lòng thử lại."
    });
  }
};