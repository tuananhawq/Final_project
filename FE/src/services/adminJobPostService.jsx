import axios from "axios";
import { API_URLS } from "../config/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const adminGetJobPosts = async (page = 1, limit = 20) => {
    const res = await axios.get(`${API_URLS.JOB_POST}/admin/job-posts`, {
        params: { page, limit },
        headers: getAuthHeader(),
    });
    return res.data;
};

export const adminWarnBrandPost = async (postId, reason) => {
    const res = await axios.post(
        `${API_URLS.JOB_POST}/admin/job-posts/${postId}/warn`,
        { reason },
        { headers: getAuthHeader() }
    );
    return res.data;
};

export const adminDeleteJobPost = async (postId) => {
    const res = await axios.delete(
        `${API_URLS.JOB_POST}/admin/job-posts/${postId}`,
        { headers: getAuthHeader() }
    );
    return res.data;
};
