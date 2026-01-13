# 📊 Tiến độ cập nhật API URLs

## ✅ Đã hoàn thành:

### Services (9/9) ✅
- [x] authService.jsx
- [x] paymentService.jsx
- [x] dashboardService.jsx
- [x] uploadService.jsx
- [x] imageService.jsx
- [x] homeService.jsx
- [x] blogService.jsx
- [x] userService.jsx
- [x] bannerService.jsx

### Pages - Auth (4/4) ✅
- [x] Login.jsx
- [x] Register.jsx
- [x] ForgotPassword.jsx
- [x] ResetPassword.jsx

### Pages - Profile (1/1) ✅
- [x] Profile.jsx

### Components (8/11) ✅
- [x] Header.jsx
- [x] BrandCVManager.jsx
- [x] CreatorCVManager.jsx
- [x] ApplicationManagement.jsx
- [x] MyJobPosts.jsx
- [x] CreatorNews.jsx
- [x] BrandNews.jsx
- [x] CreateJobPostModal.jsx

## ⏳ Còn lại cần cập nhật:

### Pages (15 files):
- [ ] BlogDetail.jsx
- [ ] JobPostDetailPage.jsx
- [ ] TopicDetailPage.jsx
- [ ] JobDetailPage.jsx
- [ ] BrandDetailPage.jsx
- [ ] CVDetailPage.jsx
- [ ] CreatorLayout.jsx
- [ ] BrandLayout.jsx
- [ ] TestimonialDetailPage.jsx
- [ ] CreatorDetailPage.jsx
- [ ] AgencyDetailPage.jsx
- [ ] BrandPage.jsx
- [ ] CreatorPage.jsx
- [ ] JobOffersPage.jsx

### Components (3 files):
- [ ] CreatorApplications.jsx
- [ ] RecommendedBrands.jsx
- [ ] RecommendedCV.jsx

## 📝 Hướng dẫn cập nhật nhanh:

1. Thêm import:
   ```javascript
   import { API_URLS } from "../config/api.js"; // hoặc "../../config/api.js"
   ```

2. Thay thế URLs:
   ```javascript
   // TỪ:
   "http://localhost:3000/api/..."
   
   // THÀNH:
   `${API_URLS.AUTH}/...` // hoặc API_URLS.HOME, API_URLS.BLOG, etc.
   ```

3. Mapping endpoints:
   - `/api/auth` → `API_URLS.AUTH`
   - `/api/home` → `API_URLS.HOME`
   - `/api/blog` → `API_URLS.BLOG`
   - `/api/brand` → `API_URLS.BRAND`
   - `/api/creator` → `API_URLS.CREATOR`
   - `/api/job-posts` → `API_URLS.JOB_POST + "/job-posts"`
   - `/api/cv` → `API_URLS.CV`
   - `/api/application` → `API_URLS.APPLICATION`

## 🎯 Tổng tiến độ: **22/30 files** (73%)
