import express from "express";
import { upload } from "../../middlewares/upload.js";
import {
  uploadImage,
  uploadCvFile,
  uploadHeroImage,
  uploadAgencyImage,
  uploadCreatorAvatar,
  uploadTopicImage,
  uploadTestimonialAvatar,
  uploadBlogImage,
  uploadBrandLogo,
  uploadPaymentQRCode,
  getAllImages,
  deleteImage,
  getImageStats,
} from "./upload.controller.js";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/upload/image
 * Upload avatar cho User
 */
router.post(
  "/image",
  authGuard,
  upload.single("image"),
  uploadImage
);

/**
 * POST /api/upload/cv
 * Upload CV file cho Brand/Creator (chỉ image)
 */
router.post(
  "/cv",
  authGuard,
  upload.single("file"),
  uploadCvFile
);

// ==================== HOME MANAGEMENT UPLOADS ====================

/**
 * POST /api/upload/home/hero
 * Upload Hero background image (Staff/Admin only)
 */
router.post(
  "/home/hero",
  authGuard,
  roleGuard("staff", "admin"),
  upload.single("image"),
  uploadHeroImage
);

/**
 * POST /api/upload/home/agency
 * Upload Agency image (Staff/Admin only)
 */
router.post(
  "/home/agency",
  authGuard,
  roleGuard("staff", "admin"),
  upload.single("image"),
  uploadAgencyImage
);

/**
 * POST /api/upload/home/creator
 * Upload Creator avatar for Home page (Staff/Admin only)
 */
router.post(
  "/home/creator",
  authGuard,
  roleGuard("staff", "admin"),
  upload.single("image"),
  uploadCreatorAvatar
);

/**
 * POST /api/upload/home/topic
 * Upload Topic image (Staff/Admin only)
 */
router.post(
  "/home/topic",
  authGuard,
  roleGuard("staff", "admin"),
  upload.single("image"),
  uploadTopicImage
);

/**
 * POST /api/upload/home/testimonial
 * Upload Testimonial avatar (Staff/Admin only)
 */
router.post(
  "/home/testimonial",
  authGuard,
  roleGuard("staff", "admin"),
  upload.single("image"),
  uploadTestimonialAvatar
);

// ==================== BLOG UPLOAD ====================

/**
 * POST /api/upload/blog
 * Upload Blog image (Staff/Admin only)
 */
router.post(
  "/blog",
  authGuard,
  roleGuard("staff", "admin"),
  upload.single("image"),
  uploadBlogImage
);

// ==================== BRAND UPLOAD ====================

/**
 * POST /api/upload/brand/logo
 * Upload Brand logo (Brand role only)
 */
router.post(
  "/brand/logo",
  authGuard,
  roleGuard("brand"),
  upload.single("logo"),
  uploadBrandLogo
);

// ==================== IMAGE MANAGEMENT ====================

/**
 * GET /api/upload/images
 * List tất cả images từ Cloudinary (Staff/Admin only)
 */
router.get(
  "/images",
  authGuard,
  roleGuard("staff", "admin"),
  getAllImages
);

/**
 * GET /api/upload/images/stats
 * Lấy thống kê images theo folder (Staff/Admin only)
 */
router.get(
  "/images/stats",
  authGuard,
  roleGuard("staff", "admin"),
  getImageStats
);

/**
 * DELETE /api/upload/images
 * Xóa image từ Cloudinary (Staff/Admin only)
 * Sử dụng query parameter để tránh vấn đề với ký tự đặc biệt trong publicId
 */
router.delete(
  "/images",
  authGuard,
  roleGuard("staff", "admin"),
  deleteImage
);

/**
 * POST /api/upload/payment/qrcode
 * Upload QR Code cho thanh toán (Staff/Admin only)
 */
router.post(
  "/payment/qrcode",
  authGuard,
  roleGuard("staff", "admin"),
  upload.single("qrcode"),
  uploadPaymentQRCode
);

export default router;
