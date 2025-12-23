import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getBlogs, getFeaturedBlogs } from "../services/blogService.jsx";
import { FaEye, FaHeart, FaStar, FaCalendarAlt } from "react-icons/fa";
import "../styles/blog/blog-list.css";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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
              Blog & <span className="blog-hero__title-gradient">News</span>
            </h1>
            <p className="blog-hero__subtitle">
              Khám phá những bài viết mới nhất và tin tức nổi bật
            </p>
          </div>
        </section>

        {/* Featured Blogs */}
        {featuredBlogs.length > 0 && (
          <section className="blog-featured">
            <div className="blog-featured__container">
              <h2 className="blog-featured__title">Bài viết nổi bật</h2>
              <div className="blog-featured__grid">
                {featuredBlogs.map((blog, index) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog._id}`}
                    className={`blog-featured__card ${
                      index === 1 ? "blog-featured__card--center" : ""
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
                      <div className="blog-featured__badge">Nổi bật</div>
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

        {/* Search Bar */}
        <section className="blog-search">
          <div className="blog-search__container">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="blog-search__input"
            />
          </div>
        </section>

        {/* Blog Grid */}
        <section className="blog-list">
          <div className="blog-list__container">
            {loading ? (
              <div className="blog-list__loading">Đang tải...</div>
            ) : blogs.length === 0 ? (
              <div className="blog-list__empty">Không có bài viết nào</div>
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
                          <div className="blog-list__badge">Nổi bật</div>
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
                      Trước
                    </button>
                    <span className="blog-list__pagination-info">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="blog-list__pagination-btn"
                    >
                      Sau
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

