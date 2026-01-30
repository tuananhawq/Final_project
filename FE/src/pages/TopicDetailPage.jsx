import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import "../styles/agency-detail.css";

export default function TopicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

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
        <div className="agency-detail-loading">{t("topicDetail.loading")}</div>
        <Footer />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="agency-detail-page">
        <Header />
        <div className="agency-detail-not-found">
          <h2>{t("topicDetail.notFound")}</h2>
          <button onClick={() => navigate("/")}>{t("topicDetail.backHome")}</button>
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
              {t("topicDetail.favoriteSubtitle")}
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
                  <span className="agency-detail-rank-text">{t("topicDetail.hot")}</span>
                </div>
              </div>
            </div>

            {/* Cột phải: Nội dung chữ dài giới thiệu */}
            <div className="agency-detail-content__right">
              <div className="agency-detail-story">
                <h2 className="agency-detail-story__title">{t("topicDetail.about")}</h2>
                <div className="agency-detail-story__content">
                  {topic.description ? (
                    <p>{topic.description}</p>
                  ) : (
                    <div>
                      <p>
                        {topic.title} {t("topicDetail.descriptionDefault1")}
                      </p>
                      <p>
                        {t("topicDetail.descriptionDefault2")}
                      </p>
                      <p>
                        {t("topicDetail.descriptionDefault3", { title: topic.title }).replace("{title}", topic.title)}
                      </p>
                      <p>
                        {t("topicDetail.descriptionDefault4")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="agency-detail-achievements">
                <h3 className="agency-detail-achievements__title">{t("topicDetail.features")}</h3>
                <ul className="agency-detail-achievements__list">
                  <li>{t("topicDetail.feature1")}</li>
                  <li>{t("topicDetail.feature2")}</li>
                  <li>{t("topicDetail.feature3")}</li>
                  <li>{t("topicDetail.feature4")}</li>
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

