import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/agency-detail.css";

export default function TestimonialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/home/testimonials/${id}`
        );
        setTestimonial(res.data);
      } catch (error) {
        console.error("Error fetching testimonial:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTestimonial();
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

  if (!testimonial) {
    return (
      <div className="agency-detail-page">
        <Header />
        <div className="agency-detail-not-found">
          <h2>Không tìm thấy Testimonial</h2>
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
            <h1 className="agency-detail-hero__title">Đánh giá từ {testimonial.name}</h1>
            <div className="agency-detail-hero__subtitle">
              {testimonial.role}
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
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="agency-detail-image"
                  style={{ borderRadius: "50%" }}
                />
                <div className="agency-detail-rank-badge" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                  <span className="agency-detail-rank-text">⭐</span>
                </div>
              </div>
            </div>

            {/* Cột phải: Nội dung đánh giá */}
            <div className="agency-detail-content__right">
              <div className="agency-detail-story">
                <h2 className="agency-detail-story__title">Đánh giá về REVLIVE</h2>
                <div className="agency-detail-story__content">
                  <p style={{ fontSize: "1.2rem", lineHeight: "1.9", fontStyle: "italic", color: "#e5e7eb" }}>
                    "{testimonial.content}"
                  </p>
                </div>
              </div>

              <div className="agency-detail-achievements">
                <h3 className="agency-detail-achievements__title">Thông tin người đánh giá</h3>
                <ul className="agency-detail-achievements__list">
                  <li>Tên: {testimonial.name}</li>
                  <li>Vai trò: {testimonial.role}</li>
                  <li>Đã sử dụng dịch vụ REVLIVE</li>
                  <li>Chia sẻ trải nghiệm thực tế</li>
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
