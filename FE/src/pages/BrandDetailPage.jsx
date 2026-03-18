import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { useLanguage } from "../context/LanguageContext";
import "../styles/brand/brand-page.css";

export default function BrandDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const { t } = useLanguage();

  const backPath = location.pathname.split("/").slice(0, -1).join("/");

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        // Fetch brand details
        const brandRes = await axios.get(`${API_URLS.BRANDS}/${id}`);
        setBrand(brandRes.data.brand);

        // Fetch related job posts from this brand
        try {
          const jobsRes = await axios.get(`${API_URLS.JOB_POST}/job-posts?brandId=${id}&limit=3`);
          setRelatedJobs(jobsRes.data.posts || []);
        } catch (jobError) {
          console.error("Fetch related jobs error:", jobError);
        }
      } catch (error) {
        console.error("Fetch brand detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBrandData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="brand-detail-page">
        <div className="brand-detail-skeleton">
          <div className="skeleton-back-btn"></div>
          <div className="skeleton-header">
            <div className="skeleton-logo"></div>
            <div className="skeleton-info">
              <div className="skeleton-name"></div>
              <div className="skeleton-industry"></div>
            </div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-section"></div>
            <div className="skeleton-section"></div>
            <div className="skeleton-section"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="brand-detail-page">
        <div className="brand-empty-state">
          <div className="empty-icon">🏢</div>
          <h2>{t("brandDetail.notFound")}</h2>
          <p>Không tìm thấy thông tin công ty này</p>
          <button
            className="primary-btn"
            onClick={() => navigate(backPath)}
          >
            {t("brandDetail.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-detail-page">
      <button
        className="back-btn"
        onClick={() => navigate(backPath)}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
        </svg>
        {t("brandDetail.back")}
      </button>

      <div className="brand-detail-container">
        {/* Brand Header */}
        <div className="brand-detail-header">
          <div className="brand-logo-section">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.companyName}
                className="brand-logo-large"
              />
            ) : (
              <div className="brand-logo-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H12V17H20V19M20,15H12V13H20V15M20,11H12V9H20V11Z"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="brand-info-section">
            <h1 className="brand-name-large">{brand.companyName}</h1>
            {brand.industry && (
              <div className="brand-industry">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                </svg>
                {brand.industry}
              </div>
            )}
            
            <div className="brand-stats">
              <div className="stat-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,4C16.88,4 17.67,4.5 18,5.26L19,7H20A2,2 0 0,1 22,9V16A2,2 0 0,1 20,18H19.82C19.4,19.15 18.28,20 17,20A3,3 0 0,1 14,17A3,3 0 0,1 17,14C18.28,14 19.4,14.85 19.82,16H20V9H19L18,10.74C17.67,11.5 16.88,12 16,12H8C7.12,12 6.33,11.5 6,10.74L5,9H4V16H4.18C4.6,14.85 5.72,14 7,14A3,3 0 0,1 10,17A3,3 0 0,1 7,20C5.72,20 4.6,19.15 4.18,18H4A2,2 0 0,1 2,16V9A2,2 0 0,1 4,7H5L6,5.26C6.33,4.5 7.12,4 8,4H16M16,6H8L7,7.5L8,9H16L17,7.5L16,6Z"/>
                </svg>
                <span>{brand.followers || "0"} followers</span>
              </div>
              
              {relatedJobs.length > 0 && (
                <div className="stat-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z"/>
                  </svg>
                  <span>{relatedJobs.length} vị trí đang tuyển</span>
                </div>
              )}
            </div>

            <div className="brand-actions">
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noreferrer"
                  className="action-btn primary"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                  </svg>
                  Truy cập website
                </a>
              )}
              
              <button
                className="action-btn secondary"
                onClick={() => setShowContact(!showContact)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.21,2 16.21,2.81 17.78,4.39C19.36,5.96 20.17,7.96 20.17,10.17C20.17,12.54 19.5,14.69 18.16,16.62C16.82,18.55 15.33,20.06 13.69,21.16C13.41,21.34 13.07,21.43 12.67,21.43C12.27,21.43 11.93,21.34 11.65,21.16C10,20.06 8.5,18.55 7.16,16.62C5.82,14.69 5.15,12.54 5.15,10.17C5.15,7.96 5.96,5.96 7.54,4.39C9.12,2.81 11.12,2 12,2Z"/>
                </svg>
                Thông tin liên hệ
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Expandable */}
        {showContact && (
          <div className="contact-section">
            <h3>Thông tin liên hệ</h3>
            <div className="contact-info">
              {brand.website && (
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                  </svg>
                  <a href={brand.website} target="_blank" rel="noreferrer">
                    {brand.website}
                  </a>
                </div>
              )}
              <div className="contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,4C16.88,4 17.67,4.5 18,5.26L19,7H20A2,2 0 0,1 22,9V16A2,2 0 0,1 20,18H19.82C19.4,19.15 18.28,20 17,20A3,3 0 0,1 14,17A3,3 0 0,1 17,14C18.28,14 19.4,14.85 19.82,16H20V9H19L18,10.74C17.67,11.5 16.88,12 16,12H8C7.12,12 6.33,11.5 6,10.74L5,9H4V16H4.18C4.6,14.85 5.72,14 7,14A3,3 0 0,1 10,17A3,3 0 0,1 7,20C5.72,20 4.6,19.15 4.18,18H4A2,2 0 0,1 2,16V9A2,2 0 0,1 4,7H5L6,5.26C6.33,4.5 7.12,4 8,4H16M16,6H8L7,7.5L8,9H16L17,7.5L16,6Z"/>
                </svg>
                <span>{brand.followers || "0"} người theo dõi</span>
              </div>
            </div>
          </div>
        )}

        {/* Brand Description */}
        <div className="brand-section">
          <h3 className="section-title">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            {t("brandDetail.description")}
          </h3>
          <div className="section-content">
            <p>{brand.description || t("brandDetail.noDescription")}</p>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <div className="brand-section">
            <h3 className="section-title">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z"/>
              </svg>
              Vị trí đang tuyển dụng
            </h3>
            <div className="related-jobs">
              {relatedJobs.map((job) => (
                <div key={job._id} className="related-job-item">
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <div className="job-meta">
                      <span className="job-type">{job.jobType}</span>
                      <span className="job-budget">{job.budget}</span>
                      <span className="job-time">{job.workTime}</span>
                    </div>
                  </div>
                  <a
                    href={`/creator/news/${job._id}`}
                    className="view-job-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Xem chi tiết
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

