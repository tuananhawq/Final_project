import axios from "axios";
import { API_URLS } from "../config/api.js";

const API_URL = API_URLS.DASHBOARD;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Lấy thống kê tổng quan
export const getDashboardStats = async () => {
  const res = await axios.get(`${API_URL}/stats`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Lấy dữ liệu biểu đồ doanh thu
export const getRevenueChart = async () => {
  const res = await axios.get(`${API_URL}/revenue-chart`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Lấy transactions gần đây
export const getRecentTransactions = async () => {
  const res = await axios.get(`${API_URL}/recent-transactions`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Lấy thống kê tổng quan khác
export const getOverviewStats = async () => {
  const res = await axios.get(`${API_URL}/overview`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
