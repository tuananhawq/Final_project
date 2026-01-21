import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTopics } from "../services/homeService.jsx";
import "../styles/home/home-topics.css";

const positions = ["left", "center", "right"];

export function TopicsSection({ searchQuery = "" }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredTopics = normalizedSearch
    ? topics.filter((topic) =>
        topic.title?.toLowerCase().includes(normalizedSearch)
      )
    : topics;

  if (loading) {
    return <div className="home-topics">Loading...</div>;
  }

  if (filteredTopics.length === 0) {
    return null;
  }

  return (
    <section id="section-topics" className="home-topics">
      <div className="home-topics__container">
        {/* Title with decorative lines */}
        <div className="home-topics__title-wrapper">
          <div className="home-topics__decorative-line" />
          <h2 className="home-topics__title">
            Chủ đề yêu thích
          </h2>
          <div className="home-topics__decorative-line" />
        </div>

        {/* Topics Images with Overlapping Effect */}
        <div className="home-topics__grid">
          {filteredTopics.map((topic, index) => {
            const position = topic.position || positions[index % 3];
            return (
              <Link
                key={topic._id}
                to={`/topic/${topic._id}`}
                className={`home-topics__item home-topics__item--${position}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="home-topics__card">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="home-topics__card-image"
                  />
                  <div className="home-topics__card-overlay" />
                  <div className="home-topics__card-content">
                    <h3 className="home-topics__card-title">{topic.title}</h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

