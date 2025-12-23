import { useEffect, useState } from "react";
import { getTestimonials } from "../services/homeService.jsx";
import "../styles/home/home-testimonials.css";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="home-testimonials">Loading...</div>;
  }

  if (testimonials.length === 0) {
    return null;
  }

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
            <div key={testimonial._id} className="home-testimonials__card">
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

