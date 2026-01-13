import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export function BrandNews() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
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
            <Link
              key={post._id}
              to={`/brand/news/${post._id}`}
              className="brand-news-item"
              style={{ textDecoration: "none", color: "inherit" }}
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
            </Link>
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

    </div>
  );
}


