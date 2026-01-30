import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HomeManagement } from "../components/HomeManagement.jsx";
import { BlogManagement } from "../components/BlogManagement.jsx";
import { UserManagement } from "../components/UserManagement.jsx";
import { ImageManagement } from "../components/ImageManagement.jsx";
import TransactionManagement from "../components/TransactionManagement.jsx";
import PaymentConfigManagement from "../components/PaymentConfigManagement.jsx";
import { AdminJobPostManagement } from "../components/AdminJobPostManagement.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [staffName, setStaffName] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy tab từ URL, mặc định là "dashboard"
  const activeMenu = searchParams.get("tab") || "dashboard";

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

      // Cho phép staff, admin, user, creator, brand vào trang Dashboard
      // Nhưng chỉ staff và admin mới có thể truy cập tất cả các tab
      const allowedRoles = ["staff", "admin", "user", "creator", "brand"];
      if (!roles.some(role => allowedRoles.includes(role))) {
        navigate("/home");
        return;
      }

      // Lấy thông tin user từ localStorage nếu có
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setStaffName(user.name || user.fullName || user.username || user.email || "User");
      } else {
        setStaffName("User");
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
          <div className="sidebar-logo">MyDashboard</div>
          <nav>
            <div
              className={`nav-item ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => handleMenuClick("dashboard")}
              style={{ cursor: "pointer" }}
            >
              <span>📊</span> Dashboard
            </div>
            {/* Chỉ staff và admin mới thấy các menu quản lý */}
            {(userRoles.includes("staff") || userRoles.includes("admin")) && (
              <>
                <div
                  className={`nav-item ${activeMenu === "home-management" ? "active" : ""}`}
                  onClick={() => handleMenuClick("home-management")}
                  style={{ cursor: "pointer" }}
                >
                  <span>🏠</span> Quản lý Home
                </div>
                <div
                  className={`nav-item ${activeMenu === "user-management" ? "active" : ""}`}
                  onClick={() => handleMenuClick("user-management")}
                  style={{ cursor: "pointer" }}
                >
                  <span>👥</span> Quản lý Users
                </div>
                <div
                  className={`nav-item ${activeMenu === "image-management" ? "active" : ""}`}
                  onClick={() => handleMenuClick("image-management")}
                  style={{ cursor: "pointer" }}
                >
                  <span>🖼️</span> Quản lý Hình ảnh
                </div>
                <div
                  className={`nav-item ${activeMenu === "transaction-management" ? "active" : ""}`}
                  onClick={() => handleMenuClick("transaction-management")}
                  style={{ cursor: "pointer" }}
                >
                  <span>💳</span> Quản lý Giao dịch
                </div>
                <div
                  className={`nav-item ${activeMenu === "payment-config" ? "active" : ""}`}
                  onClick={() => handleMenuClick("payment-config")}
                  style={{ cursor: "pointer" }}
                >
                  <span>⚙️</span> Cấu hình Thanh toán
                </div>
                <div
                  className={`nav-item ${activeMenu === "jobpost-management" ? "active" : ""}`}
                  onClick={() => handleMenuClick("jobpost-management")}
                  style={{ cursor: "pointer" }}
                >
                  <span>📄</span> Quản lý bài đăng
                </div>
              </>
            )}
            {/* Tất cả các role có quyền đều thấy menu Blog Management */}
            <div
              className={`nav-item ${activeMenu === "blog-management" ? "active" : ""}`}
              onClick={() => handleMenuClick("blog-management")}
              style={{ cursor: "pointer" }}
            >
              <span>📝</span> Quản lý Blog
            </div>
          </nav>
          <div className="sidebar-footer">© 2026 Company</div>
        </aside>

        {/* MAIN */}
        <div className="dashboard-main">
          {/* HEADER */}
          <header className="dashboard-header">
            <div className="header-left">
              <div className="header-title">Dashboard tổng quan</div>
              <div className="header-subtitle">
                Tổng hợp số liệu trong ngày hôm nay
              </div>
            </div>
            <div className="header-right">
              <div className="staff-info">
                <span className="staff-name">{staffName}</span>
                <span className="staff-role">
                  {userRoles.includes("admin") ? "Admin" : 
                   userRoles.includes("staff") ? "Staff" :
                   userRoles.includes("creator") ? "Creator" :
                   userRoles.includes("brand") ? "Brand" : "User"}
                </span>
              </div>
              <button className="header-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
              <div className="avatar" />
            </div>
          </header>

          {/* CONTENT */}
          <main className="dashboard-content">
            {activeMenu === "home-management" ? (
              <HomeManagement />
            ) : activeMenu === "blog-management" ? (
              <BlogManagement />
            ) : activeMenu === "user-management" ? (
              <UserManagement />
            ) : activeMenu === "image-management" ? (
              <ImageManagement />
            ) : activeMenu === "transaction-management" ? (
              <TransactionManagement />
            ) : activeMenu === "payment-config" ? (
              <PaymentConfigManagement />
            ) : activeMenu === "jobpost-management" ? (
              <AdminJobPostManagement />
            ) : (
              <DashboardStats />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


