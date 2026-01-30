import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { CreateJobPostModal } from "./CreateJobPostModal";
import { ApplicationManagement } from "./ApplicationManagement";
import { useNotification } from "../context/NotificationContext.jsx";

export function MyJobPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [applicationCounts, setApplicationCounts] = useState({});

  const token = localStorage.getItem("token");
  const { confirm, notifySuccess, notifyError } = useNotification();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      if (!token) {
        setPosts([]);
        return;
      }
      const res = await axios.get(
        `${API_URLS.JOB_POST}/brand/job-post`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const postsData = res.data.posts || [];
      setPosts(postsData);

      // Fetch số lượng ứng viên cho mỗi bài đăng
      const counts = {};
      for (const post of postsData) {
        try {
          const appRes = await axios.get(
            `${API_URLS.APPLICATION}/brand/job-post/${post._id}/applications`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          counts[post._id] = appRes.data.applications?.length || 0;
        } catch (err) {
          counts[post._id] = 0;
        }
      }
      setApplicationCounts(counts);
    } catch (err) {
      console.error("Fetch my job posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const ok = await confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?");
    if (!ok) return;
    try {
      await axios.delete(
        `${API_URLS.JOB_POST}/brand/job-post/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPosts();
      notifySuccess("Đã xóa tin tuyển dụng.");
    } catch (err) {
      console.error("Delete job post error:", err);
      notifyError("Xóa tin tuyển dụng thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="brand-section-loading">
        Đang tải tin tuyển dụng của bạn...
      </div>
    );
  }

  return (
    <div className="my-job-posts">
      <div className="brand-cv-header">
        <h2 className="brand-section-title">TIN TUYỂN DỤNG CỦA TÔI</h2>
        <button className="primary-btn" onClick={openCreate}>
          + Đăng bài tuyển dụng mới
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="brand-empty-state">
          Bạn chưa đăng tin tuyển dụng nào. Hãy tạo bài đầu tiên.
        </div>
      ) : (
        <div className="brand-job-list">
          {posts.map((post) => (
            <div key={post._id} className="brand-job-card">
              <div className="brand-job-header">
                <Link
                  to={`/brand/mynews/${post._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h3 style={{ cursor: "pointer", display: "inline-block" }}>
                    {post.title}
                  </h3>
                </Link>
                <span className="job-type">{post.jobType}</span>
              </div>
              <div className="brand-job-meta">
                <span>{post.workTime}</span>
                <span className="budget">{post.budget}</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p className="brand-job-content">
                {post.content.length > 180
                  ? post.content.slice(0, 180) + "..."
                  : post.content}
              </p>
              <div style={{ marginTop: 12, marginBottom: 12 }}>
                <span
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "rgba(59,130,246,0.2)",
                    color: "#93c5fd",
                    borderRadius: 6,
                    fontSize: "0.85rem",
                  }}
                >
                  👥 {applicationCounts[post._id] || 0} ứng viên
                </span>
              </div>
              <div className="brand-cv-actions">
                <button
                  className="primary-btn"
                  onClick={() =>
                    setSelectedPostId(
                      selectedPostId === post._id ? null : post._id
                    )
                  }
                >
                  {selectedPostId === post._id
                    ? "Ẩn ứng viên"
                    : "Xem ứng viên"}
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => openEdit(post)}
                >
                  Sửa
                </button>
                <button
                  className="danger-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  Xóa
                </button>
              </div>
              {selectedPostId === post._id && (
                <div style={{ marginTop: 16 }}>
                  <ApplicationManagement jobPostId={post._id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CreateJobPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchPosts}
        initialData={editingPost}
      />
    </div>
  );
}


