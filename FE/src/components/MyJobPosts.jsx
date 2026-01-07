import { useEffect, useState } from "react";
import axios from "axios";
import { CreateJobPostModal } from "./CreateJobPostModal";

export function MyJobPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      if (!token) {
        setPosts([]);
        return;
      }
      const res = await axios.get(
        "http://localhost:3000/api/brand/job-post",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(res.data.posts || []);
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
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) {
      return;
    }
    try {
      await axios.delete(
        `http://localhost:3000/api/brand/job-post/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPosts();
    } catch (err) {
      console.error("Delete job post error:", err);
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
                <h3>{post.title}</h3>
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
              <div className="brand-cv-actions">
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


