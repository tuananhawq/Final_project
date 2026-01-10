import { useEffect, useState } from "react";
import axios from "axios";

export function RecommendedBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/brands");
      setBrands(res.data.brands || []);
    } catch (err) {
      console.error("Fetch brands error:", err);
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

              <button
                className="cv-detail-btn"
                onClick={() => setSelectedBrand(brand)}
              >
                Xem chi tiết Brand
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedBrand && (
        <div
          className="brand-modal-overlay"
          onClick={() => setSelectedBrand(null)}
        >
          <div
            className="brand-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>{selectedBrand.companyName}</h3>
            {selectedBrand.logo && (
              <img
                src={selectedBrand.logo}
                alt={selectedBrand.companyName}
                style={{ maxWidth: "200px", marginBottom: 16 }}
              />
            )}

            <div className="brand-modal-section">
              <h4>Ngành nghề</h4>
              <p>{selectedBrand.industry || "Chưa cập nhật"}</p>
            </div>

            <div className="brand-modal-section">
              <h4>Mô tả</h4>
              <p>{selectedBrand.description || "Chưa có mô tả"}</p>
            </div>

            {selectedBrand.website && (
              <div className="brand-modal-section">
                <h4>Website</h4>
                <a
                  href={selectedBrand.website}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-website"
                >
                  {selectedBrand.website}
                </a>
              </div>
            )}

            <div className="brand-modal-section">
              <h4>Followers</h4>
              <p>{selectedBrand.followers || "0"}</p>
            </div>

            <button
              className="brand-modal-close"
              onClick={() => setSelectedBrand(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

