import { useEffect, useState } from "react";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { getLegalPublic } from "../services/legalService.jsx";
import "../styles/legal.css";

export default function Legal() {
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await getLegalPublic();
      setTermsContent(data.termsContent || "");
      setPrivacyContent(data.privacyContent || "");
      setUpdatedAt(data.updatedAt || "");
      setError("");
    } catch (err) {
      console.error("Không thể tải Điều khoản & Chính sách:", err);
      setError("Không thể tải nội dung. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="legal-page">
        <section className="legal-hero">
          <div className="legal-hero__container">
            <h1 className="legal-hero__title">Điều khoản & Chính sách</h1>
            <p className="legal-hero__subtitle">
              Cập nhật mới nhất về Điều khoản dịch vụ và Chính sách bảo mật của
              REVLIVE.
            </p>
            {updatedAt && (
              <p className="legal-hero__meta">
                Cập nhật: {new Date(updatedAt).toLocaleString("vi-VN")}
              </p>
            )}
          </div>
        </section>

        <section className="legal-content">
          {loading ? (
            <div className="legal-loading">Đang tải nội dung...</div>
          ) : error ? (
            <div className="legal-error">
              <p>{error}</p>
              <button className="legal-retry" onClick={fetchContent}>
                Thử lại
              </button>
            </div>
          ) : (
            <div className="legal-text-wrapper">
              <div className="legal-section">
                <h2 className="legal-section__title">Điều khoản dịch vụ</h2>
                <div
                  className="legal-body"
                  dangerouslySetInnerHTML={{
                    __html: termsContent || "<p>Chưa có nội dung.</p>",
                  }}
                />
              </div>

              <div className="legal-divider-line" />

              <div className="legal-section">
                <h2 className="legal-section__title">Chính sách bảo mật</h2>
                <div
                  className="legal-body"
                  dangerouslySetInnerHTML={{
                    __html: privacyContent || "<p>Chưa có nội dung.</p>",
                  }}
                />
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

