// src/components/HighlightFeed.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBanners } from "../services/bannerService";
import "../styles/home/highlight-feed.css";

export function HighlightFeed({ searchQuery = "" }) {
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

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredBanners = normalizedSearch
    ? banners.filter((banner) =>
        banner.title?.toLowerCase().includes(normalizedSearch)
      )
    : banners;

  if (loading) {
    return <div className="feed-loading">Đang tải tin nổi bật...</div>;
  }

  if (filteredBanners.length === 0) {
    if (normalizedSearch) {
      return (
        <section id="section-highlights" className="highlight-feed">
          <div className="container">
            <div className="feed-no-result">
              Không tìm thấy kết quả phù hợp với từ khóa "
              <strong>{searchQuery}</strong>".
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section id="section-highlights" className="highlight-feed">
      <div className="container">
        <div className="feed-list">
          {filteredBanners.map((banner) => (
            <div key={banner._id} className="feed-item">
              {/* Title bên ngoài card */}
              <div className="feed-title-outer">
                <span className="feed-line-left"></span>
                <h2 className="feed-title">{banner.title}</h2>
                <span className="feed-line-right"></span>
              </div>

              {/* Card chứa ảnh + description */}
              <Link
                // to={`/highlight/${banner.slug || banner._id}`}
                to={`/highlight/${banner._id}`}
                className="feed-card"
              >
                <div className="feed-image-wrapper">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="feed-image"
                  />
                </div>

                
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}