import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { useNotification } from "../context/NotificationContext.jsx";

export function ApplicationManagement({ jobPostId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCv, setSelectedCv] = useState(null);
  const [statusModal, setStatusModal] = useState(null); // { applicationId, status }
  const [statusMessage, setStatusMessage] = useState("");
  const token = localStorage.getItem("token");
  const { notifySuccess, notifyError } = useNotification();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URLS.BRAND}/job-post/${jobPostId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Fetch applications error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobPostId) {
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobPostId]);

  const openStatusModal = (applicationId, status) => {
    setStatusModal({ applicationId, status });
    setStatusMessage("");
  };

  const handleStatusChange = async () => {
    if (!statusModal) return;

    const { applicationId, status } = statusModal;
    const payload = { status };

    // Thêm message tương ứng
    if (status === "approved") {
      if (!statusMessage.trim()) {
        notifyError("Vui lòng nhập thông tin liên hệ!");
        return;
      }
      payload.approvalMessage = statusMessage;
    } else if (status === "rejected") {
      if (!statusMessage.trim()) {
        notifyError("Vui lòng nhập lý do từ chối!");
        return;
      }
      payload.rejectionReason = statusMessage;
    }

    try {
      await axios.put(
        `${API_URLS.BRAND}/job-post/${jobPostId}/applications/${applicationId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchApplications();
      setStatusModal(null);
      setStatusMessage("");
      notifySuccess(
        status === "approved"
          ? "Đã phê duyệt ứng viên!"
          : "Đã từ chối ứng viên!"
      );
    } catch (err) {
      console.error("Update application status error:", err);
      notifyError("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          text: "Đã phê duyệt",
          style: {
            backgroundColor: "rgba(34,197,94,0.2)",
            color: "#86efac",
          },
        };
      case "rejected":
        return {
          text: "Đã từ chối",
          style: {
            backgroundColor: "rgba(239,68,68,0.2)",
            color: "#fca5a5",
          },
        };
      default:
        return {
          text: "Đang chờ",
          style: {
            backgroundColor: "rgba(251,191,36,0.2)",
            color: "#fde047",
          },
        };
    }
  };

  if (loading) {
    return (
      <div className="brand-section-loading">
        Đang tải danh sách ứng viên...
      </div>
    );
  }

  return (
    <div className="application-management">
      <h3 style={{ marginBottom: 16 }}>Danh sách ứng viên ({applications.length})</h3>

      {applications.length === 0 ? (
        <div className="brand-empty-state">
          Chưa có ứng viên nào ứng tuyển.
        </div>
      ) : (
        <div className="application-list">
          {applications.map((app) => {
            const statusBadge = getStatusBadge(app.status);
            return (
              <div key={app._id} className="application-card">
                <div className="application-header">
                  <div className="application-creator">
                    <div className="cv-avatar">
                      {app.creator?.avatar ? (
                        <img
                          src={app.creator.avatar}
                          alt={app.creator.username}
                        />
                      ) : (
                        <span>
                          {app.creator?.username?.[0]?.toUpperCase() || "C"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4>{app.creator?.username || "Unknown"}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                        {app.creator?.email || ""}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: "0.85rem",
                      ...statusBadge.style,
                    }}
                  >
                    {statusBadge.text}
                  </div>
                </div>

                {app.cv && (
                  <div className="application-cv-info">
                    <p>
                      <strong>CV:</strong> {app.cv.title}
                    </p>
                    <p>
                      <strong>Kỹ năng:</strong>{" "}
                      {app.cv.mainSkills?.join(", ") || "Chưa cập nhật"}
                    </p>
                    <p>
                      <strong>Kinh nghiệm:</strong> {app.cv.experienceYears || 0}{" "}
                      năm
                    </p>
                    <button
                      className="secondary-btn"
                      style={{ marginTop: 8 }}
                      onClick={() => setSelectedCv(app.cv)}
                    >
                      Xem CV chi tiết
                    </button>
                  </div>
                )}

                {app.message && (
                  <p style={{ marginTop: 12, fontStyle: "italic", color: "#d1d5db" }}>
                    Tin nhắn: {app.message}
                  </p>
                )}

                {/* Hiển thị thông tin phê duyệt/từ chối nếu có */}
                {app.status === "approved" && app.approvalMessage && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      backgroundColor: "rgba(34,197,94,0.1)",
                      borderRadius: 8,
                      border: "1px solid rgba(34,197,94,0.3)",
                    }}
                  >
                    <strong style={{ color: "#86efac" }}>Thông tin liên hệ:</strong>
                    <p style={{ marginTop: 4, color: "#d1d5db" }}>
                      {app.approvalMessage}
                    </p>
                  </div>
                )}

                {app.status === "rejected" && app.rejectionReason && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      backgroundColor: "rgba(239,68,68,0.1)",
                      borderRadius: 8,
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                  >
                    <strong style={{ color: "#fca5a5" }}>Lý do từ chối:</strong>
                    <p style={{ marginTop: 4, color: "#d1d5db" }}>
                      {app.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="application-actions">
                  {app.status === "pending" && (
                    <>
                      <button
                        className="primary-btn"
                        onClick={() => openStatusModal(app._id, "approved")}
                      >
                        Phê duyệt
                      </button>
                      <button
                        className="danger-btn"
                        onClick={() => openStatusModal(app._id, "rejected")}
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal xem CV chi tiết */}
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

      {/* Modal phê duyệt/từ chối */}
      {statusModal && (
        <div
          className="brand-modal-overlay"
          onClick={() => setStatusModal(null)}
        >
          <div
            className="brand-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>
              {statusModal.status === "approved"
                ? "Phê duyệt ứng viên"
                : "Từ chối ứng viên"}
            </h3>

            {statusModal.status === "approved" ? (
              <>
                <p style={{ color: "#9ca3af", marginBottom: 16 }}>
                  Vui lòng nhập thông tin liên hệ để Creator có thể liên hệ với
                  bạn:
                </p>
                <label>
                  Thông tin liên hệ *
                  <textarea
                    rows={4}
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Ví dụ: Email: brand@example.com, SĐT: 0123456789, hoặc thông tin liên hệ khác..."
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: "rgba(15,23,42,0.8)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      color: "#e5e7eb",
                      marginTop: 8,
                    }}
                  />
                </label>
              </>
            ) : (
              <>
                <p style={{ color: "#9ca3af", marginBottom: 16 }}>
                  Vui lòng nhập lý do từ chối ứng viên này:
                </p>
                <label>
                  Lý do từ chối *
                  <textarea
                    rows={4}
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Ví dụ: Không phù hợp với yêu cầu công việc, thiếu kinh nghiệm, v.v..."
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: "rgba(15,23,42,0.8)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      color: "#e5e7eb",
                      marginTop: 8,
                    }}
                  />
                </label>
              </>
            )}

            <div className="brand-form-actions" style={{ marginTop: 24 }}>
              <button
                className="secondary-btn"
                onClick={() => {
                  setStatusModal(null);
                  setStatusMessage("");
                }}
              >
                Hủy
              </button>
              <button className="primary-btn" onClick={handleStatusChange}>
                {statusModal.status === "approved" ? "Phê duyệt" : "Từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

