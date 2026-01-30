import { useEffect, useRef, useState } from "react";
import { FaBars, FaMapMarkerAlt, FaSearch, FaTimes, FaGlobe, FaBell } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_URLS } from "../config/api.js";
import { getBanners } from "../services/bannerService.jsx";
import { getAgencies, getCreators, getTestimonials, getTopics } from "../services/homeService.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotificationById,
} from "../services/notificationService.jsx";
import "../styles/home/home-header.css";

export function Header() {
  // Khởi tạo user từ localStorage ngay lập tức để tránh hiện tượng mất user tạm thời
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef(null);
  const [notiOpen, setNotiOpen] = useState(false);
  const [notiLoading, setNotiLoading] = useState(false);
  const [notiItems, setNotiItems] = useState([]);
  const [notiUnread, setNotiUnread] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        localStorage.removeItem("user");
        return;
      }

      try {
        const res = await fetch(`${API_URLS.AUTH}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch {
        // Nếu fetch thất bại, chỉ xóa user nếu token không hợp lệ
        // Giữ user từ localStorage nếu có
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);



  useEffect(() => {
    const close = () => setOpenMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    const closeNoti = () => setNotiOpen(false);
    window.addEventListener("click", closeNoti);
    return () => window.removeEventListener("click", closeNoti);
  }, []);

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setNotiLoading(true);
      const data = await getMyNotifications();
      setNotiItems(data.notifications || []);
      setNotiUnread(data.unreadCount || 0);
    } catch {
      // ignore
    } finally {
      setNotiLoading(false);
    }
  };

  // Poll nhẹ để icon noti cập nhật (ví dụ staff xoá bài thì user thấy ngay)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    loadNotifications();
    const id = setInterval(() => loadNotifications(), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tự đóng ô search khi đổi route
  useEffect(() => {
    setSearchOpen(false);
    setSearchResults([]);
    setSearchQuery("");
  }, [location.pathname]);

  // Tìm kiếm dữ liệu trên trang Home và hiển thị dropdown
  useEffect(() => {
    const q = searchQuery.trim();
    const onHome = location.pathname === "/home" || location.pathname === "/";

    if (!searchOpen || !onHome) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    if (q.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const keyword = q.toLowerCase();
        const [agencies, creators, topics, testimonials, banners] = await Promise.all([
          getAgencies().catch(() => []),
          getCreators().catch(() => []),
          getTopics().catch(() => []),
          getTestimonials().catch(() => []),
          getBanners().catch(() => []),
        ]);

        if (cancelled) return;

        const results = [];

        agencies
          .filter((a) => {
            const text = `${a.name || ""} ${a.rank || ""} ${a.description || ""}`.toLowerCase();
            return text.includes(keyword);
          })
          .forEach((a) =>
            results.push({
              key: `agency-${a._id}`,
              type: "Agency / Brand",
              label: a.name,
              link: `/agency/${a._id}`,
            })
          );

        creators
          .filter((c) => c.name?.toLowerCase().includes(keyword))
          .forEach((c) =>
            results.push({
              key: `creator-${c._id}`,
              type: "Creator",
              label: c.name,
              link: `/creator-detail/${c._id}`,
            })
          );

        topics
          .filter((t) => t.title?.toLowerCase().includes(keyword))
          .forEach((t) =>
            results.push({
              key: `topic-${t._id}`,
              type: "Chủ đề",
              label: t.title,
              link: `/topic/${t._id}`,
            })
          );

        testimonials
          .filter((t) => t.name?.toLowerCase().includes(keyword))
          .forEach((t) =>
            results.push({
              key: `testimonial-${t._id}`,
              type: "Feedback",
              label: t.name,
              link: `/testimonial/${t._id}`,
            })
          );

        banners
          .filter((b) => b.title?.toLowerCase().includes(keyword))
          .forEach((b) =>
            results.push({
              key: `banner-${b._id}`,
              type: "Tin nổi bật",
              label: b.title,
              link: `/highlight/${b._id}`,
            })
          );

        // Thêm các tiêu đề section vào kết quả tìm kiếm
        const sectionTitles = [
          { key: "section-agencies", type: "Section", label: "Các Agency/Brand nổi bật trong tuần", link: "/home#section-agencies" },
          { key: "section-creators", type: "Section", label: "Các Host / Creator nổi bật trong tuần", link: "/home#section-creators" },
          { key: "section-topics", type: "Section", label: "Chủ đề yêu thích", link: "/home#section-topics" },
          { key: "section-highlights", type: "Section", label: "Tin nổi bật", link: "/home#section-highlights" },
          { key: "section-testimonials", type: "Section", label: "Mọi người nói gì về REVLIVE", link: "/home#section-testimonials" },
        ];

        sectionTitles
          .filter((s) => s.label.toLowerCase().includes(keyword))
          .forEach((s) => results.push(s));

        setSearchResults(results.slice(0, 10));
      } catch (e) {
        if (!cancelled) {
          console.error("Search home error:", e);
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery, searchOpen, location.pathname]);

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();
    if (!query) {
      navigate("/home");
      return;
    }
    navigate(`/home?search=${encodeURIComponent(query)}`);
  };




  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Kiểm tra role để ẩn/hiện các link
  const userRoles = user?.roles || [];
  const isUser = userRoles.includes("user") && !userRoles.includes("creator") && !userRoles.includes("brand");
  const isCreator = userRoles.includes("creator");
  const isBrand = userRoles.includes("brand");

  // Logic ẩn/hiện:
  // - User: ẩn cả Creator và Brand
  // - Creator: chỉ hiện Creator Page, không hiện Brand Page
  // - Brand: có thể hiện Brand Page
  // - Chưa đăng nhập: ẩn cả hai (phải đăng ký để xem)
  const showCreatorLink = isCreator;
  const showBrandLink = isBrand; // Chỉ hiển thị khi đã đăng nhập và là brand

  // Hàm kiểm tra link có active không
  const isActiveLink = (path) => {
    if (path === "/home" || path === "/") {
      return location.pathname === "/home" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="home-header">
      <div className="home-header__container">
        <div className="home-header__content">
          {/* Logo */}
          <Link to="/home" className="home-header__logo">
            <img
              src="/logo-revlive.png"
              alt="REVLIVE Logo"
              className="home-header__logo-img"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="home-header__nav">
            <Link
              to="/home"
              className={`home-header__nav-link ${isActiveLink("/home") ? "home-header__nav-link--active" : ""}`}
            >
              {t("header.home")}
            </Link>
            {showCreatorLink && (
              <Link
                to="/creator"
                className={`home-header__nav-link ${isActiveLink("/creator") ? "home-header__nav-link--active" : ""}`}
              >
                Creator Page
              </Link>
            )}
            {showBrandLink && (
              <Link
                to={isBrand ? "/brand/mynews" : "/brand"}
                className={`home-header__nav-link ${isActiveLink("/brand") ? "home-header__nav-link--active" : ""}`}
              >
                Brand Page
              </Link>
            )}
            {/* Brand page chỉ hiện cho creator, không hiện cho brand */}
            <Link
              to="/services"
              className={`home-header__nav-link ${isActiveLink("/services") ? "home-header__nav-link--active" : ""}`}
            >
              {t("header.services")}
            </Link>
            <Link
              to="/about"
              className={`home-header__nav-link ${isActiveLink("/about") ? "home-header__nav-link--active" : ""}`}
            >
              {t("header.about")}
            </Link>
            <Link
              to="/blog"
              className={`home-header__nav-link ${isActiveLink("/blog") ? "home-header__nav-link--active" : ""}`}
            >
              {t("header.blog")}
            </Link>
            <Link
              to="/job-posts"
              className={`home-header__nav-link ${isActiveLink("/job-posts") ? "home-header__nav-link--active" : ""}`}
            >
              {t("header.postJob")}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="home-header__right">
            {/* Search */}
            <div className={`home-header__search ${searchOpen ? "home-header__search--open" : ""}`}>
              <button
                className="home-header__search-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!searchOpen) {
                    setSearchOpen(true);
                    // focus input sau 1 frame
                    setTimeout(() => searchInputRef.current?.focus(), 0);
                  } else if (searchQuery.trim()) {
                    handleSearchSubmit();
                  }
                }}
              >
                <FaSearch className="home-header__icon" />
              </button>
              {searchOpen && (
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm trên REVLIVE..."
                  className="home-header__search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                />
              )}
              {searchOpen && (
                <div
                  className="home-header__search-results"
                  onClick={(e) => e.stopPropagation()}
                >
                  {searchLoading ? (
                    <div className="home-header__search-empty">
                      Đang tìm kiếm...
                    </div>
                  ) : searchQuery.trim().length < 2 ? (
                    <div className="home-header__search-empty">
                      Nhập ít nhất 2 ký tự để tìm trên trang Home.
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="home-header__search-empty">
                      Không tìm thấy kết quả phù hợp.
                    </div>
                  ) : (
                    searchResults.map((item) => (
                      <button
                        key={item.key}
                        className="home-header__search-item"
                        onClick={() => {
                          if (item.link.startsWith("/home#")) {
                            // Nếu là section link, navigate và scroll
                            navigate(item.link);
                            setTimeout(() => {
                              const hash = item.link.split("#")[1];
                              const element = document.getElementById(hash);
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth", block: "start" });
                              }
                            }, 100);
                          } else {
                            navigate(item.link);
                          }
                          setSearchOpen(false);
                          setSearchResults([]);
                          setSearchQuery("");
                        }}
                      >
                        <span className="home-header__search-item-type">
                          {item.type}
                        </span>
                        <span className="home-header__search-item-label">
                          {item.label}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              className="home-header__language-btn"
              onClick={toggleLanguage}
              title={language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "14px",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <FaGlobe style={{ fontSize: "16px" }} />
              <span>{language === "vi" ? "VI" : "EN"}</span>
            </button>

            {/* Notifications */}
            {user && (
              <div
                className="home-header__noti"
                onClick={(e) => {
                  e.stopPropagation();
                  const next = !notiOpen;
                  setNotiOpen(next);
                  if (next) loadNotifications();
                }}
                style={{ position: "relative" }}
                title={language === "vi" ? "Thông báo" : "Notifications"}
              >
                <button
                  type="button"
                  className="home-header__noti-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  <FaBell />
                </button>

                {notiUnread > 0 && (
                  <span
                    className="home-header__noti-badge"
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      minWidth: 18,
                      height: 18,
                      padding: "0 6px",
                      borderRadius: 999,
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid rgba(11, 11, 30, 0.9)",
                    }}
                  >
                    {notiUnread > 99 ? "99+" : notiUnread}
                  </span>
                )}

                {notiOpen && (
                  <div
                    className="home-header__noti-dropdown"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 52,
                      width: 360,
                      maxWidth: "90vw",
                      background: "rgba(17, 24, 39, 0.96)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                      zIndex: 9999,
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      <span>{language === "vi" ? "Thông báo" : "Notifications"}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await markAllNotificationsAsRead();
                          loadNotifications();
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#7dd3fc",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        {language === "vi" ? "Đã đọc hết" : "Mark all"}
                      </button>
                    </div>

                    <div style={{ maxHeight: 420, overflowY: "auto" }}>
                      {notiLoading ? (
                        <div style={{ padding: 12, color: "#9ca3af" }}>
                          {language === "vi" ? "Đang tải..." : "Loading..."}
                        </div>
                      ) : notiItems.length === 0 ? (
                        <div style={{ padding: 12, color: "#9ca3af" }}>
                          {language === "vi" ? "Chưa có thông báo" : "No notifications"}
                        </div>
                      ) : (
                        notiItems.map((n) => (
                          <div
                            key={n._id}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                              padding: 10,
                              borderBottom: "1px solid rgba(255,255,255,0.06)",
                              background: n.isRead ? "transparent" : "rgba(125,211,252,0.08)",
                            }}
                          >
                            <button
                              type="button"
                              onClick={async () => {
                                if (!n.isRead) await markNotificationAsRead(n._id);
                                loadNotifications();
                              }}
                              style={{
                                flex: 1,
                                textAlign: "left",
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                cursor: "pointer",
                                color: "#fff",
                              }}
                            >
                              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
                                {n.title}
                              </div>
                              <div style={{ fontSize: 12, color: "#d1d5db", lineHeight: 1.4 }}>
                                {n.message}
                              </div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                                {n.createdAt ? new Date(n.createdAt).toLocaleString("vi-VN") : ""}
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteNotificationById(n._id);
                                loadNotifications();
                              }}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "#9ca3af",
                                cursor: "pointer",
                                fontSize: 14,
                                padding: "2px 4px",
                              }}
                              title={language === "vi" ? "Xóa thông báo" : "Delete notification"}
                            >
                              ×
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Section */}
            {user ? (
              <div className="home-header__user">
                {/* AVATAR */}
                <div
                  className="home-header__user-info"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(!openMenu);
                  }}

                >
                  <div className="home-header__user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" />
                    ) : (
                      <span className="home-header__user-initial">
                        {user.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                </div>

                {/* DROPDOWN */}
                {openMenu && (
                  <div className="home-header__dropdown">
                    <div className="dropdown-user-center">
                      <div className="dropdown-avatar-lg">
                        {user.avatar ? (
                          <img src={user.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #7dd3fc', background: '#fff' }} />
                        ) : (
                          user.username?.[0]?.toUpperCase() || "U"
                        )}
                      </div>

                      <div className="dropdown-name">{user.username}</div>
                      <div className="dropdown-role">
                        {(() => {
                          const roles = user.roles || [];
                          // Ưu tiên hiển thị: admin > staff > creator > brand > user
                          if (roles.includes("admin")) return "admin";
                          if (roles.includes("staff")) return "staff";
                          if (roles.includes("creator")) return "creator";
                          if (roles.includes("brand")) return "brand";
                          return "user";
                        })()}
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-btn"
                      onClick={() => navigate("/profile")}
                    >
                      {t("header.personalInfo")}
                    </button>

                    {/* My Blogs - only for creator/brand */}
                    {(userRoles.includes("creator") || userRoles.includes("brand")) && (
                      <button
                        className="dropdown-btn"
                        onClick={() => navigate("/my-blogs")}
                      >
                        {t("header.myBlogs")}
                      </button>
                    )}

                    <button
                      className="dropdown-btn logout"
                      onClick={handleLogout}
                    >
                      {t("header.logout")}
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="home-header__auth">
                <Link to="/login" className="home-header__auth-link">
                  {t("header.login")}
                </Link>
                <Link to="/register" className="home-header__auth-link">
                  {t("header.register")}
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            className="home-header__mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes className="home-header__mobile-icon" /> : <FaBars className="home-header__mobile-icon" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="home-header__mobile-menu">
            <nav className="home-header__mobile-nav">
              <Link to="/home" className="home-header__mobile-link">
                {t("header.home")}
              </Link>
              {showCreatorLink && (
                <Link to="/creator" className="home-header__mobile-link">
                  Creator Page
                </Link>
              )}
              {showBrandLink && (
                <Link to={isBrand ? "/brand/mynews" : "/brand"} className="home-header__mobile-link">
                  Brand Page
                </Link>
              )}
              <Link to="/services" className="home-header__mobile-link">
                {t("header.services")}
              </Link>
              <Link to="/about" className="home-header__mobile-link">
                {t("header.about")}
              </Link>
              <Link to="/blog" className="home-header__mobile-link">
                {t("header.blog")}
              </Link>
              <Link to="/job-posts" className="home-header__mobile-link">
                {t("header.postJob")}
              </Link>
              {user ? (
                <button onClick={handleLogout} className="home-header__mobile-logout">
                  {t("header.logout")}
                </button>
              ) : (
                <>
                  <Link to="/login" className="home-header__mobile-link">
                    {t("header.login")}
                  </Link>
                  <Link to="/register" className="home-header__mobile-link">
                    {t("header.register")}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

