import "../styles/home/home-hero.css";

export function HeroSection() {
  return (
    <section className="home-hero">
      {/* Background Image */}
      <div className="home-hero__background">
        <img
          src="/src/assets/anhbia3x12136-jp-2200w.png"
          alt="Hero Banner"
          className="home-hero__bg-image"
        />
        {/* Gradient Overlay */}
        <div className="home-hero__gradient-overlay" />
        <div className="home-hero__dark-overlay" />
      </div>

      {/* Content */}
      <div className="home-hero__content">
        <div className="home-hero__text-wrapper">
          <h1 className="home-hero__title">
            Nền tảng kết nối
            <span className="home-hero__title-gradient">
              {" "}
              Creator & Brand
            </span>
          </h1>
          <p className="home-hero__description">
            REVLIVE - Nơi các Agency, Brand và Creator gặp gỡ, hợp tác và phát triển cùng nhau
          </p>
          <button className="home-hero__cta-btn">
            Khám phá ngay
          </button>
        </div>
      </div>
    </section>
  );
}

