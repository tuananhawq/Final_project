import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  getBlogById,
  likeBlog,
  rateBlog,
  addComment,
  deleteComment,
} from "../services/blogService.jsx";
import { FaHeart, FaStar, FaEye, FaCalendarAlt, FaUser } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "../styles/blog/blog-detail.css";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadBlog();
    checkUser();
  }, [id]);

  const checkUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.userId || decoded.id,
          username: decoded.username,
          roles: decoded.roles || [],
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlogById(id);
      
      if (!data || data.error) {
        setBlog(null);
        return;
      }
      
      setBlog(data);

      // Check if user liked this blog
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userId = decoded.userId || decoded.id;
          
          // Check like status
          if (data.likes && Array.isArray(data.likes)) {
            setIsLiked(
              data.likes.some((like) => {
                const likeId = typeof like === 'object' ? like._id || like : like;
                return likeId.toString() === userId;
              })
            );
          }
          
          // Check user rating
          if (data.ratings && Array.isArray(data.ratings)) {
            const userRatingObj = data.ratings.find((r) => {
              const ratingUserId = typeof r.userId === 'object' ? r.userId._id || r.userId : r.userId;
              return ratingUserId.toString() === userId;
            });
            if (userRatingObj) {
              setUserRating(userRatingObj.rating);
            }
          }
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      if (error.message === "Blog not found" || error.response?.status === 404) {
        setBlog(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const result = await likeBlog(id);
      setIsLiked(result.isLiked);
      setBlog((prev) => ({
        ...prev,
        likes: result.likes,
      }));
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleRate = async (rating) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const result = await rateBlog(id, rating);
      setUserRating(rating);
      setBlog((prev) => {
        const existingRatingIndex = prev.ratings?.findIndex((r) => {
          const rUserId = typeof r.userId === 'object' ? r.userId._id || r.userId : r.userId;
          return rUserId.toString() === user.id;
        });

        let newRatings = [...(prev.ratings || [])];
        if (existingRatingIndex >= 0) {
          newRatings[existingRatingIndex] = { ...newRatings[existingRatingIndex], rating };
        } else {
          newRatings.push({ userId: user.id, rating });
        }

        return {
          ...prev,
          averageRating: result.averageRating,
          ratings: newRatings,
        };
      });
    } catch (error) {
      console.error("Error rating blog:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) return;

    try {
      setSubmitting(true);
      const newComment = await addComment(id, commentContent);
      setBlog((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
      setCommentContent("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      await deleteComment(id, commentId);
      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="blog-page">
        <Header />
        <div className="blog-detail__loading">Đang tải...</div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-page">
        <Header />
        <div className="blog-detail__error">Không tìm thấy bài viết</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="blog-page">
      <Header />
      <main className="blog-detail">
        <article className="blog-detail__article">
          {/* Header */}
          <header className="blog-detail__header">
            {blog.featured && (
              <div className="blog-detail__badge">Bài viết nổi bật</div>
            )}
            <h1 className="blog-detail__title">{blog.title}</h1>
            <div className="blog-detail__meta">
              <div className="blog-detail__meta-left">
                <span className="blog-detail__author">
                  <FaUser /> {blog.authorName || blog.author?.username}
                </span>
                <span className="blog-detail__date">
                  <FaCalendarAlt /> {formatDate(blog.publishedAt)}
                </span>
              </div>
              <div className="blog-detail__meta-right">
                <span className="blog-detail__views">
                  <FaEye /> {blog.views || 0} lượt xem
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="blog-detail__image-wrapper">
            <img
              src={blog.image || "http://localhost:3000/uploads/default.jpg"}
              alt={blog.title}
              className="blog-detail__image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
              }}
            />
          </div>

          {/* Content */}
          <div className="blog-detail__content">
            {blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              <p style={{ whiteSpace: "pre-wrap" }}>{blog.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="blog-detail__actions">
            <button
              onClick={handleLike}
              className={`blog-detail__like-btn ${isLiked ? "blog-detail__like-btn--liked" : ""}`}
            >
              <FaHeart /> {blog.likes?.length || 0} Like
            </button>

            <div className="blog-detail__rating">
              <span className="blog-detail__rating-label">Đánh giá:</span>
              <div className="blog-detail__stars">
                {[1, 2, 3, 4, 5].map((star) => {
                  const avgRating = parseFloat(blog.averageRating || 0);
                  const displayRating = userRating || avgRating;
                  return (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className={`blog-detail__star ${
                        star <= displayRating ? "blog-detail__star--active" : ""
                      }`}
                    >
                      <FaStar />
                    </button>
                  );
                })}
              </div>
              {(blog.averageRating > 0 || blog.ratings?.length > 0) && (
                <span className="blog-detail__rating-value">
                  {blog.averageRating || "0.0"} ({blog.ratings?.length || 0} đánh giá)
                </span>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <section className="blog-detail__comments">
            <h2 className="blog-detail__comments-title">
              Bình luận ({blog.comments?.length || 0})
            </h2>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="blog-detail__comment-form">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  className="blog-detail__comment-input"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="blog-detail__comment-submit"
                >
                  {submitting ? "Đang gửi..." : "Gửi bình luận"}
                </button>
              </form>
            ) : (
              <div className="blog-detail__comment-login">
                <p>Vui lòng đăng nhập để bình luận</p>
                <button
                  onClick={() => navigate("/login")}
                  className="blog-detail__login-btn"
                >
                  Đăng nhập
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="blog-detail__comments-list">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment) => {
                  const commentUserId = typeof comment.userId === 'object' 
                    ? comment.userId._id || comment.userId 
                    : comment.userId;
                  
                  const canDelete =
                    user &&
                    (commentUserId === user.id ||
                      (user.roles && (user.roles.includes("staff") || user.roles.includes("admin"))));

                  return (
                    <div key={comment._id} className="blog-detail__comment">
                      <div className="blog-detail__comment-header">
                        <span className="blog-detail__comment-author">
                          {comment.username}
                        </span>
                        <span className="blog-detail__comment-date">
                          {formatDate(comment.createdAt)}
                        </span>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="blog-detail__comment-delete"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <p className="blog-detail__comment-content">{comment.content}</p>
                    </div>
                  );
                })
              ) : (
                <p className="blog-detail__no-comments">Chưa có bình luận nào</p>
              )}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

