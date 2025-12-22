import "../styles/home/home-creators.css";

const creators = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    description: "Content Creator - 1.2M followers",
    avatar: "/src/assets/logo-revlive.png",
  },
  {
    id: 2,
    name: "Trần Thị B",
    description: "Livestream Host - 850K followers",
    avatar: "/src/assets/logo-revlive.png",
  },
  {
    id: 3,
    name: "Lê Văn C",
    description: "Gaming Streamer - 2.1M followers",
    avatar: "/src/assets/logo-revlive.png",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    description: "Beauty Influencer - 930K followers",
    avatar: "/src/assets/logo-revlive.png",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    description: "Tech Reviewer - 670K followers",
    avatar: "/src/assets/logo-revlive.png",
  },
  {
    id: 6,
    name: "Đỗ Thị F",
    description: "Fashion Creator - 1.5M followers",
    avatar: "/src/assets/logo-revlive.png",
  },
];

export function TopCreatorsSection() {
  return (
    <section className="home-creators">
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
          {creators.map((creator) => (
            <div key={creator.id} className="home-creators__item">
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
              <p className="home-creators__description">{creator.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

