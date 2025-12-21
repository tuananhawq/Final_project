import "../styles/home/home-agencies.css";

const agencies = [
  {
    id: 2,
    rank: "TOP 1",
    name: "CREATIVE AGENCY",
    image: "/src/assets/anhbia3x12136-jp-2200w.png",
    size: "large",
  },
  {
    id: 1,
    rank: "TOP 2",
    name: "DIGITAL BRAND",
    image: "/src/assets/anhbia3x12136-jp-2200w.png",
    size: "small",
  },
  {
    id: 3,
    rank: "TOP 3",
    name: "MARKETING PRO",
    image: "/src/assets/anhbia3x12136-jp-2200w.png",
    size: "small",
  },
];

export function TopAgenciesSection() {
  return (
    <section className="home-agencies">
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
          {agencies.map((agency) => (
            <div
              key={agency.id}
              className={`home-agencies__card-wrapper ${
                agency.size === "large"
                  ? "home-agencies__card-wrapper--large"
                  : ""
              }`}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

