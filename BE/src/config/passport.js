// Thêm vào đầu file src/config/passport.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),  // lên 2 cấp vì passport.js nằm trong config/
});

console.log("Passport load GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID); // debug
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          // 🔥 HASH PASSWORD GIẢ
          const dummyPassword = Math.random().toString(36).slice(-10);
          const passwordHash = await bcrypt.hash(dummyPassword, 10);

          user = await User.create({
            email,
            username: profile.displayName,
            passwordHash,          // ✅ BẮT BUỘC CÓ
            provider: "google",
            roles: ["user"],
            isVerified: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);