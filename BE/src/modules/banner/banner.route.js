// BE/src/modules/banner/banner.route.js
import express from "express";
import { upload } from "../../middlewares/upload.js";
import { getBanners, createBanner, getBannerDetail } from "./banner.controller.js";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public: Lấy danh sách banner để hiển thị trên FE
router.get("/", getBanners);
router.get("/detail/:id", getBannerDetail); // /api/banners/detail/123abc...
// Protected: Tạo banner mới (sau này chỉ admin dùng)
router.post(
  "/",
  authGuard,
  roleGuard("admin"),
  upload.single("image"),
  createBanner
);

export default router;