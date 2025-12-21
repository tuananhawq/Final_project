import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaBars, FaTimes } from "react-icons/fa";
import "../styles/home/home-header.css";

export function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Lấy thông tin user từ localStorage hoặc API
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="home-header">
      <div className="home-header__container">
        <div className="home-header__content">
          {/* Logo */}
          <Link to="/home" className="home-header__logo">
            <span className="home-header__logo-text">REVLIVE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="home-header__nav">
            <Link to="/home" className="home-header__nav-link home-header__nav-link--active">
              Trang chủ
            </Link>
            <Link to="/creater" className="home-header__nav-link">
              Creater Page
            </Link>
            <Link to="/brand" className="home-header__nav-link">
              Brand Page
            </Link>
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
            {/* Search Icon */}
            <button className="home-header__search-btn">
              <FaSearch className="home-header__icon" />
            </button>

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
                <div className="home-header__user-info">
                  <div className="home-header__user-avatar">
                    <span className="home-header__user-initial">
                      {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="home-header__user-name">
                    Chào, {user.name || user.username || "User"}
                  </span>
                </div>
                <button onClick={handleLogout} className="home-header__logout-btn">
                  Đăng xuất
                </button>
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
              <Link to="/creater" className="home-header__mobile-link">
                Creater Page
              </Link>
              <Link to="/brand" className="home-header__mobile-link">
                Brand Page
              </Link>
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

