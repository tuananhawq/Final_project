import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import "../styles/agency-detail.css";

export default function AgencyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const res = await axios.get(
          `${API_URLS.HOME}/agencies/${id}`
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
        <div className="agency-detail-loading">{t("agencyDetail.loading")}</div>
        <Footer />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="agency-detail-page">
        <Header />
        <div className="agency-detail-not-found">
          <h2>{t("agencyDetail.notFound")}</h2>
          <button onClick={() => navigate("/")}>{t("agencyDetail.backHome")}</button>
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
              {t("agencyDetail.subtitle").replace("{rank}", agency.rank)}
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
                <h2 className="agency-detail-story__title">{t("agencyDetail.story")}</h2>
                <div className="agency-detail-story__content">
                  {agency.description ? (
                    <p>{agency.description}</p>
                  ) : (
                    <div>
                      <p>
                        {t("agencyDetail.defaultDesc1").replace("{name}", agency.name).replace("{rank}", agency.rank)}
                      </p>
                      <p>
                        {t("agencyDetail.defaultDesc2")}
                      </p>
                      <p>
                        {t("agencyDetail.defaultDesc3")}
                      </p>
                      <p>
                        {t("agencyDetail.defaultDesc4")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="agency-detail-achievements">
                <h3 className="agency-detail-achievements__title">{t("agencyDetail.achievements")}</h3>
                <ul className="agency-detail-achievements__list">
                  <li>{t("agencyDetail.rankItem").replace("{rank}", agency.rank)}</li>
                  <li>{t("agencyDetail.recognized")}</li>
                  <li>{t("agencyDetail.commitment")}</li>
                  <li>{t("agencyDetail.community")}</li>
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

