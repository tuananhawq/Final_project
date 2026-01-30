import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { CreateJobPostModal } from "../components/CreateJobPostModal.jsx";
import { checkPaymentStatus } from "../services/paymentService.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import "../styles/job/job-posts.css";

export default function JobPostsPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const [canPost, setCanPost] = useState(false);
  const navigate = useNavigate();
  const { notifyError, notifyInfo } = useNotification();
  const { t } = useLanguage();

  // Kiểm tra quyền đăng bài (chỉ brand có gói 499k)
  useEffect(() => {
    const checkPermission = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCanPost(false);
        return;
      }

      try {
        // Lấy thông tin user
        const userRes = await axios.get(`${API_URLS.AUTH}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUser = userRes.data.user;
        setUser(currentUser);

        // Kiểm tra có phải brand không
        if (!currentUser.roles?.includes("brand")) {
          setCanPost(false);
          return;
        }

        // Kiểm tra payment status
        const paymentStatus = await checkPaymentStatus();

        // Kiểm tra có transaction với amount >= 499000 không
        if (paymentStatus.latestTransaction) {
          const { plan, amount, status } = paymentStatus.latestTransaction;
          if (plan === "brand" && amount >= 499000 && status === "completed") {
            setCanPost(true);
            return;
          }
        }

        // Kiểm tra tất cả transactions để tìm gói premium
        const transactionsRes = await axios.get(`${API_URLS.PAYMENT}/transactions/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const hasPremiumPackage = transactionsRes.data.transactions?.some(
          (t) => t.plan === "brand" && t.amount >= 499000 && t.status === "completed"
        );

        setCanPost(hasPremiumPackage || false);
      } catch (err) {
        console.error("Check permission error:", err);
        setCanPost(false);
      }
    };

    checkPermission();
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URLS.JOB_POST}/job-posts?page=${page}&limit=12`
      );
      setPosts(res.data.posts || []);
      setPagination(res.data.pagination || {});
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch job posts error:", err);
      notifyError(t("jobPosts.fetchError") || "Không thể tải danh sách tin tuyển dụng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleCreateSuccess = () => {
    fetchPosts(currentPage);
    notifyInfo(t("jobPosts.createSuccess"));
  };

  const handleCreateClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notifyInfo(t("jobPosts.loginRequired"));
      navigate("/login");
      return;
    }

    if (!user?.roles?.includes("brand")) {
      notifyError(t("jobPosts.brandRequired"));
      return;
    }

    if (!canPost) {
      notifyInfo(t("jobPosts.premiumRequired"));
      navigate("/pricing");
      return;
    }

    setShowCreateModal(true);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="job-posts-page">
        <Header />
        <div className="job-posts-loading">{t("legal.loading")}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="job-posts-page">
      <Header />
      <div style={{ height: "80px" }}></div>
      <div className="job-posts-container">
        <div className="job-posts-header">
          <h1 className="job-posts-title">{t("jobPosts.title")}</h1>
          <p className="job-posts-subtitle">
            {t("jobPosts.subtitle")}
          </p>

          {/* Nút đăng bài - chỉ hiện cho brand có gói 499k */}
          {canPost && (
            <button
              className="job-posts-create-btn"
              onClick={handleCreateClick}
            >
              + {t("jobPosts.create")}
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="job-posts-empty">
            <p>{t("jobPosts.empty")}</p>
            {canPost && (
              <button
                className="job-posts-create-btn"
                onClick={handleCreateClick}
                style={{ marginTop: "16px" }}
              >
                {t("jobPosts.createFirst")}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="job-posts-grid">
              {posts.map((post) => {
                // Kiểm tra nếu là user thuần thì redirect sang pricing
                const handlePostClick = (e) => {
                  if (user && user.roles?.includes("user") &&
                    !user.roles?.includes("creator") && !user.roles?.includes("brand")) {
                    e.preventDefault();
                    notifyInfo(t("jobPosts.creatorRequired"));
                    navigate("/pricing");
                  }
                };

                return (
                  <Link
                    key={post._id}
                    to={`/creator/news/${post._id}`}
                    className="job-post-card"
                    onClick={handlePostClick}
                  >
                    <div className="job-post-header">
                      <span className="job-post-brand">{post.brandName}</span>
                      <span className="job-post-type">{post.jobType}</span>
                    </div>
                    <h3 className="job-post-title">{post.title}</h3>
                    <div className="job-post-meta">
                      <span className="job-post-date">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      <span className="job-post-budget">{post.budget}</span>
                      <span className="job-post-time">{post.workTime}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Phân trang */}
            {pagination.totalPages > 1 && (
              <div className="job-posts-pagination">
                <button
                  onClick={() => fetchPosts(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  ‹ {t("jobPosts.prev")}
                </button>
                <span>
                  {t("jobPosts.page")} {currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchPosts(currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  {t("jobPosts.next")} ›
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal đăng tin tuyển dụng */}
      {showCreateModal && (
        <CreateJobPostModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSaved={handleCreateSuccess}
        />
      )}

      <Footer />
    </div>
  );
}

