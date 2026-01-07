import { useEffect, useState } from "react";
import axios from "axios";

export function BrandNews() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/job-posts?page=${page}&limit=8`
      );
      setPosts(res.data.posts || []);
      setPagination(res.data.pagination || {});
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch job posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/job-posts/${id}`
      );
      setSelectedPost(res.data.post);
    } catch (err) {
      console.error("Fetch job post detail error:", err);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  if (loading) {
    return <div className="brand-section-loading">Đang tải bảng tin...</div>;
  }

  return (
    <div className="brand-news">
      <h2 className="brand-section-title">BẢNG TIN TUYỂN DỤNG</h2>

      {posts.length === 0 ? (
        <div className="brand-empty-state">Chưa có tin tuyển dụng nào.</div>
      ) : (
        <div className="brand-news-list">
          {posts.map((post) => (
            <div
              key={post._id}
              className="brand-news-item"
              onClick={() => fetchDetail(post._id)}
            >
              <div className="brand-news-header">
                <span className="brand-name">{post.brandName}</span>
                <span className="job-type">{post.jobType}</span>
              </div>
              <h3 className="job-title">{post.title}</h3>
              <div className="brand-news-meta">
                <span>
                  {new Date(post.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="budget">{post.budget}</span>
                <span className="work-time">{post.workTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="brand-pagination">
          <button
            onClick={() => fetchPosts(currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            ‹ Trước
          </button>
          <span>
            Trang {currentPage} / {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchPosts(currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Sau ›
          </button>
        </div>
      )}

      {selectedPost && (
        <div
          className="brand-modal-overlay"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="brand-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>{selectedPost.title}</h3>
            <p className="brand-modal-brand">
              {selectedPost.brandName} · {selectedPost.jobType} ·{" "}
              {selectedPost.workTime}
            </p>
            <p className="brand-modal-budget">{selectedPost.budget}</p>
            <div className="brand-modal-section">
              <h4>Nội dung công việc</h4>
              <p>{selectedPost.content}</p>
            </div>
            <div className="brand-modal-section">
              <h4>Yêu cầu ứng viên</h4>
              <p>{selectedPost.requirements}</p>
            </div>
            <div className="brand-modal-section">
              <h4>Quyền lợi / Hỗ trợ từ Brand</h4>
              <p>{selectedPost.benefits}</p>
            </div>
            <button
              className="brand-modal-close"
              onClick={() => setSelectedPost(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


