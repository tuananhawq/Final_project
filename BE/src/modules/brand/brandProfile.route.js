// BE/src/modules/brand/brandProfile.route.js
import express from "express";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import {
  getMyBrandProfile,
  createOrUpdateBrandProfile,
} from "./brand.controller.js";

const router = express.Router();

// Brand profile management routes
router.get(
  "/brand/profile",
  authGuard,
  roleGuard("brand"),
  getMyBrandProfile
);
router.post(
  "/brand/profile",
  authGuard,
  roleGuard("brand"),
  createOrUpdateBrandProfile
);
router.put(
  "/brand/profile",
  authGuard,
  roleGuard("brand"),
  createOrUpdateBrandProfile
);

export default router;

