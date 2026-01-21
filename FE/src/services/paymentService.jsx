import axios from "axios";
import { API_URLS } from "../config/api.js";

const API_URL = API_URLS.PAYMENT;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Lấy thông tin pricing (public)
export const getPricing = async () => {
  const res = await axios.get(`${API_URL}/pricing`);
  return res.data;
};

// Tạo transaction mới
export const createTransaction = async (plan) => {
  const res = await axios.post(
    `${API_URL}/transactions`,
    { plan },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Lấy danh sách transaction của user hiện tại
export const getMyTransactions = async () => {
  const res = await axios.get(`${API_URL}/transactions/my`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Staff/Admin: Lấy tất cả transactions
export const getAllTransactions = async (status = null) => {
  const params = {};
  if (status) params.status = status;
  const res = await axios.get(`${API_URL}/transactions`, {
    headers: getAuthHeaders(),
    params,
  });
  return res.data;
};

// Staff/Admin: Duyệt transaction
export const approveTransaction = async (transactionId) => {
  const res = await axios.patch(
    `${API_URL}/transactions/${transactionId}/approve`,
    {},
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Staff/Admin: Hủy transaction
export const cancelTransaction = async (transactionId, reason) => {
  const res = await axios.patch(
    `${API_URL}/transactions/${transactionId}/cancel`,
    { reason },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Staff/Admin: Lấy payment config
export const getPaymentConfig = async () => {
  const res = await axios.get(`${API_URL}/config`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Staff/Admin: Cập nhật payment config
export const updatePaymentConfig = async (configData) => {
  const res = await axios.patch(`${API_URL}/config`, configData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Kiểm tra trạng thái thanh toán/premium của user hiện tại
export const checkPaymentStatus = async () => {
  const res = await axios.get(`${API_URL}/status`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Tạo thanh toán PayOS cho Creator
export const checkoutCreator = async () => {
  const res = await axios.post(
    `${API_URL}/checkout/creator`,
    {},
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Tạo thanh toán PayOS cho Brand
export const checkoutBrand = async () => {
  const res = await axios.post(
    `${API_URL}/checkout/brand`,
    {},
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Xử lý callback từ PayOS sau khi thanh toán thành công
export const checkoutSuccess = async (token) => {
  const res = await axios.get(`${API_URL}/checkout/success`, {
    params: { token },
  });
  return res.data;
};