import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";

export function RecommendedBrands() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [appliedPosts, setAppliedPosts] = useState(new Set()); // Track các bài đã ứng tuyển
  const token = localStorage.getItem("token");

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URLS.JOB_POST}/job-posts?page=${page}&limit=8`
      );
      setPosts(res.data.posts || []);
      setPagination(res.data.pagination || {});

      // Fetch danh sách đã ứng tuyển để check
      if (token) {
        try {
          const appliedRes = await axios.get(
            `${API_URLS.APPLICATION}/creator/applications`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const appliedIds = new Set(
            (appliedRes.data.applications || []).map((app) => app.jobPost._id)
          );
          setAppliedPosts(appliedIds);
        } catch (err) {
          console.error("Fetch applied posts error:", err);
        }
      }

      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch job posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="brand-section-loading">Đang tải danh sách tuyển dụng...</div>;
  }

  return (
    <div className="brand-news">
      <h2 className="brand-section-title">TUYỂN DỤNG ĐỀ XUẤT</h2>

      {posts.length === 0 ? (
        <div className="brand-empty-state">Chưa có tin tuyển dụng nào.</div>
      ) : (
        <div className="brand-news-list">
          {posts.map((post) => {
            const isApplied = appliedPosts.has(post._id);
            return (
              <Link
                key={post._id}
                to={`/creator/news/${post._id}`}
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
                {isApplied && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: "4px 12px",
                      backgroundColor: "rgba(34,197,94,0.2)",
                      color: "#86efac",
                      borderRadius: 6,
                      fontSize: "0.85rem",
                      display: "inline-block",
                    }}
                  >
                    ✓ Đã ứng tuyển
                  </div>
                )}
              </Link>
            );
          })}
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

