import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSync } from "react-icons/fa";
import axios from "axios";
import { API_URLS } from "../config/api.js";

export function CreatorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem("token");

  const fetchApplications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
      setLoading(true);
      }
      
      if (!token) {
        setApplications([]);
        return;
      }

      const res = await axios.get(
        `${API_URLS.APPLICATION}/creator/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Fetch applications error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchApplications(true);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="brand-section-title" style={{ margin: 0 }}>ĐÃ ỨNG TUYỂN</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: "rgba(125, 211, 252, 0.1)",
            border: "1px solid rgba(125, 211, 252, 0.3)",
            borderRadius: "8px",
            color: "#7dd3fc",
            cursor: refreshing || loading ? "not-allowed" : "pointer",
            opacity: refreshing || loading ? 0.6 : 1,
            transition: "all 0.2s ease",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            if (!refreshing && !loading) {
              e.target.style.backgroundColor = "rgba(125, 211, 252, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (!refreshing && !loading) {
              e.target.style.backgroundColor = "rgba(125, 211, 252, 0.1)";
            }
          }}
        >
          <FaSync 
            className={refreshing ? "spin-icon" : ""}
            style={{ 
              fontSize: "14px"
            }} 
          />
          {refreshing ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

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
                  <Link
                    to={`/creator/news/${app.jobPost._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3 style={{ cursor: "pointer", display: "inline-block" }}>
                      {app.jobPost.title}
                    </h3>
                  </Link>
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

