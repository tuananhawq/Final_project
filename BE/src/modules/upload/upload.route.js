import express from "express";
import { upload } from "../../middlewares/upload.js";
import { uploadImage } from "./upload.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/upload/image
 */
router.post(
  "/image",
  authGuard,
  upload.single("image"), // 👈 BẮT BUỘC
  uploadImage
);

export default router;
