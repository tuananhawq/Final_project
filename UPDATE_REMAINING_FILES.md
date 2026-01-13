# 🔧 Hướng dẫn cập nhật các files còn lại

## ✅ Đã cập nhật:
- `FE/src/services/authService.jsx` ✅
- `FE/src/services/paymentService.jsx` ✅
- `FE/src/services/dashboardService.jsx` ✅
- `FE/src/services/uploadService.jsx` ✅
- `FE/src/services/imageService.jsx` ✅
- `FE/src/services/homeService.jsx` ✅
- `FE/src/services/blogService.jsx` ✅
- `FE/src/services/userService.jsx` ✅
- `FE/src/services/bannerService.jsx` ✅

## ⚠️ Cần cập nhật thủ công:

Các files trong `FE/src/pages/` và `FE/src/components/` có thể có hardcoded URLs. 

### Cách cập nhật:

1. **Tìm và thay thế pattern:**
   ```javascript
   // TỪ:
   const API_URL = "http://localhost:3000/api/...";
   // hoặc
   axios.get("http://localhost:3000/api/...")
   
   // THÀNH:
   import { API_URLS } from "../config/api.js"; // hoặc "../../config/api.js" tùy vị trí
   // Sau đó sử dụng:
   API_URLS.AUTH, API_URLS.HOME, API_URLS.BLOG, etc.
   ```

2. **Mapping các endpoints:**
   - `/api/auth` → `API_URLS.AUTH`
   - `/api/home` → `API_URLS.HOME`
   - `/api/blog` → `API_URLS.BLOG`
   - `/api/banner` → `API_URLS.BANNER`
   - `/api/creator` → `API_URLS.CREATOR`
   - `/api/brand` → `API_URLS.BRAND`
   - `/api/job` → `API_URLS.JOB`
   - `/api/job-posts` → `API_URLS.JOB_POST`
   - `/api/cv` → `API_URLS.CV`
   - `/api/brand-cv` → `API_URLS.BRAND_CV`
   - `/api/creator-cv` → `API_URLS.CREATOR_CV`
   - `/api/application` → `API_URLS.APPLICATION`
   - `/api/upload` → `API_URLS.UPLOAD`
   - `/api/payment` → `API_URLS.PAYMENT`
   - `/api/dashboard` → `API_URLS.DASHBOARD`

3. **Ví dụ:**
   ```javascript
   // Trước:
   const res = await axios.get("http://localhost:3000/api/home/heroes");
   
   // Sau:
   import { API_URLS } from "../config/api.js";
   const res = await axios.get(`${API_URLS.HOME}/heroes`);
   ```

## 🔍 Tìm các files cần cập nhật:

Chạy lệnh này để tìm tất cả files còn hardcoded URLs:
```bash
cd FE/src
grep -r "http://localhost:3000" . --include="*.jsx" --include="*.js"
```

## 📝 Checklist:

- [ ] Cập nhật tất cả files trong `FE/src/pages/`
- [ ] Cập nhật tất cả files trong `FE/src/components/`
- [ ] Test lại ứng dụng sau khi cập nhật
- [ ] Đảm bảo không còn hardcoded URLs nào
