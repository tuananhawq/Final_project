// src/components/EmployerSidebar.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export function EmployerSidebar({ user, isCreator }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const menuItems = [
    { icon: "📰", label: t("employerSidebar.dashboard"), path: "/creator" },
    { icon: "📢", label: t("employerSidebar.jobSuggestions"), path: "/job-offers" },
    { icon: "📋", label: t("employerSidebar.cvManagement"), path: "/cv-management" },
    { icon: "🏠", label: t("employerSidebar.myJobs"), path: "/my-jobs" },
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
          <h3>{user?.username || t("employerSidebar.userTemp")}</h3>
          <p>{isCreator ? "Creator" : "User"}</p>
          <span>{t("employerSidebar.level")} {user?.premiumStatus === "premium" ? "3/3" : "1/3"}</span>
          {!isCreator && (
            <button className="upgrade-btn" onClick={() => navigate("/upgrade-creator")}>
              {t("employerSidebar.upgrade")}
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