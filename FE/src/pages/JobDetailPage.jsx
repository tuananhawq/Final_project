// src/pages/JobDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { EmployerSidebar } from "../components/EmployerSidebar";
import "../styles/job/job-detail.css";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/register");
      return;
    }

    axios.get(`${API_URLS.AUTH}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data.user));

    axios.get(`${API_URLS.JOB}/${id}`)
      .then(res => {
        setJob(res.data.job);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loading">Đang tải chi tiết...</div>;
  if (!job) return <div className="notfound">Không tìm thấy tin tuyển dụng</div>;

  const isCreator = user?.roles?.includes("creator") || false;

  return (
    <div className="job-detail-cv-page">
      <Header />

      <div className="job-layout">
        <EmployerSidebar user={user} isCreator={isCreator} />

        <main className="job-cv-content">
          <div className="cv-container">
            {/* Header */}
            <div className="cv-header">
              <img src={job.logo} alt={job.companyName} className="cv-logo" />
              <div className="cv-company-info">
                <h1 className="cv-company-name">{job.companyName}</h1>
                <p className="cv-website">{job.website || "www.revive.vn"}</p>
              </div>
            </div>

            <h2 className="cv-job-title">{job.title || "TUYỂN CREATOR / KOL"}</h2>

            {/* MÔ TẢ CÔNG VIỆC */}
            <section className="cv-section">
              <h3 className="section-title">MÔ TẢ CÔNG VIỆC</h3>
              <p className="section-content">{job.description}</p>
            </section>

            {/* YÊU CẦU ỨNG VIÊN */}
            <section className="cv-section">
              <h3 className="section-title">YÊU CẦU ỨNG VIÊN</h3>
              <ul className="cv-list">
                {job.requirements.length > 0 ? (
                  job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))
                ) : (
                  <li>Chưa có yêu cầu cụ thể</li>
                )}
              </ul>
            </section>

            {/* QUYỀN LỢI */}
            <section className="cv-section">
              <h3 className="section-title">QUYỀN LỢI</h3>
              <ul className="cv-list">
                {job.benefits.length > 0 ? (
                  job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))
                ) : (
                  <li>Thu nhập cạnh tranh, môi trường chuyên nghiệp</li>
                )}
              </ul>
            </section>

            {/* ĐỊA ĐIỂM LÀM VIỆC */}
            <section className="cv-section">
              <h3 className="section-title">ĐỊA ĐIỂM LÀM VIỆC</h3>
              <p className="section-content">{job.location}</p>
            </section>

            {/* LƯƠNG (nếu có) */}
            {job.salary && (
              <section className="cv-section">
                <h3 className="section-title">MỨC LƯƠNG</h3>
                <p className="section-content salary-highlight">{job.salary}</p>
              </section>
            )}

            {/* NÚT ỨNG TUYỂN */}
            <div className="cv-apply-section">
              <button className="cv-apply-btn">
                ỨNG TUYỂN NGAY
              </button>
              <p className="apply-note">Chúng tôi sẽ phản hồi trong vòng 24-48 giờ</p>
            </div>

            <button className="cv-back-btn" onClick={() => navigate(-1)}>
              ← Quay lại danh sách
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}