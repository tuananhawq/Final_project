import axios from "axios";
import { API_URLS } from "../config/api.js";

const API_URL = API_URLS.LEGAL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getLegalPublic = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getLegalConfig = async () => {
  const res = await axios.get(`${API_URL}/config`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateLegalConfig = async (payload) => {
  const res = await axios.patch(`${API_URL}/config`, payload, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

