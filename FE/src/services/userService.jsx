import axios from "axios";
import { API_URLS } from "../config/api.js";

const API_URL = API_URLS.AUTH;

// Lấy token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Lấy danh sách users với phân trang và filter
 */
export const getAllUsers = async (params = {}) => {
  const { page = 1, limit = 10, role, search } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (role) queryParams.append("role", role);
  if (search) queryParams.append("search", search);

  const response = await axios.get(
    `${API_URL}/admin/users?${queryParams.toString()}`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Lấy thông tin chi tiết một user
 */
export const getUserById = async (id) => {
  const response = await axios.get(
    `${API_URL}/admin/users/${id}`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Tạo user mới
 */
export const createUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/admin/users`,
    userData,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Cập nhật thông tin user
 */
export const updateUser = async (id, userData) => {
  const response = await axios.put(
    `${API_URL}/admin/users/${id}`,
    userData,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Xóa user
 */
export const deleteUser = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/users/${id}`,
    getAuthHeaders()
  );
  return response.data;
};

