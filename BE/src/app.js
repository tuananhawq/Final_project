
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
import uploadRoutes from './modules/home/upload.route.js';
import { setupSwagger } from './config/swagger.js';
import "./config/passport.js";


connectDB();

const app = express();

// ✅ CORS PHẢI ĐẶT TRƯỚC ROUTES
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/upload', uploadRoutes);

// swagger
setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
