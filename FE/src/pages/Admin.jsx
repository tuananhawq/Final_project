import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HomeManagement } from "../components/HomeManagement.jsx";
import { BlogManagement } from "../components/BlogManagement.jsx";
import { UserManagement } from "../components/UserManagement.jsx";
import { ImageManagement } from "../components/ImageManagement.jsx";
import TransactionManagement from "../components/TransactionManagement.jsx";
import PaymentConfigManagement from "../components/PaymentConfigManagement.jsx";
import LegalConfigManagement from "../components/LegalConfigManagement.jsx";
import { StaffManagement } from "../components/StaffManagement.jsx";
import { AdminJobPostManagement } from "../components/AdminJobPostManagement.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import "../styles/dashboard.css";

export default function Admin() {
  const [adminName, setAdminName] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Lấy tab từ URL, mặc định là "dashboard"
  const activeMenu = searchParams.get("tab") || "dashboard";
  const isAdmin = userRoles.includes("admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const roles = decoded.roles || [];
      setUserRoles(roles);

      // Chỉ cho phép role "admin" hoặc "staff" vào trang Admin
      if (!roles.includes("admin") && !roles.includes("staff")) {
        navigate("/home");
        return;
      }

      // Lấy thông tin user từ localStorage nếu có
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAdminName(user.name || user.fullName || user.email || (roles.includes("admin") ? "Admin" : "Staff"));
      } else {
        setAdminName(roles.includes("admin") ? "Admin" : "Staff");
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Hàm xử lý khi click menu item
  const handleMenuClick = (menu) => {
    setSearchParams({ tab: menu });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">{t("admin.dashboard")}</div>
          <nav>
            <div
              className={`nav-item ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => handleMenuClick("dashboard")}
              style={{ cursor: "pointer" }}
            >
              <span>📊</span> {t("admin.dashboard")}
            </div>
            <div
              className={`nav-item ${activeMenu === "home-management" ? "active" : ""}`}
              onClick={() => handleMenuClick("home-management")}
              style={{ cursor: "pointer" }}
            >
              <span>🏠</span> {t("admin.homeManagement")}
            </div>
            {/* Blog Management - For Staff and Admin */}
            {(userRoles.includes("staff") || userRoles.includes("admin")) && (
              <div
                className={`nav-item ${activeMenu === "blog-management" ? "active" : ""}`}
                onClick={() => handleMenuClick("blog-management")}
                style={{ cursor: "pointer" }}
              >
                <span>📝</span> {t("admin.blogManagement")}
              </div>
            )}

            {/* Job Post Management - For Staff (and Admin) */}
            {(userRoles.includes("staff") || userRoles.includes("admin")) && (
              <div
                className={`nav-item ${activeMenu === "job-post-management" ? "active" : ""}`}
                onClick={() => handleMenuClick("job-post-management")}
                style={{ cursor: "pointer" }}
              >
                <span>📢</span> Quản lý Bài đăng
              </div>
            )}
            <div
              className={`nav-item ${activeMenu === "user-management" ? "active" : ""}`}
              onClick={() => handleMenuClick("user-management")}
              style={{ cursor: "pointer" }}
            >
              <span>👥</span> {t("admin.userManagement")}
            </div>
            {isAdmin && (
              <div
                className={`nav-item ${activeMenu === "staff-management" ? "active" : ""}`}
                onClick={() => handleMenuClick("staff-management")}
                style={{ cursor: "pointer" }}
              >
                <span>👔</span> {t("admin.staffManagement")}
              </div>
            )}
            <div
              className={`nav-item ${activeMenu === "image-management" ? "active" : ""}`}
              onClick={() => handleMenuClick("image-management")}
              style={{ cursor: "pointer" }}
            >
              <span>🖼️</span> {t("admin.imageManagement")}
            </div>
            <div
              className={`nav-item ${activeMenu === "transaction-management" ? "active" : ""}`}
              onClick={() => handleMenuClick("transaction-management")}
              style={{ cursor: "pointer" }}
            >
              <span>💳</span> {t("admin.transactionManagement")}
            </div>
            <div
              className={`nav-item ${activeMenu === "payment-config" ? "active" : ""}`}
              onClick={() => handleMenuClick("payment-config")}
              style={{ cursor: "pointer" }}
            >
              <span>⚙️</span> {t("admin.paymentConfig")}
            </div>
            <div
              className={`nav-item ${activeMenu === "legal-config" ? "active" : ""}`}
              onClick={() => handleMenuClick("legal-config")}
              style={{ cursor: "pointer" }}
            >
              <span>📄</span> {t("admin.legalConfig")}
            </div>
          </nav>
          <div className="sidebar-footer">© 2026 Company</div>
        </aside>

        {/* MAIN */}
        <div className="dashboard-main">
          {/* HEADER */}
          <header className="dashboard-header">
            <div className="header-left">
              <div className="header-title">{t("admin.dashboard")}</div>
              <div className="header-subtitle">
                {t("admin.todaySummary")}
              </div>
            </div>
            <div className="header-right">
              <div className="staff-info">
                <span className="staff-name">{adminName}</span>
                <span className="staff-role">{isAdmin ? "Admin" : "Staff"}</span>
              </div>
              <button className="header-btn" onClick={handleLogout}>
                {t("admin.logout")}
              </button>
              <div className="avatar" />
            </div>
          </header>

          {/* CONTENT */}
          <main className="dashboard-content">
            {activeMenu === "home-management" ? (
              <HomeManagement />
            ) : activeMenu === "blog-management" &&
              (userRoles.includes("staff") || userRoles.includes("admin")) ? (
              <BlogManagement />
            ) : activeMenu === "job-post-management" &&
              (userRoles.includes("staff") || userRoles.includes("admin")) ? (
              <AdminJobPostManagement />
            ) : activeMenu === "user-management" ? (
              <UserManagement />
            ) : activeMenu === "staff-management" && isAdmin ? (
              <StaffManagement />
            ) : activeMenu === "image-management" ? (
              <ImageManagement />
            ) : activeMenu === "transaction-management" ? (
              <TransactionManagement />
            ) : activeMenu === "payment-config" ? (
              <PaymentConfigManagement />
            ) : activeMenu === "legal-config" ? (
              <LegalConfigManagement />
            ) : (
              <DashboardStats />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
