// src/pages/BrandPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BrandNews } from "../components/BrandNews";
import { RecommendedCV } from "../components/RecommendedCV";
import { BrandCVManager } from "../components/BrandCVManager";
import { MyJobPosts } from "../components/MyJobPosts";
import { BrandProfileManager } from "../components/BrandProfileManager";
import { useLanguage } from "../context/LanguageContext";
import "../styles/brand/brand-page.css"; // CSS riêng cho Brand

export default function BrandPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs"); // jobs | recommended | profile
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    return <div className="loading">{t("brandPage.loading")}</div>;
  }

  const isBrand = user?.roles?.includes("brand") || false;

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
              <h3>{user?.username || user?.companyName || t("brandPage.brandName")}</h3>
              <p>{isBrand ? "Brand" : "User"}</p>
              <span>
                {t("brandPage.accountLevel")}{" "}
                {user?.premiumStatus === "premium" ? "3/3" : "1/3"}
              </span>
              {!isBrand && (
                <button
                  className="upgrade-btn"
                  onClick={() => navigate("/upgrade-brand")}
                >
                  {t("brandPage.upgradeBrand")}
                </button>
              )}
            </div>
          </div>

          <nav className="panel-menu">
            {/* Các menu chỉ hiện khi là Brand */}
            {isBrand && (
              <>
                <div
                  className={`menu-item ${activeTab === "jobs" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("jobs")}
                >
                  <span className="menu-icon">🏠</span> {t("brandPage.myJobs")}
                </div>
                <div
                  className={`menu-item ${activeTab === "recommended" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("recommended")}
                >
                  <span className="menu-icon">📢</span> {t("brandPage.recommendedCv")}
                </div>
                <div
                  className={`menu-item ${activeTab === "profile" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <span className="menu-icon">👤</span> {t("brandPage.brandProfile")}
                </div>
              </>
            )}
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="brand-content">
          <div className="container">
            {!isBrand ? (
              <div className="brand-empty-state">
                {t("brandPage.notBrand")}
              </div>
            ) : (
              <>
                {activeTab === "recommended" && <RecommendedCV />}
                {activeTab === "jobs" && <MyJobPosts />}
                {activeTab === "profile" && <BrandProfileManager />}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}