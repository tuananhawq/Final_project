// API Configuration
// Sử dụng environment variable hoặc fallback về localhost cho development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_URLS = {
  AUTH: `${API_BASE_URL}/auth`,
  HOME: `${API_BASE_URL}/home`,
  BLOG: `${API_BASE_URL}/blog`,
  BANNER: `${API_BASE_URL}/banner`,
  CREATOR: `${API_BASE_URL}/creator`,
  BRAND: `${API_BASE_URL}/brand`,
  BRANDS: `${API_BASE_URL}/brands`, // Endpoint để lấy danh sách brands
  JOB: `${API_BASE_URL}/job`,
  JOB_POST: `${API_BASE_URL}`,
  CV: `${API_BASE_URL}/cv`,
  BRAND_CV: `${API_BASE_URL}/brand/cv`, // Endpoint đúng: /api/brand/cv
  CREATOR_CV: `${API_BASE_URL}/creator/cv`, // Endpoint đúng: /api/creator/cv
  APPLICATION: `${API_BASE_URL}/application`,
  UPLOAD: `${API_BASE_URL}/upload`,
  PAYMENT: `${API_BASE_URL}/payment`,
  DASHBOARD: `${API_BASE_URL}/dashboard`,
};

export default API_BASE_URL;
