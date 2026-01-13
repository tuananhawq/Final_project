# 📋 Deployment Checklist - REVLIVE

## ⚠️ Trạng thái hiện tại: **CHƯA SẴN SÀNG** để deploy

### ✅ Đã hoàn thành:
- [x] Backend API endpoints đầy đủ
- [x] Frontend components và pages
- [x] Authentication & Authorization
- [x] Image upload với Cloudinary
- [x] Payment system
- [x] Dashboard với real-time data
- [x] Email notifications
- [x] Seed data đầy đủ

### ❌ Cần hoàn thành trước khi deploy:

#### 1. **Environment Variables** (QUAN TRỌNG)
- [ ] Tạo file `.env` trong `BE/` từ `.env.example`
- [ ] Tạo file `.env` trong `FE/` từ `.env.example`
- [ ] Cập nhật các giá trị production:
  - `MONGO_URI` - MongoDB connection string (production)
  - `JWT_SECRET` - Secret key mạnh cho production
  - `CLOUDINARY_*` - Cloudinary credentials
  - `MAIL_USER` và `MAIL_PASS` - Email credentials
  - `FRONTEND_URL` - Production frontend URL

#### 2. **API URLs** (QUAN TRỌNG)
- [ ] Đã tạo `FE/src/config/api.js` ✅
- [ ] Cần cập nhật **39 service files** để sử dụng `API_URLS` từ config
- [ ] Files cần cập nhật:
  - `FE/src/services/*.jsx` (tất cả 9 files)
  - `FE/src/pages/*.jsx` (nhiều files)
  - `FE/src/components/*.jsx` (nhiều files)

#### 3. **CORS Configuration** (QUAN TRỌNG)
- [x] Đã cập nhật CORS để hỗ trợ environment variable ✅
- [ ] Cần set `FRONTEND_URL` trong `.env` với production domain

#### 4. **Build & Production**
- [ ] Test build frontend: `cd FE && npm run build`
- [ ] Test build backend: Kiểm tra `BE/package.json` có script `start`
- [ ] Cấu hình production server (PM2, Docker, hoặc hosting platform)

#### 5. **Security**
- [ ] Đổi `JWT_SECRET` thành một giá trị mạnh và random
- [ ] Kiểm tra các API endpoints có authentication đúng chưa
- [ ] Review các sensitive data không được expose ra frontend
- [ ] Enable HTTPS cho production

#### 6. **Database**
- [ ] Setup MongoDB production database
- [ ] Chạy seed data: `cd BE && node seed-all.js`
- [ ] Backup database strategy

#### 7. **Testing**
- [ ] Test tất cả các chức năng chính:
  - [ ] Authentication (Login/Register)
  - [ ] Image upload
  - [ ] Payment flow
  - [ ] Dashboard
  - [ ] CRUD operations
- [ ] Test trên production environment

#### 8. **Documentation**
- [ ] Tạo file `README.md` với hướng dẫn deploy
- [ ] Document API endpoints (Swagger đã có)
- [ ] Document environment variables

---

## 🚀 Hướng dẫn Deploy nhanh:

### Backend:
```bash
cd BE
# 1. Tạo .env từ .env.example và điền thông tin
cp .env.example .env
# 2. Cài đặt dependencies
npm install
# 3. Chạy seed data
node seed-all.js
# 4. Start server
npm start
# hoặc với PM2:
pm2 start src/app.js --name revlive-backend
```

### Frontend:
```bash
cd FE
# 1. Tạo .env từ .env.example và điền API URL
cp .env.example .env
# 2. Cài đặt dependencies
npm install
# 3. Build production
npm run build
# 4. Serve static files (hoặc deploy lên hosting)
# Với serve:
npx serve -s dist -l 3001
```

---

## 📝 Notes:
- **Vite**: Frontend sử dụng Vite, build output sẽ ở `FE/dist/`
- **Express**: Backend sử dụng Express, cần Node.js runtime
- **MongoDB**: Cần MongoDB instance (local hoặc cloud như MongoDB Atlas)
- **Cloudinary**: Cần Cloudinary account để upload images
- **Email**: Cần Gmail App Password cho Nodemailer

---

## ⚡ Quick Fix để deploy ngay:

1. **Cập nhật tất cả API URLs trong Frontend:**
   ```bash
   # Tìm và thay thế trong tất cả files
   # Từ: "http://localhost:3000/api"
   # Thành: import { API_URLS } from "../config/api.js" và sử dụng API_URLS.*
   ```

2. **Set environment variables:**
   - Backend: Tạo `BE/.env` với production values
   - Frontend: Tạo `FE/.env` với `VITE_API_URL=https://your-api-domain.com/api`

3. **Build và deploy:**
   - Frontend: `npm run build` → upload `dist/` folder
   - Backend: Deploy lên server với Node.js

---

**Ưu tiên cao nhất:** Cập nhật tất cả hardcoded URLs trong Frontend!
