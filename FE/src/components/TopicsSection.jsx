import "../styles/home/home-topics.css";

const topics = [
  {
    id: 1,
    title: "Gaming",
    image: "/src/assets/anhbia3x12136-jp-2200w.png",
  },
  {
    id: 2,
    title: "Beauty & Fashion",
    image: "/src/assets/anhbia3x12136-jp-2200w.png",
  },
  {
    id: 3,
    title: "Technology",
    image: "/src/assets/anhbia3x12136-jp-2200w.png",
  },
];

export function TopicsSection() {
  return (
    <section className="home-topics">
      <div className="home-topics__container">
        {/* Title with decorative lines */}
        <div className="home-topics__title-wrapper">
          <div className="home-topics__decorative-line" />
          <h2 className="home-topics__title">
            Chủ đề yêu thích trong tuần
          </h2>
          <div className="home-topics__decorative-line" />
        </div>

        {/* Topics Images with Overlapping Effect */}
        <div className="home-topics__grid">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className={`home-topics__item ${
                index === 0
                  ? "home-topics__item--left"
                  : index === 1
                  ? "home-topics__item--center"
                  : "home-topics__item--right"
              }`}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

