// src/pages/CreatorPage.jsx
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/creator/creator-page.css";

export default function CreatorPage() {
    return (
        <div className="creator-page">
            <Header />

            {/* ===== MAIN LAYOUT ===== */}
            <div className="creator-layout">

                {/* ===== SIDEBAR ===== */}
                <aside className="employer-panel">
                    <div className="panel-header">
                        <div className="panel-avatar"></div>
                        <div className="panel-info">
                            <h3>MD MEDIA</h3>
                            <p>Employer</p>
                            <span>Tài khoản cấp 1/3</span>
                        </div>
                    </div>

                    <nav className="panel-menu">
                        <div className="menu-item">📰 BẢNG TIN</div>
                        <div className="menu-item">📢 TUYỂN DỤNG ĐỀ XUẤT</div>
                        <div className="menu-item">📋 QUẢN LÝ CV</div>
                        <div className="menu-item">🏠 TIN TUYỂN DỤNG CỦA TÔI</div>
                    </nav>
                </aside>

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
