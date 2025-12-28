// src/pages/HighlightDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getBannerDetail } from "../services/bannerService";
import "../styles/home/highlight-detail.css";

export default function HighlightDetail() {
  const { id } = useParams();

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getBannerDetail(id)
      .then((data) => {
        setBanner(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);


  if (loading) return <div className="detail-loading">Đang tải chi tiết...</div>;
  if (!banner) return <div className="detail-notfound">Không tìm thấy bài viết</div>;

  const handleLike = () => {
    // Sau này gọi API tăng like
    setBanner({ ...banner, likes: banner.likes + 1 });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      username: "Bạn", // Sau này lấy từ user login
      avatar: "",
      content: comment,
      createdAt: new Date(),
    };

    setBanner({
      ...banner,
      comments: [newComment, ...banner.comments],
    });
    setComment("");
  };

  return (
    <div className="highlight-detail-page">
      <Header />
      <main className="detail-main">
        <div className="container">
          {/* Title giống trang Home */}
          <div className="detail-title-outer">
            <span className="detail-line-left"></span>
            <h1 className="detail-title">{banner.title}</h1>
            <span className="detail-line-right"></span>
          </div>

          {/* Ảnh lớn */}
          <div className="detail-image-wrapper">
            <img src={banner.image} alt={banner.title} className="detail-image" />
          </div>

          {/* Description */}
          <div className="detail-description">
            <p>{banner.description}</p>
          </div>

          {/* Like & Comment Section */}
          <div className="detail-interaction">
            <button onClick={handleLike} className="like-btn">
              ❤️ {banner.likes} Thích
            </button>

            <form onSubmit={handleComment} className="comment-form">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="comment-input"
              />
              <button type="submit" className="comment-submit">Gửi</button>
            </form>

            {/* Danh sách bình luận */}
            <div className="comments-list">
              {banner.comments.length === 0 ? (
                <p className="no-comment">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              ) : (
                banner.comments.map((cmt, i) => (
                  <div key={i} className="comment-item">
                    <strong>{cmt.username}</strong>
                    <p>{cmt.content}</p>
                    <small>{new Date(cmt.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link to="/" className="back-home">← Quay lại trang chủ</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}