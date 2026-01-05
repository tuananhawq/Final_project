// src/pages/JobOffersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header";
import { EmployerSidebar } from "../components/EmployerSidebar";
import { Footer } from "../components/Footer";
import "../styles/job/job-offers.css";

export default function JobOffersPage() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/register");
        return;
      }

      const userRes = await axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userRes.data.user);

      const jobRes = await axios.get(`http://localhost:3000/api/jobs?page=${page}&limit=4`);
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

  if (loading) return <div className="loading">Đang tải...</div>;

  const isCreator = user?.roles?.includes("creator") || false;

  return (
    <div className="job-offers-page">
      <Header />

      <div className="job-layout">
        <EmployerSidebar user={user} isCreator={isCreator} />

        <main className="job-content">
          <h1 className="page-title">TUYỂN DỤNG NỔI BẬT NGÀY HÔM NAY</h1>

          <div className="jobs-list">
            {jobs.length === 0 ? (
              <p>Chưa có tin tuyển dụng nào</p>
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
                      XEM CHI TIẾT →
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
                ‹ Trước
              </button>

              <span>Trang {currentPage} / {pagination.totalPages}</span>

              <button
                onClick={() => fetchJobs(currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Sau ›
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}