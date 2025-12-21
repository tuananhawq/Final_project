import "../styles/home/home-testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Minh Tuấn",
    role: "CEO - TechStart",
    content:
      "REVLIVE đã giúp chúng tôi kết nối với những creator tài năng nhất. Nền tảng rất dễ sử dụng và hiệu quả!",
    avatar: "/src/assets/logo-revlive.png",
  },
  {
    id: 2,
    name: "Lê Thu Hà",
    role: "Content Creator",
    content:
      "Tôi đã tìm được nhiều brand uy tín để hợp tác thông qua REVLIVE. Đây là nền tảng tuyệt vời cho các creator!",
    avatar: "/src/assets/logo-revlive.png",
  },
  {
    id: 3,
    name: "Trần Đức Anh",
    role: "Marketing Manager - Fashion Brand",
    content:
      "Chất lượng creator trên REVLIVE rất cao. Chúng tôi đã có nhiều chiến dịch thành công nhờ nền tảng này.",
    avatar: "/src/assets/logo-revlive.png",
  },
];

export function TestimonialsSection() {
  return (
    <section className="home-testimonials">
      <div className="home-testimonials__container">
        {/* Title with decorative line */}
        <div className="home-testimonials__title-wrapper">
          <div className="home-testimonials__decorative-line" />
          <h2 className="home-testimonials__title">
            Mọi người nói gì
            <br />
            về REVLIVE
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="home-testimonials__grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="home-testimonials__card">
              <div className="home-testimonials__card-header">
                <div className="home-testimonials__avatar-wrapper">
                  <div className="home-testimonials__avatar-border">
                    <div className="home-testimonials__avatar-inner">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="home-testimonials__avatar-image"
                      />
                    </div>
                  </div>
                </div>
                <div className="home-testimonials__user-info">
                  <h3 className="home-testimonials__user-name">{testimonial.name}</h3>
                  <p className="home-testimonials__user-role">{testimonial.role}</p>
                </div>
              </div>
              <p className="home-testimonials__content">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

