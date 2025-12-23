import axios from "axios";

const API_URL = "http://localhost:3000/api/home";

// Get token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ==================== HERO ====================
export const getHeroes = async () => {
  const res = await axios.get(`${API_URL}/heroes`);
  return res.data;
};

export const getAllHeroes = async () => {
  const res = await axios.get(`${API_URL}/admin/heroes`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createHero = async (data) => {
  const res = await axios.post(`${API_URL}/admin/heroes`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateHero = async (id, data) => {
  const res = await axios.put(`${API_URL}/admin/heroes/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteHero = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/heroes/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ==================== AGENCY ====================
export const getAgencies = async () => {
  const res = await axios.get(`${API_URL}/agencies`);
  return res.data;
};

export const getAllAgencies = async () => {
  const res = await axios.get(`${API_URL}/admin/agencies`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createAgency = async (data) => {
  const res = await axios.post(`${API_URL}/admin/agencies`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateAgency = async (id, data) => {
  const res = await axios.put(`${API_URL}/admin/agencies/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteAgency = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/agencies/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ==================== CREATOR ====================
export const getCreators = async () => {
  const res = await axios.get(`${API_URL}/creators`);
  return res.data;
};

export const getAllCreators = async () => {
  const res = await axios.get(`${API_URL}/admin/creators`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createCreator = async (data) => {
  const res = await axios.post(`${API_URL}/admin/creators`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateCreator = async (id, data) => {
  const res = await axios.put(`${API_URL}/admin/creators/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteCreator = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/creators/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ==================== TOPIC ====================
export const getTopics = async () => {
  const res = await axios.get(`${API_URL}/topics`);
  return res.data;
};

export const getAllTopics = async () => {
  const res = await axios.get(`${API_URL}/admin/topics`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createTopic = async (data) => {
  const res = await axios.post(`${API_URL}/admin/topics`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateTopic = async (id, data) => {
  const res = await axios.put(`${API_URL}/admin/topics/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteTopic = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/topics/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ==================== TESTIMONIAL ====================
export const getTestimonials = async () => {
  const res = await axios.get(`${API_URL}/testimonials`);
  return res.data;
};

export const getAllTestimonials = async () => {
  const res = await axios.get(`${API_URL}/admin/testimonials`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createTestimonial = async (data) => {
  const res = await axios.post(`${API_URL}/admin/testimonials`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateTestimonial = async (id, data) => {
  const res = await axios.put(`${API_URL}/admin/testimonials/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteTestimonial = async (id) => {
  const res = await axios.delete(`${API_URL}/admin/testimonials/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ==================== FOOTER ====================
export const getFooter = async () => {
  const res = await axios.get(`${API_URL}/footer`);
  return res.data;
};

export const updateFooter = async (data) => {
  const res = await axios.put(`${API_URL}/admin/footer`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

