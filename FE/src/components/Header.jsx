import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaBars, FaTimes } from "react-icons/fa";
import { API_URLS } from "../config/api.js";
import { getAgencies, getCreators, getTopics, getTestimonials } from "../services/homeService.jsx";
import { getBanners } from "../services/bannerService.jsx";
import "../styles/home/home-header.css";

export function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
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
        setUser(null);
      }
    };

    fetchUser();
  }, []);



  useEffect(() => {
    const close = () => setOpenMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
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
  // - Creator: ẩn Brand
  // - Brand: ẩn Creator
  // - Chưa đăng nhập: hiển thị cả hai
  const showCreatorLink = !isUser && !isBrand;
  const showBrandLink = !isUser && !isCreator;

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
            <Link to="/home" className="home-header__nav-link home-header__nav-link--active">
              Trang chủ
            </Link>
            {showCreatorLink && (
              <Link to="/creator" className="home-header__nav-link">
                Creator Page
              </Link>
            )}
            {showBrandLink && (
              <Link to="/brand" className="home-header__nav-link">
                Brand Page
              </Link>
            )}
            <Link to="/services" className="home-header__nav-link">
              Dịch vụ
            </Link>
            <Link to="/about" className="home-header__nav-link">
              Về chúng tôi
            </Link>
            <Link to="/blog" className="home-header__nav-link">
              Blog / News
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

            {/* Location */}
            <div className="home-header__location">
              <FaMapMarkerAlt className="home-header__icon" />
              <div className="home-header__location-info">
                <span className="home-header__location-label">Language</span>
                <span className="home-header__location-value">VIỆT NAM</span>
              </div>
            </div>

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
                        {user.roles?.join(", ")}
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-btn"
                      onClick={() => navigate("/profile")}
                    >
                      Thông tin cá nhân
                    </button>

                    <button
                      className="dropdown-btn logout"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="home-header__auth">
                <Link to="/login" className="home-header__auth-link">
                  Đăng nhập
                </Link>
                <Link to="/register" className="home-header__auth-link">
                  Đăng ký
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
                Trang chủ
              </Link>
              {showCreatorLink && (
                <Link to="/creator" className="home-header__mobile-link">
                  Creator Page
                </Link>
              )}
              {showBrandLink && (
                <Link to="/brand" className="home-header__mobile-link">
                  Brand Page
                </Link>
              )}
              <Link to="/services" className="home-header__mobile-link">
                Dịch vụ
              </Link>
              <Link to="/about" className="home-header__mobile-link">
                Về chúng tôi
              </Link>
              <Link to="/blog" className="home-header__mobile-link">
                Blog / News
              </Link>
              {user ? (
                <button onClick={handleLogout} className="home-header__mobile-logout">
                  Đăng xuất
                </button>
              ) : (
                <>
                  <Link to="/login" className="home-header__mobile-link">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="home-header__mobile-link">
                    Đăng ký
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

