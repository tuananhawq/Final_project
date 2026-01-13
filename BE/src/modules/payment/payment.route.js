import express from "express";
import {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
  approveTransaction,
  cancelTransaction,
  getPricing,
  getPaymentConfig,
  updatePaymentConfig,
  checkPaymentStatus,
} from "./payment.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public: Lấy thông tin pricing
router.get("/pricing", getPricing);

// User đã đăng nhập: Tạo transaction mới
router.post("/transactions", authGuard, createTransaction);

// User đã đăng nhập: Lấy danh sách transaction của mình
router.get("/transactions/my", authGuard, getMyTransactions);

// User đã đăng nhập: Kiểm tra trạng thái thanh toán/premium
router.get("/status", authGuard, checkPaymentStatus);

// Staff/Admin: Lấy tất cả transactions
router.get(
  "/transactions",
  authGuard,
  roleGuard("staff", "admin"),
  getAllTransactions
);

// Staff/Admin: Duyệt transaction
router.patch(
  "/transactions/:transactionId/approve",
  authGuard,
  roleGuard("staff", "admin"),
  approveTransaction
);

// Staff/Admin: Hủy transaction
router.patch(
  "/transactions/:transactionId/cancel",
  authGuard,
  roleGuard("staff", "admin"),
  cancelTransaction
);

// Staff/Admin: Lấy payment config
router.get(
  "/config",
  authGuard,
  roleGuard("staff", "admin"),
  getPaymentConfig
);

// Staff/Admin: Cập nhật payment config
router.patch(
  "/config",
  authGuard,
  roleGuard("staff", "admin"),
  updatePaymentConfig
);

export default router;
