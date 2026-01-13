import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export function RecommendedCV() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCvs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setCvs([]);
        return;
      }

      const res = await axios.get(
        "http://localhost:3000/api/cv/recommended",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCvs(res.data.cvs || []);
    } catch (err) {
      console.error("Fetch recommended CV error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, []);

  if (loading) {
    return <div className="brand-section-loading">Đang tải CV đề xuất...</div>;
  }

  return (
    <div className="recommended-cv">
      <h2 className="brand-section-title">CV ĐỀ XUẤT CHO BRAND</h2>

      {cvs.length === 0 ? (
        <div className="brand-empty-state">
          Hiện chưa có CV nào được đề xuất.
        </div>
      ) : (
        <div className="cv-grid">
          {cvs.map((cv) => (
            <div key={cv._id} className="cv-card">
              <div className="cv-card-header">
                <div className="cv-avatar">
                  {cv.user?.avatar ? (
                    <img src={cv.user.avatar} alt={cv.user.username} />
                  ) : (
                    <span>
                      {cv.user?.username?.[0]?.toUpperCase() ||
                        cv.fullName?.[0]?.toUpperCase() ||
                        "C"}
                    </span>
                  )}
                </div>
                <div>
                  <h3>{cv.fullName}</h3>
                  <p className="cv-title">{cv.title}</p>
                </div>
              </div>

              <div className="cv-main-skills">
                <strong>Kỹ năng chính:</strong>{" "}
                {cv.mainSkills && cv.mainSkills.length > 0
                  ? cv.mainSkills.join(", ")
                  : "Đang cập nhật"}
              </div>

              <div className="cv-experience">
                <strong>Kinh nghiệm:</strong>{" "}
                {cv.experienceYears
                  ? `${cv.experienceYears}+ năm`
                  : "Chưa cập nhật số năm"}
              </div>

              {/* Hiển thị ảnh CV nếu có */}
              {cv.cvFileUrl && cv.cvFileType === "image" && (
                <div className="cv-image-preview" style={{ marginTop: 12 }}>
                  <img
                    src={cv.cvFileUrl}
                    alt="CV"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}

              <Link
                to={`/brand/recommended/${cv._id}`}
                className="cv-detail-btn"
                style={{ textDecoration: "none", display: "block", textAlign: "center" }}
              >
                Xem CV chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}


