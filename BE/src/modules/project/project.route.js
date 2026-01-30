import express from "express";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import {
  createProject,
  getMyProjects,
  updateMyProject,
  deleteMyProject,
  getPublicProjects,
  getProjectDetail,
  getAllProjects,
  approveProject,
  rejectProject,
} from "./project.controller.js";

const router = express.Router();

// Public routes
router.get("/projects", getPublicProjects);
router.get("/projects/:id", getProjectDetail);

// Brand routes
router.post("/brand/project", authGuard, roleGuard("brand"), createProject);
router.get("/brand/project", authGuard, roleGuard("brand"), getMyProjects);
router.put("/brand/project/:id", authGuard, roleGuard("brand"), updateMyProject);
router.delete("/brand/project/:id", authGuard, roleGuard("brand"), deleteMyProject);

// Staff routes
router.get("/admin/projects", authGuard, roleGuard("staff", "admin"), getAllProjects);
router.patch("/admin/projects/:id/approve", authGuard, roleGuard("staff", "admin"), approveProject);
router.patch("/admin/projects/:id/reject", authGuard, roleGuard("staff", "admin"), rejectProject);

export default router;
