import axios from "axios";
import { API_URLS } from "../config/api.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMyNotifications = async () => {
  const res = await axios.get(`${API_URLS.NOTIFICATIONS}`, {
    headers: getAuthHeaders(),
  });
  return res.data; // { notifications, unreadCount }
};

export const markNotificationAsRead = async (id) => {
  const res = await axios.put(`${API_URLS.NOTIFICATIONS}/${id}/read`, null, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await axios.put(`${API_URLS.NOTIFICATIONS}/read-all`, null, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteNotificationById = async (id) => {
  const res = await axios.delete(`${API_URLS.NOTIFICATIONS}/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
