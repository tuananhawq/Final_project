import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import "../styles/brand/brand-page.css";
import { useNotification } from "../context/NotificationContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

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
  const [applyMessageError, setApplyMessageError] = useState("");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const { t } = useLanguage();

  // Determine back path based on current route
  const isNestedRoute =
    location.pathname.includes("/creator/") || location.pathname.includes("/brand/");
  const backPath = isNestedRoute
    ? location.pathname.split("/").slice(0, -1).join("/")
    : "/";

  // Cho phép creator và user có gói creator mới có thể ứng tuyển
  const canApply = user && user?.roles?.includes("creator");

  // Kiểm tra nếu là user (không có creator/brand role) thì redirect sang pricing
  const isPlainUser = user && user?.roles?.includes("user") &&
    !user?.roles?.includes("creator") && !user?.roles?.includes("brand");

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
        const userData = res.data.user;
        setUser(userData);

        // Nếu là user thuần (không có creator/brand role) thì redirect sang pricing
        if (userData && userData.roles?.includes("user") &&
          !userData.roles?.includes("creator") && !userData.roles?.includes("brand")) {
          notifyInfo(t("jobPostDetail.creatorRequired"));
          navigate("/pricing");
          return;
        }
      } catch (err) {
        console.error("Fetch me error:", err);
      }
    };

    // Check if already applied (only meaningful cho Creator)
    const checkApplied = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `${API_URLS.APPLICATION}/creator/applications`,
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
  }, [id, token, navigate, notifyInfo]);

  const handleOpenApplyModal = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setShowApplyModal(true);
  };

  const handleApply = async () => {
    // Validate lý do ứng tuyển
    if (!applyMessage.trim()) {
      setApplyMessageError(t("jobPostDetail.reasonRequired"));
      notifyError(t("jobPostDetail.reasonRequired"));
      return;
    }

    setApplyMessageError(""); // Clear error nếu đã có giá trị
    setApplying(true);
    try {
      await axios.post(
        `${API_URLS.APPLICATION}/creator/apply`,
        { jobPostId: id, message: applyMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplied(true);
      setShowApplyModal(false);
      setApplyMessage("");
      notifySuccess(t("jobPostDetail.applySuccess"));
    } catch (err) {
      console.error("Apply error:", err);
      if (err.response?.data?.error === "ALREADY_APPLIED") {
        notifyInfo(t("jobPostDetail.alreadyApplied"));
        setApplied(true);
        setShowApplyModal(false);
      } else {
        notifyError(t("jobPostDetail.applyError"));
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="brand-section-loading">{t("jobPostDetail.loading")}</div>;
  }

  if (!post) {
    return (
      <div className="brand-empty-state">
        <h2>{t("jobPostDetail.notFound")}</h2>
        <button
          className="primary-btn"
          onClick={() => navigate(backPath)}
          style={{ marginTop: 16 }}
        >
          {t("jobPostDetail.back")}
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
        ← {t("jobPostDetail.back")}
      </button>

      <div className="brand-modal" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>{post.title}</h2>
        <p className="brand-modal-brand">
          {post.brandName} · {post.jobType} · {post.workTime}
        </p>
        <p className="brand-modal-budget">{post.budget}</p>

        <div className="brand-modal-section">
          <h4>{t("jobPostDetail.content")}</h4>
          <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
        </div>

        <div className="brand-modal-section">
          <h4>{t("jobPostDetail.requirements")}</h4>
          <p style={{ whiteSpace: "pre-wrap" }}>{post.requirements}</p>
        </div>

        <div className="brand-modal-section">
          <h4>{t("jobPostDetail.benefits")}</h4>
          <p style={{ whiteSpace: "pre-wrap" }}>{post.benefits}</p>
        </div>

        <div className="brand-modal-section">
          <h4>{t("jobPostDetail.otherInfo")}</h4>
          <p>
            <strong>{t("jobPostDetail.postedDate")}</strong>{" "}
            {new Date(post.createdAt).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* User và Creator đều có thể ứng tuyển */}
        {canApply && (
          <div className="brand-form-actions" style={{ marginTop: 24 }}>
            {applied ? (
              <button
                className="secondary-btn"
                style={{ width: "100%" }}
                disabled
              >
                ✓ {t("jobPostDetail.applied")}
              </button>
            ) : (
              <button
                className="primary-btn"
                style={{ width: "100%" }}
                onClick={handleOpenApplyModal}
              >
                {t("jobPostDetail.applyNow")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal ứng tuyển */}
      {canApply && showApplyModal && (
        <div
          className="brand-modal-overlay"
          onClick={() => {
            if (!applying) {
              setShowApplyModal(false);
              setApplyMessage("");
              setApplyMessageError("");
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
            <h3 style={{ marginTop: 0 }}>{t("jobPostDetail.apply")}</h3>
            <p style={{ color: "#9ca3af", marginBottom: 20 }}>
              {t("jobPostDetail.applyPrompt")}
            </p>

            <div className="brand-modal-section">
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                {t("jobPostDetail.reason")} <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={applyMessage}
                onChange={(e) => {
                  setApplyMessage(e.target.value);
                  if (applyMessageError && e.target.value.trim()) {
                    setApplyMessageError(""); // Clear error khi user bắt đầu nhập
                  }
                }}
                onBlur={() => {
                  if (!applyMessage.trim()) {
                    setApplyMessageError(t("jobPostDetail.reasonRequired"));
                  }
                }}
                placeholder={t("jobPostDetail.reasonPlaceholder")}
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(15,23,42,0.9)",
                  border: applyMessageError
                    ? "1px solid #ef4444"
                    : "1px solid rgba(148,163,184,0.3)",
                  color: "#e5e7eb",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                disabled={applying}
              />
              {applyMessageError && (
                <div style={{
                  color: "#ef4444",
                  fontSize: "0.875rem",
                  marginTop: "8px"
                }}>
                  {applyMessageError}
                </div>
              )}
            </div>

            <div className="brand-form-actions" style={{ marginTop: 24 }}>
              <button
                className="primary-btn"
                onClick={handleApply}
                disabled={applying || !applyMessage.trim()}
                style={{ width: "100%" }}
              >
                {applying ? t("jobPostDetail.sending") : t("jobPostDetail.submit")}
              </button>
              <button
                className="secondary-btn"
                onClick={() => {
                  setShowApplyModal(false);
                  setApplyMessage("");
                  setApplyMessageError("");
                }}
                disabled={applying}
                style={{ width: "100%", marginTop: 12 }}
              >
                {t("jobPostDetail.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

