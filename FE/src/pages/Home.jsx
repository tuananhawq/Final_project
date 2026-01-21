import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search") || "";

  // Scroll đến section khi có hash trong URL
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1); // Bỏ dấu #
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300); // Delay để đảm bảo các section đã render
    }
  }, [location.hash]);

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
        <TopAgenciesSection searchQuery={searchQuery} />
        <TopCreatorsSection searchQuery={searchQuery} />
        <TopicsSection searchQuery={searchQuery} />
        <HighlightFeed searchQuery={searchQuery} />
        <TestimonialsSection searchQuery={searchQuery} />
        {/* <BannerSection /> */}
        
      </main>
      <Footer />
    </div>
  );
}
