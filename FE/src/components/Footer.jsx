import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { getFooter } from "../services/homeService.jsx";
import "../styles/home/home-footer.css";

export function Footer() {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await getFooter();
        setFooter(data);
      } catch (error) {
        console.error("Error fetching footer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  if (loading) {
    return <div className="home-footer">Loading...</div>;
  }

  if (!footer) {
    return null;
  }

  return (
    <footer className="home-footer">
      <div className="home-footer__container">
        <div className="home-footer__grid">
          {/* Logo & Subscribe Section */}
          <div className="home-footer__section home-footer__section--logo">
            <img
              src="/logo-revlive.png"
              alt="REVLIVE Logo"
              className="home-footer__logo"
            />
            <p className="home-footer__description">
              {footer.description || "Simple Recipes That Make You Feel Good"}
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
              {footer.footerLinks && footer.footerLinks.length > 0 ? (
                footer.footerLinks.map((link, index) => (
                  <li key={index} className="home-footer__list-item">
                    <a href={link.url} className="home-footer__link">
                      {link.label}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li className="home-footer__list-item">
                    <a href="/about" className="home-footer__link">
                      Giới thiệu
                    </a>
                  </li>
                  <li className="home-footer__list-item">
                    <a href="/legal" className="home-footer__link">
                      Điều khoản & Chính sách
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
                </>
              )}
            </ul>
          </div>

          {/* Support */}
          <div className="home-footer__section">
            <h3 className="home-footer__section-title">TỔNG ĐÀI HỖ TRỢ</h3>
            <p className="home-footer__contact">{footer.supportPhone || "036.333.5981"}</p>
          </div>

          {/* Office Location */}
          <div className="home-footer__section">
            <h3 className="home-footer__section-title">OFFICE LOCATION</h3>
            <p className="home-footer__contact">{footer.officeLocation || "REVLIVE"}</p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="home-footer__social">
          <a
            href={footer.socialLinks?.facebook || "https://facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="home-footer__social-link"
          >
            <FaFacebook className="home-footer__social-icon" />
          </a>
          <a
            href={footer.socialLinks?.twitter || "https://twitter.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="home-footer__social-link"
          >
            <FaTwitter className="home-footer__social-icon" />
          </a>
          <a
            href={footer.socialLinks?.instagram || "https://instagram.com"}
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

