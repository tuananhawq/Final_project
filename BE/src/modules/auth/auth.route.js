import express from 'express';
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login,forgotPassword, resetPassword } from './auth.controller.js';

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
      { userId: req.user._id },
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

export default router;
