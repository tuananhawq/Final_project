// src/pages/About.jsx
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import "../styles/about/about.css";

export default function About() {
  return (
    <>
      <Header />
      <main className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero__container">
            <h1 className="about-hero__title">Về REVLIVE</h1>
            <p className="about-hero__subtitle">
              Nền tảng booking Influencer & Host Livestream hàng đầu Việt Nam
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="about-intro">
          <div className="about-container">
            <div className="about-intro__content">
              <h2 className="about-section-title">REVLIVE là ai?</h2>
              <p className="about-text">
                REVLIVE là nền tảng booking Influencer & Host livestream đầu tiên tại Việt Nam,
                kết nối trực tiếp giữa <strong>Creator (Host, KOL, KOC, Influencer)</strong> và
                <strong>Agency/Brand</strong>. Chúng tôi giúp các thương hiệu dễ dàng tìm kiếm,
                xem portfolio, đặt booking và quản lý chiến dịch livestream một cách nhanh chóng,
                minh bạch và hiệu quả.
              </p>
              <p className="about-text">
                Với sứ mệnh "Revive - Review - View - Live", REVLIVE mang đến giải pháp toàn diện:
                từ khám phá talent phù hợp, đánh giá hiệu suất thực tế, theo dõi livestream đến
                đo lường kết quả chiến dịch một cách chính xác và minh bạch.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="about-mission">
          <div className="about-container">
            <div className="about-mission__grid">
              <div className="about-mission__item">
                <div className="about-mission__icon">🎯</div>
                <h3>Tầm nhìn</h3>
                <p>
                  Trở thành nền tảng booking livestream số 1 Việt Nam,
                  nơi mọi thương hiệu đều có thể tìm thấy creator phù hợp nhất
                  và mọi creator đều có cơ hội tỏa sáng.
                </p>
              </div>
              <div className="about-mission__item">
                <div className="about-mission__icon">🚀</div>
                <h3>Sứ mệnh</h3>
                <p>
                  Kết nối minh bạch, tối ưu hóa hiệu quả và nâng tầm giá trị
                  cho cả thương hiệu và creator trong ngành livestream bán hàng.
                </p>
              </div>
              <div className="about-mission__item">
                <div className="about-mission__icon">💎</div>
                <h3>Giá trị cốt lõi</h3>
                <p>
                  Minh bạch - Chuyên nghiệp - Hiệu quả - Sáng tạo - Đồng hành cùng sự phát triển.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/* Team Section */}
                {/* Team Section */}
        <section className="about-team">
          <div className="about-container">
            <h2 className="about-section-title about-section-title--center">
              Đội ngũ sáng lập
            </h2>
            <div className="about-team__grid">
              {/* Thành viên 1 */}
              <div className="team-member">
                <img src="/src/assets/image.png" alt="Lê Thị Hồng Ái" className="team-img" />
                <h4>Lê Thị Hồng Ái</h4>
                <p>Lead Designer</p>
              </div>

              {/* Thành viên 2 */}
              <div className="team-member">
                <img src="/src/assets/image1.png" alt="Nguyễn Thị Quỳnh Như" className="team-img" />
                <h4>Nguyễn Thị Quỳnh Như</h4>
                <p>CEO</p>
              </div>

              {/* Thành viên 3 */}
              <div className="team-member">
                <img src="/src/assets/image2.png" alt="Lê Tố Niệm" className="team-img" />
                <h4>Lê Tố Niệm</h4>
                <p>CMO</p>
              </div>

              {/* Thành viên 4 */}
              <div className="team-member">
                <img src="/src/assets/image3.png" alt="Phạm Minh Anh" className="team-img" />
                <h4>Phạm Minh Anh</h4>
                <p>CTO</p>
              </div>

              {/* Thành viên 5 */}
              <div className="team-member">
                <img src="/src/assets/image4.png" alt="Nguyễn Phượng Vi" className="team-img" />
                <h4>Nguyễn Phượng Vi</h4>
                <p>Visual & Brand Designer</p>
              </div>

              {/* Thành viên 6 */}
              <div className="team-member">
                <img src="/src/assets/image5.png" alt="Nguyễn Tuấn Anh" className="team-img" />
                <h4>Nguyễn Tuấn Anh</h4>
                <p>Backend</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <div className="about-container">
            <h2>Hợp tác cùng REVLIVE ngay hôm nay</h2>
            <p>Bạn là Creator? Đăng ký để tiếp cận hàng ngàn cơ hội booking.</p>
            <p>Bạn là Brand/Agency? Tìm kiếm và booking talent chỉ trong vài click.</p>
            <div className="about-cta__buttons">
              <a href="/register" className="btn-primary">Đăng ký ngay</a>
              <a href="/contact" className="btn-secondary">Liên hệ chúng tôi</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}