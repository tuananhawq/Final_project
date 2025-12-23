import { useEffect, useState } from "react";
import { getHeroes } from "../services/homeService.jsx";
import "../styles/home/home-hero.css";

export function HeroSection() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const heroes = await getHeroes();
        if (heroes && heroes.length > 0) {
          setHero(heroes[0]); // Lấy hero đầu tiên
        }
      } catch (error) {
        console.error("Error fetching hero:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  if (loading) {
    return <div className="home-hero">Loading...</div>;
  }

  if (!hero) {
    return null;
  }

  return (
    <section className="home-hero">
      {/* Background Image */}
      <div className="home-hero__background">
        <img
          src={hero.backgroundImage || "/src/assets/anhbia3x12136-jp-2200w.png"}
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
            {hero.title || "Nền tảng kết nối"}
            <span className="home-hero__title-gradient">
              {" "}
              {hero.titleHighlight || "Creator & Brand"}
            </span>
          </h1>
          <p className="home-hero__description">
            {hero.description || "REVLIVE - Nơi các Agency, Brand và Creator gặp gỡ, hợp tác và phát triển cùng nhau"}
          </p>
          <button className="home-hero__cta-btn">
            {hero.ctaText || "Khám phá ngay"}
          </button>
        </div>
      </div>
    </section>
  );
}

