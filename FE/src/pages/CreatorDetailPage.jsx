import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/agency-detail.css";

export default function CreatorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/home/creators/${id}`
        );
        setCreator(res.data);
      } catch (error) {
        console.error("Error fetching creator:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCreator();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="agency-detail-page">
        <Header />
        <div className="agency-detail-loading">Đang tải...</div>
        <Footer />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="agency-detail-page">
        <Header />
        <div className="agency-detail-not-found">
          <h2>Không tìm thấy Creator</h2>
          <button onClick={() => navigate("/")}>Về trang chủ</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="agency-detail-page">
      <Header />

      <main className="agency-detail-main">
        {/* Section nổi bật với tiêu đề lớn căn giữa */}
        <section className="agency-detail-hero">
          <div className="agency-detail-hero__container">
            <h1 className="agency-detail-hero__title">{creator.name}</h1>
            <div className="agency-detail-hero__subtitle">
              Creator / Host nổi bật
              {creator.followers && ` - ${creator.followers} followers`}
            </div>
          </div>
        </section>

        {/* Khối nội dung chia 2 cột */}
        <section className="agency-detail-content">
          <div className="agency-detail-content__container">
            {/* Cột trái: Avatar lớn */}
            <div className="agency-detail-content__left">
              <div className="agency-detail-image-wrapper">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="agency-detail-image"
                  style={{ borderRadius: "50%" }}
                />
                {creator.followers && (
                  <div className="agency-detail-rank-badge" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" }}>
                    <span className="agency-detail-rank-text">{creator.followers}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cột phải: Nội dung chữ dài giới thiệu */}
            <div className="agency-detail-content__right">
              <div className="agency-detail-story">
                <h2 className="agency-detail-story__title">Câu chuyện của chúng tôi</h2>
                <div className="agency-detail-story__content">
                  <p>{creator.description}</p>
                </div>
              </div>

              <div className="agency-detail-achievements">
                <h3 className="agency-detail-achievements__title">Thành tích nổi bật</h3>
                <ul className="agency-detail-achievements__list">
                  {creator.followers && (
                    <li>Hơn {creator.followers} followers trên các nền tảng</li>
                  )}
                  <li>Được công nhận là Creator/Host nổi bật</li>
                  <li>Cam kết tạo ra nội dung chất lượng và sáng tạo</li>
                  <li>Xây dựng cộng đồng mạnh mẽ và tích cực</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
