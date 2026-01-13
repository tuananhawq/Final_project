import axios from "axios";
import { API_URLS } from "../config/api.js";

const API_URL = API_URLS.AUTH;

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password,
  });
};
