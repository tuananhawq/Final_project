// src/components/HighlightFeed.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBanners } from "../services/bannerService";
import "../styles/home/highlight-feed.css";

export function HighlightFeed() {
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
    return <div className="feed-loading">Đang tải tin nổi bật...</div>;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="highlight-feed">
      <div className="container">
        <div className="feed-list">
          {banners.map((banner) => (
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