import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import "../styles/brand/brand-page.css";
import { useNotification } from "../context/NotificationContext.jsx";

export default function JobPostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const { notifySuccess, notifyError, notifyInfo } = useNotification();

  // Determine back path based on current route
  const isNestedRoute =
    location.pathname.includes("/creator/") || location.pathname.includes("/brand/");
  const backPath = isNestedRoute
    ? location.pathname.split("/").slice(0, -1).join("/")
    : "/";

  const isCreator = user?.roles?.includes("creator");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${API_URLS.JOB_POST}/job-posts/${id}`
        );
        setPost(res.data.post);
      } catch (error) {
        console.error("Fetch job post detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMe = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URLS.AUTH}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Fetch me error:", err);
      }
    };

    // Check if already applied (only meaningful cho Creator)
    const checkApplied = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `${API_URLS.CREATOR}/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const appliedIds = (res.data.applications || []).map(
          (app) => app.jobPost._id
        );
        setApplied(appliedIds.includes(id));
      } catch (err) {
        console.error("Check applied error:", err);
      }
    };

    if (id) {
      fetchPost();
      fetchMe();
      checkApplied();
    }
  }, [id, token]);

  const handleOpenApplyModal = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setShowApplyModal(true);
  };

  const handleApply = async () => {
    if (!applyMessage.trim()) {
      notifyError("Vui lòng nhập lý do ứng tuyển!");
      return;
    }

    setApplying(true);
    try {
      await axios.post(
        `${API_URLS.CREATOR}/apply`,
        { jobPostId: id, message: applyMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplied(true);
      setShowApplyModal(false);
      setApplyMessage("");
      notifySuccess("Ứng tuyển thành công!");
    } catch (err) {
      console.error("Apply error:", err);
      if (err.response?.data?.error === "ALREADY_APPLIED") {
        notifyInfo("Bạn đã ứng tuyển bài này rồi!");
        setApplied(true);
        setShowApplyModal(false);
      } else {
        notifyError("Có lỗi xảy ra khi ứng tuyển. Vui lòng thử lại.");
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="brand-section-loading">Đang tải...</div>;
  }

  if (!post) {
    return (
      <div className="brand-empty-state">
        <h2>Không tìm thấy tin tuyển dụng</h2>
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
            <h2 style={{ marginTop: 0 }}>{post.title}</h2>
            <p className="brand-modal-brand">
              {post.brandName} · {post.jobType} · {post.workTime}
            </p>
            <p className="brand-modal-budget">{post.budget}</p>

            <div className="brand-modal-section">
              <h4>Nội dung công việc</h4>
              <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
            </div>

            <div className="brand-modal-section">
              <h4>Yêu cầu ứng viên</h4>
              <p style={{ whiteSpace: "pre-wrap" }}>{post.requirements}</p>
            </div>

            <div className="brand-modal-section">
              <h4>Quyền lợi / Hỗ trợ từ Brand</h4>
              <p style={{ whiteSpace: "pre-wrap" }}>{post.benefits}</p>
            </div>

            <div className="brand-modal-section">
              <h4>Thông tin khác</h4>
              <p>
                <strong>Ngày đăng:</strong>{" "}
                {new Date(post.createdAt).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Chỉ Creator mới thấy nút ứng tuyển */}
            {isCreator && (
              <div className="brand-form-actions" style={{ marginTop: 24 }}>
                {applied ? (
                  <button
                    className="secondary-btn"
                    style={{ width: "100%" }}
                    disabled
                  >
                    ✓ Đã ứng tuyển
                  </button>
                ) : (
                  <button
                    className="primary-btn"
                    style={{ width: "100%" }}
                    onClick={handleOpenApplyModal}
                  >
                    Ứng tuyển ngay
                  </button>
                )}
              </div>
            )}
          </div>

      {/* Modal ứng tuyển */}
      {isCreator && showApplyModal && (
        <div
          className="brand-modal-overlay"
          onClick={() => {
            if (!applying) {
              setShowApplyModal(false);
              setApplyMessage("");
            }
          }}
        >
          <div
            className="brand-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{ maxWidth: "600px" }}
          >
            <h3 style={{ marginTop: 0 }}>Ứng tuyển</h3>
            <p style={{ color: "#9ca3af", marginBottom: 20 }}>
              Vui lòng nhập lý do tại sao bạn muốn ứng tuyển vào vị trí này. Thông tin này sẽ được gửi đến Brand.
            </p>

            <div className="brand-modal-section">
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                Lý do ứng tuyển <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Ví dụ: Tôi có kinh nghiệm trong lĩnh vực này và mong muốn được hợp tác với Brand..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(148,163,184,0.3)",
                  color: "#e5e7eb",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                disabled={applying}
              />
            </div>

            <div className="brand-form-actions" style={{ marginTop: 24 }}>
              <button
                className="primary-btn"
                onClick={handleApply}
                disabled={applying || !applyMessage.trim()}
                style={{ width: "100%" }}
              >
                {applying ? "Đang gửi..." : "Gửi đơn ứng tuyển"}
              </button>
              <button
                className="secondary-btn"
                onClick={() => {
                  setShowApplyModal(false);
                  setApplyMessage("");
                }}
                disabled={applying}
                style={{ width: "100%", marginTop: 12 }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
