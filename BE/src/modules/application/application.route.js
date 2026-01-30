import express from "express";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import {
  createApplication,
  getCreatorApplications,
  getJobPostApplications,
  updateApplicationStatus,
} from "./application.controller.js";

const router = express.Router();

// Creator routes - cho phép user và creator đều có thể ứng tuyển
router.post(
  "/creator/apply",
  authGuard,
  roleGuard("creator", "user"),
  createApplication
);
router.get(
  "/creator/applications",
  authGuard,
  roleGuard("creator", "user"),
  getCreatorApplications
);

// Brand routes
router.get(
  "/brand/job-post/:id/applications",
  authGuard,
  roleGuard("brand"),
  getJobPostApplications
);
router.put(
  "/brand/job-post/:id/applications/:applicationId",
  authGuard,
  roleGuard("brand"),
  updateApplicationStatus
);

export default router;

