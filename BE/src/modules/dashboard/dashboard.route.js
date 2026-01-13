import express from "express";
import {
  getDashboardStats,
  getRevenueChart,
  getRecentTransactions,
  getOverviewStats,
} from "./dashboard.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Tất cả routes đều yêu cầu staff/admin
router.get(
  "/stats",
  authGuard,
  roleGuard("staff", "admin"),
  getDashboardStats
);

router.get(
  "/revenue-chart",
  authGuard,
  roleGuard("staff", "admin"),
  getRevenueChart
);

router.get(
  "/recent-transactions",
  authGuard,
  roleGuard("staff", "admin"),
  getRecentTransactions
);

router.get(
  "/overview",
  authGuard,
  roleGuard("staff", "admin"),
  getOverviewStats
);

export default router;
