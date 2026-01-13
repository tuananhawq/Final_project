// src/pages/creator/CreatorLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import "../../styles/creator/creator-page.css";

export default function CreatorLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/register");
      return;
    }

    axios
      .get("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200 && res.data.user) {
          setUser(res.data.user);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch me error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="creator-page">
        <Header />
        <div className="creator-loading-container">
          <div className="creator-loading-spinner"></div>
          <p className="creator-loading-text">Đang tải...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isCreator = user?.roles?.includes("creator") || false;

  // Xác định active tab dựa trên URL
  const getActiveTab = () => {
    if (location.pathname.includes("/creator/news")) return "news";
    if (location.pathname.includes("/creator/recommended")) return "recommended";
    if (location.pathname.includes("/creator/cv")) return "cv";
    if (location.pathname.includes("/creator/applications")) return "applications";
    return "news"; // default
  };

  const activeTab = getActiveTab();

  return (
    <div className="creator-page">
      <Header />

      <div className="creator-layout">
        {/* ===== SIDEBAR ===== */}
        <aside className="brand-panel">
          <div className="panel-header">
            <div className="panel-avatar">
              <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="30" r="20" fill="#000" />
                <path
                  d="M 25 60 Q 50 100 75 60 L 75 120 L 25 120 Z"
                  fill="#000"
                />
                <circle
                  cx="50"
                  cy="30"
                  r="20"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M 25 60 Q 50 85 75 60"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="panel-info">
              <h3>{user?.username || "Tên Creator"}</h3>
              <p>{isCreator ? "Creator" : "User"}</p>
              <span>
                Tài khoản cấp{" "}
                {user?.premiumStatus === "premium" ? "3/3" : "1/3"}
              </span>
              {!isCreator && (
                <button
                  className="upgrade-btn"
                  onClick={() => navigate("/upgrade-creator")}
                >
                  Nâng cấp Creator
                </button>
              )}
            </div>
          </div>

          <nav className="panel-menu">
            {/* BẢNG TIN */}
            <a
              href="/creator/news"
              className={`menu-item ${activeTab === "news" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/creator/news");
              }}
            >
              <span className="menu-icon">📰</span> BẢNG TIN
            </a>

            {/* Các menu chỉ hiện khi là Creator */}
            {isCreator && (
              <>
                <a
                  href="/creator/recommended"
                  className={`menu-item ${
                    activeTab === "recommended" ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/creator/recommended");
                  }}
                >
                  <span className="menu-icon">📢</span> TUYỂN DỤNG ĐỀ XUẤT
                </a>
                <a
                  href="/creator/cv"
                  className={`menu-item ${activeTab === "cv" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/creator/cv");
                  }}
                >
                  <span className="menu-icon">📋</span> QUẢN LÝ CV
                </a>
                <a
                  href="/creator/applications"
                  className={`menu-item ${
                    activeTab === "applications" ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/creator/applications");
                  }}
                >
                  <span className="menu-icon">✅</span> ĐÃ ỨNG TUYỂN
                </a>
              </>
            )}
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="creator-content">
          <div className="container">
            {!isCreator ? (
              <div className="brand-empty-state">
                Tài khoản của bạn chưa phải Creator. Vui lòng nâng cấp để sử dụng
                đầy đủ tính năng.
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

