import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import "../styles/brand/brand-page.css";

export default function CVDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  
  const backPath = location.pathname.split("/").slice(0, -1).join("/");

  useEffect(() => {
    const fetchCv = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        // Get all CVs and find the one with matching ID
        const res = await axios.get(
          `${API_URLS.CV}/recommended`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const cvs = res.data.cvs || [];
        const foundCv = cvs.find((c) => c._id === id);
        
        if (foundCv) {
          setCv(foundCv);
        }
      } catch (error) {
        console.error("Fetch CV detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCv();
    }
  }, [id, token, navigate]);

  if (loading) {
    return <div className="brand-section-loading">Đang tải...</div>;
  }

  if (!cv) {
    return (
      <div className="brand-empty-state">
        <h2>Không tìm thấy CV</h2>
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
              <div className="cv-avatar" style={{ width: 80, height: 80 }}>
                {cv.user?.avatar ? (
                  <img src={cv.user.avatar} alt={cv.user.username} />
                ) : (
                  <span style={{ fontSize: "2rem" }}>
                    {cv.user?.username?.[0]?.toUpperCase() ||
                      cv.fullName?.[0]?.toUpperCase() ||
                      "C"}
                  </span>
                )}
              </div>
              <div>
                <h2 style={{ margin: 0 }}>{cv.fullName}</h2>
                <p className="cv-title" style={{ margin: "4px 0", fontSize: "1.1rem" }}>
                  {cv.title}
                </p>
              </div>
            </div>

            <div className="brand-modal-section">
              <h4>Kỹ năng chính</h4>
              <p>
                {cv.mainSkills && cv.mainSkills.length > 0
                  ? cv.mainSkills.join(", ")
                  : "Đang cập nhật"}
              </p>
            </div>

            <div className="brand-modal-section">
              <h4>Kinh nghiệm</h4>
              <p>
                {cv.experienceYears
                  ? `${cv.experienceYears}+ năm`
                  : "Chưa cập nhật số năm"}
              </p>
              {cv.experienceDetail && (
                <p style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
                  {cv.experienceDetail}
                </p>
              )}
            </div>

            {cv.tags && cv.tags.length > 0 && (
              <div className="brand-modal-section">
                <h4>Tags</h4>
                <p>{cv.tags.join(", ")}</p>
              </div>
            )}

            {cv.cvFileUrl && cv.cvFileType === "image" && (
              <div className="brand-modal-section">
                <h4>Hình ảnh CV</h4>
                <img
                  src={cv.cvFileUrl}
                  alt="CV"
                  style={{
                    width: "100%",
                    maxHeight: "600px",
                    objectFit: "contain",
                    borderRadius: 12,
                    marginTop: 8,
                  }}
                />
              </div>
            )}

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
