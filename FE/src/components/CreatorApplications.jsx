import { useEffect, useState } from "react";
import axios from "axios";

export function CreatorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      if (!token) {
        setApplications([]);
        return;
      }

      const res = await axios.get(
        "http://localhost:3000/api/creator/applications",
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
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        Đang tải danh sách đã ứng tuyển...
      </div>
    );
  }

  return (
    <div className="creator-applications">
      <h2 className="brand-section-title">ĐÃ ỨNG TUYỂN</h2>

      {applications.length === 0 ? (
        <div className="brand-empty-state">
          Bạn chưa ứng tuyển bài nào. Hãy xem các tin tuyển dụng và ứng tuyển
          ngay!
        </div>
      ) : (
        <div className="brand-job-list">
          {applications.map((app) => {
            const statusBadge = getStatusBadge(app.status);
            return (
              <div key={app._id} className="brand-job-card">
                <div className="brand-job-header">
                  <h3>{app.jobPost.title}</h3>
                  <span className="job-type">{app.jobPost.jobType}</span>
                </div>
                <div className="brand-job-meta">
                  <span>{app.jobPost.workTime}</span>
                  <span className="budget">{app.jobPost.budget}</span>
                  <span>
                    {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="brand-job-content">
                  <strong>Brand:</strong> {app.jobPost.brandName}
                </p>
                <div
                  style={{
                    marginTop: 12,
                    padding: "6px 12px",
                    borderRadius: 6,
                    display: "inline-block",
                    ...statusBadge.style,
                  }}
                >
                  {statusBadge.text}
                </div>
                {app.message && (
                  <p
                    className="brand-job-content"
                    style={{ marginTop: 8, fontStyle: "italic" }}
                  >
                    Tin nhắn: {app.message}
                  </p>
                )}
                {/* Hiển thị thông tin phê duyệt */}
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
                    <strong style={{ color: "#86efac" }}>
                      ✓ Thông tin liên hệ từ Brand:
                    </strong>
                    <p style={{ marginTop: 4, color: "#d1d5db" }}>
                      {app.approvalMessage}
                    </p>
                  </div>
                )}
                {/* Hiển thị lý do từ chối */}
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
                    <strong style={{ color: "#fca5a5" }}>
                      ✗ Lý do từ chối:
                    </strong>
                    <p style={{ marginTop: 4, color: "#d1d5db" }}>
                      {app.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

