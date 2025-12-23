import axios from "axios";

const API_URL = "http://localhost:3000/api/blog";

// Get token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ==================== PUBLIC ROUTES ====================
export const getBlogs = async (params = {}) => {
  const res = await axios.get(`${API_URL}`, { params });
  return res.data;
};

export const getBlogById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    if (error.response?.status === 404) {
      throw new Error("Blog not found");
    }
    throw error;
  }
};

export const getFeaturedBlogs = async () => {
  const res = await axios.get(`${API_URL}/featured`);
  return res.data;
};

// ==================== USER ACTIONS ====================
export const likeBlog = async (id) => {
  const res = await axios.post(
    `${API_URL}/${id}/like`,
    {},
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const rateBlog = async (id, rating) => {
  const res = await axios.post(
    `${API_URL}/${id}/rate`,
    { rating },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const addComment = async (id, content) => {
  const res = await axios.post(
    `${API_URL}/${id}/comments`,
    { content },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const deleteComment = async (blogId, commentId) => {
  const res = await axios.delete(
    `${API_URL}/${blogId}/comments/${commentId}`,
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// ==================== ADMIN ROUTES ====================
export const getAllBlogs = async () => {
  const res = await axios.get(`${API_URL}/admin/all`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createBlog = async (data) => {
  const res = await axios.post(`${API_URL}/admin`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateBlog = async (id, data) => {
  const res = await axios.put(`${API_URL}/admin/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

