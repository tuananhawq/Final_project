import axios from "axios";

const API_URL = "http://localhost:3000/api/upload";

// Get token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Lấy tất cả images từ Cloudinary
export const getAllImages = async (folder = null, maxResults = 500) => {
  const params = { maxResults };
  if (folder) params.folder = folder;
  
  const res = await axios.get(`${API_URL}/images`, {
    headers: getAuthHeaders(),
    params,
  });
  return res.data;
};

// Lấy thống kê images theo folder
export const getImageStats = async () => {
  const res = await axios.get(`${API_URL}/images/stats`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Xóa image từ Cloudinary
export const deleteImage = async (publicId) => {
  // Sử dụng query parameter để tránh vấn đề với ký tự đặc biệt trong publicId
  const res = await axios.delete(`${API_URL}/images`, {
    headers: getAuthHeaders(),
    params: { publicId },
  });
  return res.data;
};
