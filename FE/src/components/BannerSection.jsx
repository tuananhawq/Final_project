// src/components/BannerSection.jsx
import { useEffect, useState } from "react";
import { getBanners } from "../services/bannerService";
import "../styles/home/banner-section.css";

export function BannerSection() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBanners()
      .then((data) => {
        setBanners(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Load banners failed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="banner-section loading">
        <div className="container">Đang tải nội dung nổi bật...</div>
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="banner-section">
      <div className="container">
        <h2 className="banner-title">NỔI BẬT TRONG TUẦN</h2>

        <div className="banner-grid">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`banner-card banner-rank-${index + 1}`}
            >
              <div className="banner-image-wrapper">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="banner-image"
                />
                {index < 3 && (
                  <div className="banner-rank-badge">
                    TOP {index + 1}
                  </div>
                )}
                {index === 0 && <div className="banner-crown">👑</div>}
              </div>

              <div className="banner-content">
                <h3 className="banner-card-title">{banner.title}</h3>
                <p className="banner-description">{banner.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}