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
 * Lấy danh sách staff với phân trang và filter
 */
export const getAllStaff = async (params = {}) => {
  const { page = 1, limit = 10, search } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) queryParams.append("search", search);

  const response = await axios.get(
    `${API_URL}/admin/staff?${queryParams.toString()}`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Lấy thông tin chi tiết một staff
 */
export const getStaffById = async (id) => {
  const response = await axios.get(
    `${API_URL}/admin/staff/${id}`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Tạo staff mới
 */
export const createStaff = async (staffData) => {
  const response = await axios.post(
    `${API_URL}/admin/staff`,
    staffData,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Cập nhật thông tin staff
 */
export const updateStaff = async (id, staffData) => {
  const response = await axios.put(
    `${API_URL}/admin/staff/${id}`,
    staffData,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Xóa staff
 */
export const deleteStaff = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/staff/${id}`,
    getAuthHeaders()
  );
  return response.data;
};
