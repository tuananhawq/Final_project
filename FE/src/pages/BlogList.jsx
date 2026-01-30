import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getBlogs, getFeaturedBlogs } from "../services/blogService.jsx";
import { FaEye, FaHeart, FaStar, FaCalendarAlt, FaPlus } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import "../styles/blog/blog-list.css";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { notifyInfo } = useNotification();

  // Check user role
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  // Check if user can see the create blog button (any logged-in user except admin/staff)
  const canPostBlog = () => {
    if (!user) return false;
    const roles = user.roles || [];
    // Admin và staff không thấy nút tạo blog ở đây
    return roles.includes("user") ||
      roles.includes("creator") ||
      roles.includes("brand");
  };

  const handleCreateBlog = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const roles = user?.roles || [];

    // Nếu user chỉ có role "user" (không có creator hoặc brand)
    // thì chuyển về trang pricing với thông báo
    if (roles.includes("user") && !roles.includes("creator") && !roles.includes("brand")) {
      notifyInfo(t("blog.upgradeRequired"));
      navigate("/pricing");
      return;
    }

    // Navigate to my-blogs page with create mode (for creator/brand)
    navigate("/my-blogs?create=true");
  };

  useEffect(() => {
    loadBlogs();
    loadFeaturedBlogs();
  }, [currentPage, searchTerm]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs({
        page: currentPage,
        limit: 9,
        search: searchTerm || undefined,
      });
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedBlogs = async () => {
    try {
      const data = await getFeaturedBlogs();
      setFeaturedBlogs(data || []);
    } catch (error) {
      console.error("Error loading featured blogs:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="blog-page">
      <Header />
      <main className="blog-main">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="blog-hero__content">
            <h1 className="blog-hero__title">
              {t("blogList.heroTitle")} <span className="blog-hero__title-gradient">{t("blogList.heroTitleGradient")}</span>
            </h1>
            <p className="blog-hero__subtitle">
              {t("blogList.heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Featured Blogs */}
        {featuredBlogs.length > 0 && (
          <section className="blog-featured">
            <div className="blog-featured__container">
              <h2 className="blog-featured__title">{t("blogList.featuredPosts")}</h2>
              <div className="blog-featured__grid">
                {featuredBlogs.map((blog, index) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog._id}`}
                    className={`blog-featured__card ${index === 1 ? "blog-featured__card--center" : ""
                      }`}
                  >
                    <div className="blog-featured__image-wrapper">
                      <img
                        src={blog.image || "https://via.placeholder.com/400x250?text=No+Image"}
                        alt={blog.title}
                        className="blog-featured__image"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                        }}
                      />
                      <div className="blog-featured__badge">{t("blogList.featuredBadge")}</div>
                    </div>
                    <div className="blog-featured__content">
                      <h3 className="blog-featured__title-text">{blog.title}</h3>
                      <p className="blog-featured__excerpt">
                        {blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>/g, "").substring(0, 150) + "..." : "")}
                      </p>
                      <div className="blog-featured__meta">
                        <span className="blog-featured__author">
                          {blog.authorName || blog.author?.username}
                        </span>
                        <span className="blog-featured__date">
                          <FaCalendarAlt /> {formatDate(blog.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search Bar & Create Button */}
        <section className="blog-search">
          <div className="blog-search__container">
            <input
              type="text"
              placeholder={t("common.search") + "..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="blog-search__input"
            />
            {canPostBlog() && (
              <button
                onClick={handleCreateBlog}
                className="blog-create-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.3)";
                }}
              >
                <FaPlus />
                {t("blog.addNew")}
              </button>
            )}
          </div>
        </section>

        {/* Blog Grid */}
        <section className="blog-list">
          <div className="blog-list__container">
            {loading ? (
              <div className="blog-list__loading">{t("common.loading")}</div>
            ) : blogs.length === 0 ? (
              <div className="blog-list__empty">{t("blogList.noBlogs")}</div>
            ) : (
              <>
                <div className="blog-list__grid">
                  {blogs.map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blog/${blog._id}`}
                      className="blog-list__card"
                    >
                      <div className="blog-list__image-wrapper">
                        <img
                          src={blog.image || "https://via.placeholder.com/400x200?text=No+Image"}
                          alt={blog.title}
                          className="blog-list__image"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                          }}
                        />
                        {blog.featured && (
                          <div className="blog-list__badge">{t("blogList.featuredBadge")}</div>
                        )}
                      </div>
                      <div className="blog-list__content">
                        <h3 className="blog-list__title">{blog.title}</h3>
                        <p className="blog-list__excerpt">
                          {blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>/g, "").substring(0, 120) + "..." : "")}
                        </p>
                        <div className="blog-list__meta">
                          <div className="blog-list__meta-left">
                            <span className="blog-list__author">
                              {blog.authorName || blog.author?.username}
                            </span>
                            <span className="blog-list__date">
                              <FaCalendarAlt /> {formatDate(blog.publishedAt)}
                            </span>
                          </div>
                          <div className="blog-list__meta-right">
                            <span className="blog-list__views">
                              <FaEye /> {blog.views || 0}
                            </span>
                            <span className="blog-list__likes">
                              <FaHeart /> {blog.likes?.length || 0}
                            </span>
                            {blog.averageRating > 0 && (
                              <span className="blog-list__rating">
                                <FaStar /> {blog.averageRating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="blog-list__pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="blog-list__pagination-btn"
                    >
                      {t("blogList.prev")}
                    </button>
                    <span className="blog-list__pagination-info">
                      {t("blogList.page")} {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="blog-list__pagination-btn"
                    >
                      {t("blogList.next")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

