import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/agency-detail.css";

export default function AgencyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/home/agencies/${id}`
        );
        setAgency(res.data);
      } catch (error) {
        console.error("Error fetching agency:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgency();
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

  if (!agency) {
    return (
      <div className="agency-detail-page">
        <Header />
        <div className="agency-detail-not-found">
          <h2>Không tìm thấy Agency</h2>
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
            <h1 className="agency-detail-hero__title">{agency.name}</h1>
            <div className="agency-detail-hero__subtitle">
              {agency.rank} - Agency/Brand nổi bật
            </div>
          </div>
        </section>

        {/* Khối nội dung chia 2 cột */}
        <section className="agency-detail-content">
          <div className="agency-detail-content__container">
            {/* Cột trái: Hình ảnh lớn + thứ hạng */}
            <div className="agency-detail-content__left">
              <div className="agency-detail-image-wrapper">
                <img
                  src={agency.image}
                  alt={agency.name}
                  className="agency-detail-image"
                />
                <div className="agency-detail-rank-badge">
                  <span className="agency-detail-rank-text">{agency.rank}</span>
                </div>
              </div>
            </div>

            {/* Cột phải: Nội dung chữ dài giới thiệu */}
            <div className="agency-detail-content__right">
              <div className="agency-detail-story">
                <h2 className="agency-detail-story__title">Câu chuyện của chúng tôi</h2>
                <div className="agency-detail-story__content">
                  {agency.description ? (
                    <p>{agency.description}</p>
                  ) : (
                    <div>
                      <p>
                        {agency.name} là một trong những Agency/Brand hàng đầu trong lĩnh vực
                        của chúng tôi, được công nhận với vị trí {agency.rank} trong bảng xếp
                        hạng tuần này.
                      </p>
                      <p>
                        Với sự cam kết không ngừng về chất lượng và sáng tạo, chúng tôi đã xây
                        dựng được một cộng đồng mạnh mẽ và tạo ra những giá trị bền vững cho
                        khách hàng và đối tác.
                      </p>
                      <p>
                        Thành tích của chúng tôi không chỉ đến từ những con số, mà còn từ sự
                        tin tưởng và hài lòng của hàng nghìn khách hàng đã đồng hành cùng chúng
                        tôi trên hành trình phát triển.
                      </p>
                      <p>
                        Chúng tôi tự hào về những gì đã đạt được và luôn hướng tới tương lai với
                        tầm nhìn rõ ràng và đam mê không ngừng nghỉ.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="agency-detail-achievements">
                <h3 className="agency-detail-achievements__title">Thành tích nổi bật</h3>
                <ul className="agency-detail-achievements__list">
                  <li>Vị trí {agency.rank} trong bảng xếp hạng tuần này</li>
                  <li>Được công nhận là Agency/Brand nổi bật</li>
                  <li>Cam kết chất lượng và sáng tạo không ngừng</li>
                  <li>Xây dựng cộng đồng mạnh mẽ và bền vững</li>
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
