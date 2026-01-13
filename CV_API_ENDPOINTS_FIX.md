# 🔧 Fix: Lỗi 404 khi tạo CV

## 🐛 Vấn đề:
Request failed with status code 404 khi tạo CV.

## 🔍 Nguyên nhân:
**Endpoint không khớp giữa Frontend và Backend:**

### Trước khi sửa:
- **Frontend**: `/api/creator-cv` (sai)
- **Backend**: `/api/creator/cv` (đúng)
- **Frontend**: `/api/brand-cv` (sai)
- **Backend**: `/api/brand/cv` (đúng)

### Sau khi sửa:
- **Frontend**: `/api/creator/cv` ✅
- **Backend**: `/api/creator/cv` ✅
- **Frontend**: `/api/brand/cv` ✅
- **Backend**: `/api/brand/cv` ✅

## ✅ Đã sửa:

### 1. Frontend API Config (`FE/src/config/api.js`):
```javascript
// Trước:
CREATOR_CV: `${API_BASE_URL}/creator-cv`,  // ❌ SAI
BRAND_CV: `${API_BASE_URL}/brand-cv`,      // ❌ SAI

// Sau:
CREATOR_CV: `${API_BASE_URL}/creator/cv`,  // ✅ ĐÚNG
BRAND_CV: `${API_BASE_URL}/brand/cv`,      // ✅ ĐÚNG
```

### 2. Backend Routes:
- **Creator CV**: `POST /api/creator/cv` ✅
- **Brand CV**: `POST /api/brand/cv` ✅

## 📋 Endpoints đúng:

### Creator CV:
- `POST /api/creator/cv` - Tạo/Cập nhật CV
- `GET /api/creator/cv` - Lấy CV
- `PUT /api/creator/cv` - Cập nhật CV
- `DELETE /api/creator/cv` - Xóa CV

### Brand CV:
- `POST /api/brand/cv` - Tạo/Cập nhật CV
- `GET /api/brand/cv` - Lấy CV
- `PUT /api/brand/cv/:id` - Cập nhật CV
- `DELETE /api/brand/cv/:id` - Xóa CV

## 🧪 Cách kiểm tra:

1. **Kiểm tra Network tab trong browser:**
   - Xem request URL có đúng không
   - Xem response status code

2. **Kiểm tra Backend logs:**
   - Xem có request đến endpoint không
   - Xem có lỗi gì không

3. **Test API trực tiếp:**
   ```bash
   # Test Creator CV (cần token)
   curl -X POST http://localhost:3000/api/creator/cv \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test","title":"Test CV"}'
   ```

## ✅ Kết quả mong đợi:

Sau khi sửa, khi tạo CV:
- ✅ Không còn lỗi 404
- ✅ CV được tạo thành công
- ✅ Thông báo lỗi rõ ràng nếu có validation error
