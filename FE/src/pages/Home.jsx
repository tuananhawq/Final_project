import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { TopAgenciesSection } from "../components/TopAgenciesSection";
import { TopCreatorsSection } from "../components/TopCreatorsSection";
import { TopicsSection } from "../components/TopicsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { BannerSection } from "../components/BannerSection";
import { Footer } from "../components/Footer";
import { HighlightFeed } from "../components/HighlightFeed";
import "../styles/home/index.css";

export default function Home() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Kiểm tra token khi component mount
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  return (
    <div className="home-page">
      <Header />
      <main className="home-page__main">
        <HeroSection />
        <TopAgenciesSection />
        <TopCreatorsSection />
        <TopicsSection />
        {/* <HighlightFeed /> */}
        <TestimonialsSection />
        {/* <BannerSection /> */}
        
      </main>
      <Footer />
    </div>
  );
}
