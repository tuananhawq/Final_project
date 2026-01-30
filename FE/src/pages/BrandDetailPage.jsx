import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { useLanguage } from "../context/LanguageContext";
import "../styles/brand/brand-page.css";

export default function BrandDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const backPath = location.pathname.split("/").slice(0, -1).join("/");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        // Sử dụng endpoint đúng: /api/brands/:id
        const res = await axios.get(`${API_URLS.BRANDS}/${id}`);
        setBrand(res.data.brand);
      } catch (error) {
        console.error("Fetch brand detail error:", error);
        console.error("Error response:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBrand();
    }
  }, [id]);

  if (loading) {
    return <div className="brand-section-loading">{t("brandDetail.loading")}</div>;
  }

  if (!brand) {
    return (
      <div className="brand-empty-state">
        <h2>{t("brandDetail.notFound")}</h2>
        <button
          className="primary-btn"
          onClick={() => navigate(backPath)}
          style={{ marginTop: 16 }}
        >
          {t("brandDetail.back")}
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
        ← {t("brandDetail.back")}
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
          <h4>{t("brandDetail.description")}</h4>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {brand.description || t("brandDetail.noDescription")}
          </p>
        </div>

        {brand.website && (
          <div className="brand-modal-section">
            <h4>{t("brandDetail.website")}</h4>
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
          <h4>{t("brandDetail.otherInfo")}</h4>
          <p>
            <strong>{t("brandDetail.followers")}</strong> {brand.followers || "0"}
          </p>
        </div>

        <button
          className="brand-modal-close"
          onClick={() => navigate(backPath)}
          style={{ marginTop: 24 }}
        >
          {t("brandDetail.back")}
        </button>
      </div>
    </div>
  );
}

