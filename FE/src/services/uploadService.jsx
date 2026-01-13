import axios from "axios";
import { API_URLS } from "../config/api.js";

const API_URL = API_URLS.UPLOAD;

// Get token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
};

// ==================== HOME MANAGEMENT UPLOADS ====================

export const uploadHeroImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await axios.post(`${API_URL}/home/hero`, formData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const uploadAgencyImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await axios.post(`${API_URL}/home/agency`, formData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const uploadCreatorAvatar = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await axios.post(`${API_URL}/home/creator`, formData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const uploadTopicImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await axios.post(`${API_URL}/home/topic`, formData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const uploadTestimonialAvatar = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await axios.post(`${API_URL}/home/testimonial`, formData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ==================== BLOG UPLOAD ====================

export const uploadBlogImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await axios.post(`${API_URL}/blog`, formData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ==================== BRAND UPLOAD ====================

export const uploadBrandLogo = async (file) => {
  const formData = new FormData();
  formData.append("logo", file);
  
  const res = await axios.post(`${API_URL}/brand/logo`, formData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ==================== PAYMENT QR CODE UPLOAD ====================

export const uploadPaymentQRCode = async (file) => {
  const formData = new FormData();
  formData.append("qrcode", file);
  
  const res = await axios.post(`${API_URL}/payment/qrcode`, formData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
