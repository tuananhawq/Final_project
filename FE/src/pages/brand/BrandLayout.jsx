// src/pages/brand/BrandLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../../config/api.js";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import "../../styles/brand/brand-page.css";

export default function BrandLayout() {
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
      .get(`${API_URLS.AUTH}/me`, {
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
      <div className="brand-page">
        <Header />
        <div className="brand-loading-container">
          <div className="brand-loading-spinner"></div>
          <p className="brand-loading-text">Đang tải...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isBrand = user?.roles?.includes("brand") || false;

  // Xác định active tab dựa trên URL
  const getActiveTab = () => {
    if (location.pathname.includes("/brand/recommended")) return "recommended";
    if (location.pathname.includes("/brand/mynews")) return "mynews";
    if (location.pathname.includes("/brand/profile")) return "profile";
    return "mynews"; // default - hiển thị tin tuyển dụng của tôi
  };

  const activeTab = getActiveTab();

  return (
    <div className="brand-page">
      <Header />

      <div className="brand-layout">
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
              <h3>{user?.username || user?.companyName || "Tên Brand"}</h3>
              <p>{isBrand ? "Brand" : "User"}</p>
              <span>
                Tài khoản cấp{" "}
                {user?.premiumStatus === "premium" ? "3/3" : "1/3"}
              </span>
              {!isBrand && (
                <button
                  className="upgrade-btn"
                  onClick={() => navigate("/upgrade-brand")}
                >
                  Nâng cấp Brand
                </button>
              )}
            </div>
          </div>

          <nav className="panel-menu">
            {/* Các menu chỉ hiện khi là Brand */}
            {isBrand && (
              <>
                <a
                  href="/brand/mynews"
                  className={`menu-item ${
                    activeTab === "mynews" ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/brand/mynews");
                  }}
                >
                  <span className="menu-icon">🏠</span> TIN TUYỂN DỤNG CỦA TÔI
                </a>
                <a
                  href="/brand/recommended"
                  className={`menu-item ${
                    activeTab === "recommended" ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/brand/recommended");
                  }}
                >
                  <span className="menu-icon">📢</span> CV ĐỀ XUẤT
                </a>
                <a
                  href="/brand/profile"
                  className={`menu-item ${
                    activeTab === "profile" ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/brand/profile");
                  }}
                >
                  <span className="menu-icon">👤</span> BRAND PROFILE
                </a>
              </>
            )}
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="brand-content">
          <div className="container">
            {!isBrand ? (
              <div className="brand-empty-state">
                Tài khoản của bạn chưa phải Brand. Vui lòng nâng cấp để sử dụng
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

