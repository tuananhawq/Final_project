import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaBars, FaTimes } from "react-icons/fa";
// import { jwtDecode } from "jwt-decode";
import "../styles/home/home-header.css";

export function Header() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/me", {
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
            <img 
              src="/src/assets/logo-revlive.png" 
              alt="REVLIVE Logo" 
              className="home-header__logo-img" 
            />
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
                          <img src={user.avatar} alt="avatar" style={{width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #7dd3fc', background: '#fff'}} />
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

