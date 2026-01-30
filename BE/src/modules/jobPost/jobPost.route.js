import express from "express";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import {
  getPublicJobPosts,
  getJobPostDetail,
  createMyJobPost,
  getMyJobPosts,
  updateMyJobPost,
  deleteMyJobPost,
  adminGetJobPosts,
  adminWarnBrandPost,
  adminDeleteJobPost,
} from "./jobPost.controller.js";

const router = express.Router();

// Public news feed
router.get("/job-posts", getPublicJobPosts);
router.get("/job-posts/:id", getJobPostDetail);

// Brand scoped CRUD
router.post(
  "/brand/job-post",
  authGuard,
  roleGuard("brand"),
  createMyJobPost
);
router.get("/brand/job-post", authGuard, roleGuard("brand"), getMyJobPosts);
router.put(
  "/brand/job-post/:id",
  authGuard,
  roleGuard("brand"),
  updateMyJobPost
);
router.delete(
  "/brand/job-post/:id",
  authGuard,
  roleGuard("brand"),
  deleteMyJobPost
);

// Admin/Staff Routes
router.get(
  "/admin/job-posts",
  authGuard,
  roleGuard("admin", "staff"),
  adminGetJobPosts
);

router.post(
  "/admin/job-posts/:id/warn",
  authGuard,
  roleGuard("admin", "staff"),
  adminWarnBrandPost
);

router.delete(
  "/admin/job-posts/:id",
  authGuard,
  roleGuard("admin", "staff"),
  adminDeleteJobPost
);

export default router;


