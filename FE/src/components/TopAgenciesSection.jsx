import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAgencies } from "../services/homeService.jsx";
import "../styles/home/home-agencies.css";

export function TopAgenciesSection({ searchQuery = "" }) {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const data = await getAgencies();
        setAgencies(data);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredAgencies = normalizedSearch
    ? agencies.filter((agency) => {
        const text = `${agency.name || ""} ${agency.rank || ""} ${agency.description || ""}`.toLowerCase();
        return text.includes(normalizedSearch);
      })
    : agencies;

  if (loading) {
    return <div className="home-agencies">Loading...</div>;
  }

  if (filteredAgencies.length === 0) {
    return null;
  }

  return (
    <section id="section-agencies" className="home-agencies">
      <div className="home-agencies__container">
        {/* Title with decorative lines */}
        <div className="home-agencies__title-wrapper">
          <div className="home-agencies__decorative-line" />
          <h2 className="home-agencies__title">
            Các Agency/Brand nổi bật trong tuần
          </h2>
          <div className="home-agencies__decorative-line" />
        </div>

        {/* Cards Grid */}
        <div className="home-agencies__grid">
          {filteredAgencies.map((agency) => (
            <Link
              key={agency._id}
              to={`/agency/${agency._id}`}
              className={`home-agencies__card-wrapper ${
                agency.size === "large"
                  ? "home-agencies__card-wrapper--large"
                  : ""
              }`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className={`home-agencies__card ${
                  agency.size === "large"
                    ? "home-agencies__card--large"
                    : "home-agencies__card--small"
                }`}
              >
                <img
                  src={agency.image}
                  alt={agency.name}
                  className="home-agencies__card-image"
                />
                <div className="home-agencies__card-overlay" />
                <div className="home-agencies__card-content">
                  <div className="home-agencies__card-badge">
                    <span className="home-agencies__card-rank">{agency.rank}</span>
                  </div>
                  <h3 className="home-agencies__card-name">{agency.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

