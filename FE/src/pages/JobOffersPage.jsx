// src/pages/JobOffersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { Header } from "../components/Header";
import { EmployerSidebar } from "../components/EmployerSidebar";
import { Footer } from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import "../styles/job/job-offers.css";

export default function JobOffersPage() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/register");
        return;
      }

      const userRes = await axios.get(`${API_URLS.AUTH}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userRes.data.user);

      const jobRes = await axios.get(`${API_URLS.JOB}?page=${page}&limit=4`);
      setJobs(jobRes.data.jobs || []);
      setPagination(jobRes.data.pagination || {});
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [navigate]);

  if (loading) return <div className="loading">{t("jobOffers.loading")}</div>;

  const isCreator = user?.roles?.includes("creator") || false;

  return (
    <div className="job-offers-page">
      <Header />

      <div className="job-layout">
        <EmployerSidebar user={user} isCreator={isCreator} />

        <main className="job-content">
          <h1 className="page-title">{t("jobOffers.title")}</h1>

          <div className="jobs-list">
            {jobs.length === 0 ? (
              <p>{t("jobOffers.empty")}</p>
            ) : (
              jobs.map(job => (
                <div key={job._id} className="job-card">
                  <img src={job.logo} alt={job.companyName} className="job-logo" />
                  <div className="job-info">
                    <h3>{job.companyName}</h3>
                    <p className="job-desc-truncated">
                      {job.description.slice(0, 50) + (job.description.length > 150 ? "..." : "")}
                    </p>
                    <button
                      className="view-detail-btn"
                      onClick={() => navigate(`/job/${job._id}`)}
                    >
                      {t("jobOffers.viewDetail")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Phân trang */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => fetchJobs(currentPage - 1)}
                disabled={!pagination.hasPrev}
              >
                ‹ {t("jobPosts.prev")}
              </button>

              <span>{t("jobPosts.page")} {currentPage} / {pagination.totalPages}</span>

              <button
                onClick={() => fetchJobs(currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                {t("jobPosts.next")} ›
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}