import express from "express";
import { authGuard } from "../../middlewares/auth.middleware.js";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.controller.js";

const router = express.Router();

router.get("/", authGuard, getMyNotifications);
router.put("/:id/read", authGuard, markAsRead);
router.put("/read-all", authGuard, markAllAsRead);
router.delete("/:id", authGuard, deleteNotification);

export default router;
