// src/pages/About.jsx
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import "../styles/about/about.css";
import image1 from "../assets/image.png";
import image2 from "../assets/image1.png";
import image3 from "../assets/image2.png";
import image4 from "../assets/image3.png";
import image5 from "../assets/image4.png";
import image6 from "../assets/image5.png";

export default function About() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero__container">
            <h1 className="about-hero__title">{t("about.title")}</h1>
            <p className="about-hero__subtitle">
              {t("about.subtitle")}
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="about-intro">
          <div className="about-container">
            <div className="about-intro__content">
              <h2 className="about-section-title">{t("about.whoIsRevlive")}</h2>
              <p className="about-text" dangerouslySetInnerHTML={{ __html: t("about.intro1") }} />
              <p className="about-text">
                {t("about.intro2")}
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
                <h3>{t("about.vision")}</h3>
                <p>
                  {t("about.visionContent")}
                </p>
              </div>
              <div className="about-mission__item">
                <div className="about-mission__icon">🚀</div>
                <h3>{t("about.mission")}</h3>
                <p>
                  {t("about.missionContent")}
                </p>
              </div>
              <div className="about-mission__item">
                <div className="about-mission__icon">💎</div>
                <h3>{t("about.coreValues")}</h3>
                <p>
                  {t("about.coreValuesContent")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <div className="about-container">
            <h2 className="about-section-title about-section-title--center">
              {t("about.foundingTeam")}
            </h2>
            <div className="about-team__grid">
              {/* Thành viên 1 */}
              <div className="team-member">
                <img src={image1} alt="Lê Thị Hồng Ái" className="team-img" />
                <h4>Lê Thị Hồng Ái</h4>
                <p>{t("about.leadDesigner")}</p>
              </div>

              {/* Thành viên 2 */}
              <div className="team-member">
                <img src={image2} alt="Nguyễn Thị Quỳnh Như" className="team-img" />
                <h4>Nguyễn Thị Quỳnh Như</h4>
                <p>{t("about.ceo")}</p>
              </div>

              {/* Thành viên 3 */}
              <div className="team-member">
                <img src={image3} alt="Lê Tố Niệm" className="team-img" />
                <h4>Lê Tố Niệm</h4>
                <p>{t("about.cmo")}</p>
              </div>

              {/* Thành viên 4 */}
              <div className="team-member">
                <img src={image4} alt="Phạm Minh Anh" className="team-img" />
                <h4>Phạm Minh Anh</h4>
                <p>{t("about.cto")}</p>
              </div>

              {/* Thành viên 5 */}
              <div className="team-member">
                <img src={image5} alt="Nguyễn Phượng Vi" className="team-img" />
                <h4>Nguyễn Phượng Vi</h4>
                <p>{t("about.visualDesigner")}</p>
              </div>

              {/* Thành viên 6 */}
              <div className="team-member">
                <img src={image6} alt="Nguyễn Tuấn Anh" className="team-img" />
                <h4>Nguyễn Tuấn Anh</h4>
                <p>{t("about.backend")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <div className="about-container">
            <h2>{t("about.cooperateTitle")}</h2>
            <p>{t("about.cooperateCreator")}</p>
            <p>{t("about.cooperateBrand")}</p>
            <div className="about-cta__buttons">
              <a href="/register" className="btn-primary">{t("about.registerNow")}</a>
              <a href="/contact" className="btn-secondary">{t("about.contactUs")}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}