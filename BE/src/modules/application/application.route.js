import express from "express";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import {
  createApplication,
  getCreatorApplications,
  getJobPostApplications,
  updateApplicationStatus,
} from "./application.controller.js";

const router = express.Router();

// Creator routes
router.post(
  "/creator/apply",
  authGuard,
  roleGuard("creator"),
  createApplication
);
router.get(
  "/creator/applications",
  authGuard,
  roleGuard("creator"),
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

