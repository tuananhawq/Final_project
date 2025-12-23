import express from "express";
import { upload, uploadImage } from "./upload.controller.js";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Upload single image (chỉ staff/admin)
router.post(
  "/upload",
  authGuard,
  roleGuard("staff", "admin"),
  upload.single("image"),
  uploadImage
);

export default router;

