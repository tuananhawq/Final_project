// Thêm vào đầu file src/config/passport.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),  // lên 2 cấp vì passport.js nằm trong config/
});

import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

/* ================= GOOGLE ================= */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({ email });

        if (!user) {
          const hash = await bcrypt.hash("GOOGLE_LOGIN", 10);
          user = await User.create({
            email,
            username: profile.displayName,
            passwordHash: hash,
            provider: "google",
            isVerified: true,
            roles: ["user"]   // 👈 BẮT BUỘC
          });

        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
