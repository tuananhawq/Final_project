import express from "express";
import {
  getBlogs,
  getBlogById,
  getFeaturedBlogs,
  likeBlog,
  rateBlog,
  addComment,
  deleteComment,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./blog.controller.js";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.get("/featured", getFeaturedBlogs); // Phải đặt trước /:id để tránh conflict
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// ==================== USER ACTIONS (cần auth) ====================
router.post("/:id/like", authGuard, likeBlog);
router.post("/:id/rate", authGuard, rateBlog);
router.post("/:id/comments", authGuard, addComment);
router.delete("/:id/comments/:commentId", authGuard, deleteComment);

// ==================== BLOG MANAGEMENT ROUTES (staff/admin/creator/brand) ====================
router.get("/admin/all", authGuard, roleGuard("staff", "admin", "creator", "brand"), getAllBlogs);
router.post("/admin", authGuard, roleGuard("staff", "admin", "creator", "brand"), createBlog);
router.put("/admin/:id", authGuard, roleGuard("staff", "admin", "creator", "brand"), updateBlog);
router.delete("/admin/:id", authGuard, roleGuard("staff", "admin", "creator", "brand"), deleteBlog);

export default router;

