import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";

export function RecommendedBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBrands = async () => {
    try {
      setLoading(true);
      // Sử dụng endpoint đúng: /api/brands
      const res = await axios.get(`${API_URLS.BRANDS}`);
      setBrands(res.data.brands || []);
    } catch (err) {
      console.error("Fetch brands error:", err);
      console.error("Error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading) {
    return <div className="brand-section-loading">Đang tải danh sách Brand...</div>;
  }

  return (
    <div className="recommended-brands">
      <h2 className="brand-section-title">TUYỂN DỤNG ĐỀ XUẤT - DANH SÁCH BRAND</h2>

      {brands.length === 0 ? (
        <div className="brand-empty-state">
          Hiện chưa có Brand nào.
        </div>
      ) : (
        <div className="brand-grid">
          {brands.map((brand) => (
            <div key={brand._id} className="brand-card">
              <div className="brand-card-header">
                <div className="brand-logo">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.companyName} />
                  ) : (
                    <span>{brand.companyName?.[0]?.toUpperCase() || "B"}</span>
                  )}
                </div>
                <div>
                  <h3>{brand.companyName}</h3>
                  <p className="brand-industry">{brand.industry || "Chưa cập nhật"}</p>
                </div>
              </div>

              <div className="brand-description">
                <p>
                  {brand.description && brand.description.length > 150
                    ? brand.description.slice(0, 150) + "..."
                    : brand.description || "Chưa có mô tả"}
                </p>
              </div>

              <div className="brand-meta">
                <span>👥 {brand.followers || "0"} followers</span>
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-website"
                  >
                    🌐 Website
                  </a>
                )}
              </div>

              <Link
                to={`/creator/recommended/${brand._id}`}
                className="cv-detail-btn"
                style={{ textDecoration: "none", display: "block", textAlign: "center" }}
              >
                Xem chi tiết Brand
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

