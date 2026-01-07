import express from "express";
import { upload } from "../../middlewares/upload.js";
import { uploadImage, uploadCvFile } from "./upload.controller.js";
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

/**
 * POST /api/upload/cv
 * field: file (accept image/*, application/pdf)
 */
router.post(
  "/cv",
  authGuard,
  upload.single("file"),
  uploadCvFile
);

export default router;
