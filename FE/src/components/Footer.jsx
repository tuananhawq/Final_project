import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "../styles/home/home-footer.css";

export function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-footer__container">
        <div className="home-footer__grid">
          {/* Logo & Subscribe Section */}
          <div className="home-footer__section home-footer__section--logo">
            <img
              src="/src/assets/logo-revlive.png"
              alt="REVLIVE Logo"
              className="home-footer__logo"
            />
            <p className="home-footer__description">
              Simple Recipes That
              <br />
              Make You Feel Good
            </p>
            <div className="home-footer__subscribe">
              <input
                type="email"
                placeholder="Enter your email"
                className="home-footer__email-input"
              />
              <button className="home-footer__subscribe-btn">
                Subscribe
              </button>
            </div>
          </div>

          {/* About Us */}
          <div className="home-footer__section">
            <h3 className="home-footer__section-title">VỀ CHÚNG TÔI</h3>
            <ul className="home-footer__list">
              <li className="home-footer__list-item">
                <a href="/about" className="home-footer__link">
                  Giới thiệu
                </a>
              </li>
              <li className="home-footer__list-item">
                <a href="/careers" className="home-footer__link">
                  Tuyển dụng
                </a>
              </li>
              <li className="home-footer__list-item">
                <a href="/complaints" className="home-footer__link">
                  Gửi khiếu nại
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="home-footer__section">
            <h3 className="home-footer__section-title">TỔNG ĐÀI HỖ TRỢ</h3>
            <p className="home-footer__contact">036.333.5981</p>
          </div>

          {/* Office Location */}
          <div className="home-footer__section">
            <h3 className="home-footer__section-title">OFFICE LOCATION</h3>
            <p className="home-footer__contact">REVLIVE</p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="home-footer__social">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="home-footer__social-link"
          >
            <FaFacebook className="home-footer__social-icon" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="home-footer__social-link"
          >
            <FaTwitter className="home-footer__social-icon" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="home-footer__social-link"
          >
            <FaInstagram className="home-footer__social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
}

