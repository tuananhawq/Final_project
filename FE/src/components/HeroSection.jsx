import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHeroes } from "../services/homeService.jsx";
import { useLanguage } from "../context/LanguageContext";
import defaultHeroBg from "../assets/anhbia3x12136-jp-2200w.png";
import "../styles/home/home-hero.css";

export function HeroSection() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    return <div className="home-hero">{t("hero.loading")}</div>;
  }

  if (!hero) {
    return null;
  }

  return (
    <section className="home-hero">
      {/* Background Image */}
      <div className="home-hero__background">
        <img
          src={hero.backgroundImage || defaultHeroBg}
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
            {hero.title || t("hero.defaultTitle")}
            <span className="home-hero__title-gradient">
              {" "}
              {hero.titleHighlight || t("hero.defaultHighlight")}
            </span>
          </h1>
          <p className="home-hero__description">
            {hero.description || t("hero.defaultDesc")}
          </p>
          <button className="home-hero__cta-btn" onClick={() => navigate("/about")}>
            {hero.ctaText || t("hero.cta")}
          </button>
        </div>
      </div>
    </section>
  );
}


