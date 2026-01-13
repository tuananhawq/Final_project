import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/agency-detail.css";

export default function TopicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await axios.get(
          `${API_URLS.HOME}/topics/${id}`
        );
        setTopic(res.data);
      } catch (error) {
        console.error("Error fetching topic:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTopic();
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

  if (!topic) {
    return (
      <div className="agency-detail-page">
        <Header />
        <div className="agency-detail-not-found">
          <h2>Không tìm thấy Chủ đề</h2>
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
            <h1 className="agency-detail-hero__title">{topic.title}</h1>
            <div className="agency-detail-hero__subtitle">
              Chủ đề yêu thích trong tuần
            </div>
          </div>
        </section>

        {/* Khối nội dung chia 2 cột */}
        <section className="agency-detail-content">
          <div className="agency-detail-content__container">
            {/* Cột trái: Hình ảnh lớn */}
            <div className="agency-detail-content__left">
              <div className="agency-detail-image-wrapper">
                <img
                  src={topic.image}
                  alt={topic.title}
                  className="agency-detail-image"
                />
                <div className="agency-detail-rank-badge" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                  <span className="agency-detail-rank-text">HOT</span>
                </div>
              </div>
            </div>

            {/* Cột phải: Nội dung chữ dài giới thiệu */}
            <div className="agency-detail-content__right">
              <div className="agency-detail-story">
                <h2 className="agency-detail-story__title">Về chủ đề này</h2>
                <div className="agency-detail-story__content">
                  {topic.description ? (
                    <p>{topic.description}</p>
                  ) : (
                    <div>
                      <p>
                        {topic.title} là một trong những chủ đề được yêu thích nhất trong tuần này,
                        thu hút sự quan tâm của đông đảo cộng đồng.
                      </p>
                      <p>
                        Chủ đề này mang đến những góc nhìn mới mẻ, sáng tạo và đầy cảm hứng,
                        giúp người xem khám phá và trải nghiệm những điều thú vị.
                      </p>
                      <p>
                        Với sự đa dạng và phong phú về nội dung, {topic.title} đã trở thành
                        điểm đến lý tưởng cho những ai đam mê khám phá và học hỏi.
                      </p>
                      <p>
                        Chúng tôi tự hào được chia sẻ và lan tỏa những giá trị tích cực
                        thông qua chủ đề này đến với cộng đồng.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="agency-detail-achievements">
                <h3 className="agency-detail-achievements__title">Đặc điểm nổi bật</h3>
                <ul className="agency-detail-achievements__list">
                  <li>Chủ đề được yêu thích trong tuần</li>
                  <li>Nội dung đa dạng và phong phú</li>
                  <li>Mang đến góc nhìn mới mẻ và sáng tạo</li>
                  <li>Thu hút sự quan tâm của cộng đồng</li>
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
