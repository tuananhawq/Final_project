import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCreators } from "../services/homeService.jsx";
import "../styles/home/home-creators.css";

export function TopCreatorsSection({ searchQuery = "" }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const data = await getCreators();
        setCreators(data);
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredCreators = normalizedSearch
    ? creators.filter((creator) =>
        creator.name?.toLowerCase().includes(normalizedSearch)
      )
    : creators;

  if (loading) {
    return <div className="home-creators">Loading...</div>;
  }

  if (filteredCreators.length === 0) {
    return null;
  }

  return (
    <section id="section-creators" className="home-creators">
      <div className="home-creators__container">
        {/* Title with decorative lines */}
        <div className="home-creators__title-wrapper">
          <div className="home-creators__decorative-line" />
          <h2 className="home-creators__title">
            Các Host / Creator nổi bật trong tuần
          </h2>
          <div className="home-creators__decorative-line" />
        </div>

        {/* Creators Grid */}
        <div className="home-creators__grid">
          {filteredCreators.map((creator) => (
            <Link
              key={creator._id}
              to={`/creator-detail/${creator._id}`}
              className="home-creators__item"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="home-creators__avatar-wrapper">
                <div className="home-creators__avatar-border">
                  <div className="home-creators__avatar-inner">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="home-creators__avatar-image"
                    />
                  </div>
                </div>
              </div>
              <h3 className="home-creators__name">{creator.name}</h3>
              <p className="home-creators__description">
                {creator.description}
                {creator.followers && ` - ${creator.followers} followers`}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

