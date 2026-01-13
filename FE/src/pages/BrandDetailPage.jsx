import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import "../styles/brand/brand-page.css";

export default function BrandDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const backPath = location.pathname.split("/").slice(0, -1).join("/");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get(`${API_URLS.BRAND}/brands/${id}`);
        setBrand(res.data.brand);
      } catch (error) {
        console.error("Fetch brand detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBrand();
    }
  }, [id]);

  if (loading) {
    return <div className="brand-section-loading">Đang tải...</div>;
  }

  if (!brand) {
    return (
      <div className="brand-empty-state">
        <h2>Không tìm thấy Brand</h2>
        <button
          className="primary-btn"
          onClick={() => navigate(backPath)}
          style={{ marginTop: 16 }}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="secondary-btn"
        onClick={() => navigate(backPath)}
        style={{ marginBottom: 24 }}
      >
        ← Quay lại
      </button>

      <div className="brand-modal" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
              {brand.logo && (
                <img
                  src={brand.logo}
                  alt={brand.companyName}
                  style={{ maxWidth: "120px", borderRadius: 12 }}
                />
              )}
              <div>
                <h2 style={{ margin: 0 }}>{brand.companyName}</h2>
                {brand.industry && (
                  <p style={{ margin: "4px 0", color: "#9ca3af" }}>
                    {brand.industry}
                  </p>
                )}
              </div>
            </div>

            <div className="brand-modal-section">
              <h4>Mô tả</h4>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {brand.description || "Chưa có mô tả"}
              </p>
            </div>

            {brand.website && (
              <div className="brand-modal-section">
                <h4>Website</h4>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-website"
                  style={{ fontSize: "1rem" }}
                >
                  {brand.website}
                </a>
              </div>
            )}

            <div className="brand-modal-section">
              <h4>Thông tin khác</h4>
              <p>
                <strong>Followers:</strong> {brand.followers || "0"}
              </p>
            </div>

            <button
              className="brand-modal-close"
              onClick={() => navigate(backPath)}
              style={{ marginTop: 24 }}
            >
              Quay lại
            </button>
          </div>
    </div>
  );
}
