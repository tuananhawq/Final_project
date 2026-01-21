import express from "express";
import {
  getLegalContent,
  getLegalConfig,
  updateLegalConfig,
} from "./legal.controller.js";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getLegalContent);

// Admin/Staff
router.get(
  "/config",
  authGuard,
  roleGuard("staff", "admin"),
  getLegalConfig
);
router.patch(
  "/config",
  authGuard,
  roleGuard("staff", "admin"),
  updateLegalConfig
);

export default router;

