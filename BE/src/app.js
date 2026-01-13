
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import uploadRoutes from "./modules/upload/upload.route.js";
// 👉 fix cho ESM + Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 LOAD ĐÚNG FILE .env (ở thư mục BE)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import express from 'express';
import cors from 'cors';              // ✅ THÊM
import passport from "passport";
import { connectDB } from './config/db.js';
import authRoutes from './modules/auth/auth.route.js';
import homeRoutes from './modules/home/home.route.js';
import blogRoutes from './modules/blog/blog.route.js';
import bannerRoute from "./modules/banner/banner.route.js";
import creatorRoute from "./modules/creator/creator.route.js";  
import brandRoute from "./modules/brand/brand.route.js";
import jobRoute from "./modules/job/job.route.js";
import jobPostRoute from "./modules/jobPost/jobPost.route.js";
import cvRoute from "./modules/cv/cv.route.js";
import brandCvRoute from "./modules/brandCv/brandCv.route.js";
import creatorCvRoute from "./modules/creatorCv/creatorCv.route.js";
import applicationRoute from "./modules/application/application.route.js";
import paymentRoute from "./modules/payment/payment.route.js";
import dashboardRoute from "./modules/dashboard/dashboard.route.js";
import { setupSwagger } from './config/swagger.js';
import "./config/passport.js";


connectDB();

const app = express();

// ✅ CORS PHẢI ĐẶT TRƯỚC ROUTES
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// routes
app.use('/api/auth', authRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/blog', blogRoutes);
app.use("/api/banners", bannerRoute);
app.use("/api/creators", creatorRoute);
app.use("/api/brands", brandRoute);
app.use("/api/jobs", jobRoute);
app.use("/api", jobPostRoute);
app.use("/api", cvRoute);
app.use("/api", brandCvRoute);
app.use("/api", creatorCvRoute);
app.use("/api", applicationRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/dashboard", dashboardRoute);
// swagger
setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
