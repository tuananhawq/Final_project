// src/pages/BrandPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/brand/brand-page.css"; // CSS riêng cho Brand

export default function BrandPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/register");
            return;
        }

        axios
            .get("http://localhost:3000/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                if (res.status === 200 && res.data.user) {
                    setUser(res.data.user);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch me error:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    const isBrand = user?.roles?.includes("brand") || false;

    return (
        <div className="brand-page">
            <Header />

            <div className="brand-layout">
                {/* ===== SIDEBAR ===== */}
                <aside className="brand-panel">
                    <div className="panel-header">
                        <div className="panel-avatar">
                            <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="30" r="20" fill="#000" />
                                <path d="M 25 60 Q 50 100 75 60 L 75 120 L 25 120 Z" fill="#000" />
                                <circle cx="50" cy="30" r="20" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
                                <path d="M 25 60 Q 50 85 75 60" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="panel-info">
                            <h3>{user?.username || user?.companyName || "Tên Brand Tạm"}</h3>
                            <p>{isBrand ? "Brand" : "User"}</p>
                            <span>Tài khoản cấp {user?.premiumStatus === "premium" ? "3/3" : "1/3"}</span>
                            {!isBrand && (
                                <button className="upgrade-btn" onClick={() => navigate("/upgrade-brand")}>
                                    Nâng cấp Brand
                                </button>
                            )}
                        </div>
                    </div>

                    <nav className="panel-menu">
                        {/* BẢNG TIN luôn hiện - mặc định active */}
                        <div className="menu-item active">
                            <span className="menu-icon">📰</span> BẢNG TIN
                        </div>

                        {/* Các menu chỉ hiện khi là Brand */}
                        {isBrand && (
                            <>
                                <div className="menu-item">
                                    <span className="menu-icon">📢</span> CV ĐỀ XUẤT
                                </div>
                                <div className="menu-item">
                                    <span className="menu-icon">📋</span> QUẢN LÝ CV
                                </div>
                                <div className="menu-item">
                                    <span className="menu-icon">🏠</span> TIN TUYỂN DỤNG CỦA TÔI
                                </div>
                            </>
                        )}
                    </nav>
                </aside>

                {/* ===== MAIN CONTENT ===== */}
                <main className="brand-content">
                    <div className="container">
                        {/* HERO SECTION */}
                        <section className="highlight-section">
                            <div className="highlight-image">
                                <img
                                    src="https://thumbs.dreamstime.com/b/close-up-woman-singing-microphone-under-vibrant-neon-lights-red-blue-hues-illuminate-her-lips-hair-captures-moment-390948431.jpg"
                                    alt="Highlight"
                                />
                            </div>

                            <div className="highlight-text">
                                <h1>THÔNG BÁO TUYỂN DỤNG NỔI BẬT HÔM NAY</h1>
                                <p>
                                    Hôm nay, nền tảng chính thức mở đợt tuyển chọn và đăng ký hợp tác
                                    với các Host tiềm năng cho chiến dịch truyền thông sắp tới.
                                </p>
                            </div>
                        </section>

                        {/* GRID CONTENT */}
                        <section className="grid-section">
                            <div className="grid-item">
                                <img src="https://www.shutterstock.com/image-photo/woman-content-creator-ring-light-260nw-2471690323.jpg" alt="Creator 1" />
                            </div>
                            <div className="grid-item">
                                <img src="https://thumbs.dreamstime.com/b/popular-blogger-using-laptop-microphone-neon-lit-office-podcast-online-content-creation-young-female-creator-works-412198553.jpg" alt="Creator 2" />
                            </div>
                            <div className="grid-item">
                                <img src="https://www.shutterstock.com/image-photo/home-influencer-girl-live-streaming-260nw-2489152357.jpg" alt="Creator 3" />
                            </div>
                            <div className="grid-item">
                                <img src="https://img.freepik.com/premium-photo/professional-ring-light-setup-vibrant-studio-night_187882-9141.jpg" alt="Creator 4" />
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}