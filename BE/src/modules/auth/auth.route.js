import express from 'express';
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login,forgotPassword, resetPassword } from './auth.controller.js';
import { getProfile, updateProfile } from "./profile.controller.js";
import { authGuard, roleGuard } from "../../middlewares/auth.middleware.js";
import { changePassword } from './changePassword.controller.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from './userManagement.controller.js';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
} from './staffManagement.controller.js';

const router = express.Router();

/**
 * STEP 1: Redirect sang Google
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",   // 🔥 DÒNG QUAN TRỌNG
    session: false,
  })
);


/**
 * STEP 2: Google callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        userId: req.user._id,
        username: req.user.username,
        roles: req.user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // redirect về FE kèm token
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

router.get("/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

router.get("/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        userId: req.user._id,
        username: req.user.username,
  
        roles: req.user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);
router.post('/register', register);
router.post('/login', login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authGuard, getProfile);
router.put("/me", authGuard, updateProfile);
router.post("/change-password", authGuard, changePassword);

// User Management Routes (Staff/Admin only)
router.get("/admin/users", authGuard, roleGuard("staff", "admin"), getAllUsers);
router.get("/admin/users/:id", authGuard, roleGuard("staff", "admin"), getUserById);
router.post("/admin/users", authGuard, roleGuard("staff", "admin"), createUser);
router.put("/admin/users/:id", authGuard, roleGuard("staff", "admin"), updateUser);
router.delete("/admin/users/:id", authGuard, roleGuard("staff", "admin"), deleteUser);

// Staff Management Routes (Admin only)
router.get("/admin/staff", authGuard, roleGuard("admin"), getAllStaff);
router.get("/admin/staff/:id", authGuard, roleGuard("admin"), getStaffById);
router.post("/admin/staff", authGuard, roleGuard("admin"), createStaff);
router.put("/admin/staff/:id", authGuard, roleGuard("admin"), updateStaff);
router.delete("/admin/staff/:id", authGuard, roleGuard("admin"), deleteStaff);

export default router;
