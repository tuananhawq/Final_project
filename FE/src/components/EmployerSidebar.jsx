// src/components/EmployerSidebar.jsx
import { useLocation, useNavigate } from "react-router-dom";

export function EmployerSidebar({ user, isCreator }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: "📰", label: "BẢNG TIN", path: "/creator" },
    { icon: "📢", label: "TUYỂN DỤNG ĐỀ XUẤT", path: "/job-offers" },
    { icon: "📋", label: "QUẢN LÝ CV", path: "/cv-management" },
    { icon: "🏠", label: "TIN TUYỂN DỤNG CỦA TÔI", path: "/my-jobs" },
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <aside className="employer-panel">
      <div className="panel-header">
        <div className="panel-avatar">
          <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="30" r="20" fill="#000" />
            <path d="M 25 60 Q 50 100 75 60 L 75 120 L 25 120 Z" fill="#000" />
            <circle cx="50" cy="30" r="20" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            <path d="M 25 60 Q 50 85 75 60" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="panel-info">
          <h3>{user?.username || "Tên User Tạm"}</h3>
          <p>{isCreator ? "Creator" : "User"}</p>
          <span>Tài khoản cấp {user?.premiumStatus === "premium" ? "3/3" : "1/3"}</span>
          {!isCreator && (
            <button className="upgrade-btn" onClick={() => navigate("/upgrade-creator")}>
              Nâng cấp Creator
            </button>
          )}
        </div>
      </div>

      <nav className="panel-menu">
        {menuItems.map((item) => {
          // Chỉ hiện các menu đặc biệt nếu là creator
          if (!isCreator && !["/creator", "/job-offers"].includes(item.path)) {
            return null;
          }

          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.path}
              className={`menu-item ${isActive ? "active" : ""}`}
              onClick={() => handleClick(item.path)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}