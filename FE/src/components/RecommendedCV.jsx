import { useEffect, useState } from "react";
import axios from "axios";

export function RecommendedCV() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCv, setSelectedCv] = useState(null);

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

              <button
                className="cv-detail-btn"
                onClick={() => setSelectedCv(cv)}
              >
                Xem CV chi tiết
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCv && (
        <div
          className="brand-modal-overlay"
          onClick={() => setSelectedCv(null)}
        >
          <div
            className="brand-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>{selectedCv.fullName}</h3>
            <p className="cv-title">{selectedCv.title}</p>

            <div className="brand-modal-section">
              <h4>Kỹ năng chính</h4>
              <p>
                {selectedCv.mainSkills && selectedCv.mainSkills.length > 0
                  ? selectedCv.mainSkills.join(", ")
                  : "Đang cập nhật"}
              </p>
            </div>

            <div className="brand-modal-section">
              <h4>Kinh nghiệm</h4>
              <p>
                {selectedCv.experienceYears
                  ? `${selectedCv.experienceYears}+ năm`
                  : "Chưa cập nhật số năm"}
              </p>
              {selectedCv.experienceDetail && (
                <p>{selectedCv.experienceDetail}</p>
              )}
            </div>

            {selectedCv.tags && selectedCv.tags.length > 0 && (
              <div className="brand-modal-section">
                <h4>Tags</h4>
                <p>{selectedCv.tags.join(", ")}</p>
              </div>
            )}

            {/* Hiển thị ảnh CV trong modal nếu có */}
            {selectedCv.cvFileUrl && selectedCv.cvFileType === "image" && (
              <div className="brand-modal-section">
                <h4>Hình ảnh CV</h4>
                <img
                  src={selectedCv.cvFileUrl}
                  alt="CV"
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                    borderRadius: 12,
                    marginTop: 8,
                  }}
                />
              </div>
            )}

            <button
              className="brand-modal-close"
              onClick={() => setSelectedCv(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


