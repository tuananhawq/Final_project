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
  warnBlog,
  deleteBlogWithReason,
  lockBrandAccount,
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

// ==================== BLOG MANAGEMENT ROUTES ====================
// Cho phép creator, brand, staff xem tất cả blogs (không cho admin/user)
router.get("/admin/all", authGuard, roleGuard("staff", "admin", "creator", "brand", "user"), getAllBlogs);
// Cho phép creator, brand tạo blog (staff cũng có thể tạo nếu cần, nhưng không cho admin/user)
router.post("/admin", authGuard, roleGuard("staff", "admin", "creator", "brand", "user"), createBlog);
// Cho phép creator, brand, staff chỉnh sửa (nhưng chỉ blog của mình, trừ staff)
router.put("/admin/:id", authGuard, roleGuard("staff", "admin", "creator", "brand", "user"), updateBlog);
// Cho phép staff xóa mọi blog, và cho phép creator/brand xóa blog của chính mình
router.delete("/admin/:id", authGuard, roleGuard("staff", "admin", "creator", "brand"), deleteBlog);

// ==================== STAFF MANAGEMENT ROUTES ====================
// Chỉ staff mới có quyền cảnh cáo và quản lý vi phạm
router.post("/admin/:id/warn", authGuard, roleGuard("staff", "admin"), warnBlog);
router.delete("/admin/:id/delete-with-reason", authGuard, roleGuard("staff", "admin"), deleteBlogWithReason);
router.post("/admin/lock-brand/:userId", authGuard, roleGuard("staff", "admin"), lockBrandAccount);

export default router;

