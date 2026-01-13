// src/pages/CreatorPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { EmployerSidebar } from "../components/EmployerSidebar";
import "../styles/creator/creator-page.css";

export default function CreatorPage() {
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
            .get(`${API_URLS.AUTH}/me`, {
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

    const isCreator = user?.roles?.includes("creator") || false;

    return (
        <div className="creator-page">
            <Header />

            <div className="creator-layout">
                {/* ===== SIDEBAR ===== */}
                <EmployerSidebar user={user} isCreator={isCreator} />

                {/* ===== MAIN CONTENT ===== */}
                <main className="creator-content">

                    {/* ===== HERO SECTION ===== */}
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

                    {/* ===== GRID CONTENT ===== */}
                    <section className="grid-section">
                        <div className="grid-item">
                            <img src="https://www.shutterstock.com/image-photo/woman-content-creator-ring-light-260nw-2471690323.jpg" />
                        </div>

                        <div className="grid-item">
                            <img src="https://thumbs.dreamstime.com/b/popular-blogger-using-laptop-microphone-neon-lit-office-podcast-online-content-creation-young-female-creator-works-412198553.jpg" />
                        </div>

                        <div className="grid-item">
                            <img src="https://www.shutterstock.com/image-photo/home-influencer-girl-live-streaming-260nw-2489152357.jpg" />
                        </div>

                        <div className="grid-item">
                            <img src="https://img.freepik.com/premium-photo/professional-ring-light-setup-vibrant-studio-night_187882-9141.jpg" />
                        </div>
                    </section>

                </main>
            </div>

            <Footer />
        </div>
    );
}
