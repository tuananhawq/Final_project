import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";
import { Header } from "../components/Header";
import { checkPaymentStatus } from "../services/paymentService";
import { useNotification } from "../context/NotificationContext";
import { API_URLS } from "../config/api.js";
import axios from "axios";
import "../styles/profile.css";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMsg, setPasswordMsg] = useState("");
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(false);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { notifyError } = useNotification();

    /* ===== LOAD PROFILE ===== */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URLS.AUTH}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const u = res.data.user;
                setProfile(u);
                setUsername(u.username || "");
                setBio(u.bio || "");
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    /* ===== LOAD PAYMENT STATUS ===== */
    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                setLoadingPaymentStatus(true);
                const data = await checkPaymentStatus();
                setPaymentStatus(data);
            } catch (error) {
                console.error("Error fetching payment status:", error);
                // Không hiển thị error nếu user chưa có transaction
            } finally {
                setLoadingPaymentStatus(false);
            }
        };

        if (token) {
            fetchPaymentStatus();
        }
    }, [token]);

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="profile-bg">
            <Header />
        
        <div className="profile-container modern-profile">
            <h2 className="profile-title">Thông tin cá nhân</h2>

            {/* AVATAR */}
            <div className="avatar-wrapper modern-avatar-wrapper">
                <label className="avatar-upload modern-avatar-upload">
                    <img
                        src={profile.avatar || "https://via.placeholder.com/200"}
                        className="profile-avatar modern-profile-avatar"
                        alt="Avatar"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        title="Đổi ảnh đại diện"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("image", file);
                            const uploadRes = await axios.post(
                                `${API_URLS.UPLOAD}/image`,
                                formData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "multipart/form-data"
                                    }
                                }
                            );
                            const { url, publicId } = uploadRes.data;
                            const res = await axios.put(
                                `${API_URLS.AUTH}/me`,
                                { avatar: url, avatarPublicId: publicId },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            // Đảm bảo avatar có query string để tránh cache
                            const userWithNoCache = {
                                ...res.data.user,
                                avatar: res.data.user.avatar ? res.data.user.avatar + "?t=" + Date.now() : ""
                            };
                            setProfile(userWithNoCache);
                            localStorage.setItem("user", JSON.stringify(userWithNoCache));
                            window.dispatchEvent(new Event("storage")); // Thông báo cho Header cập nhật avatar
                        }}
                    />
                </label>
            </div>

            {/* BADGE */}
            <div className="badges modern-badges">
                {/* Chỉ hiện badge premium nếu không phải free */}
                {profile.premiumStatus !== "free" && (
                  <span className={`badge premium modern-badge-premium ${profile.premiumStatus}`}>
                    {profile.premiumStatus.toUpperCase()}
                  </span>
                )}
            </div>

            {/* EMAIL + ROLE + PREMIUM STATUS */}
            <p className="profile-email"><b>Email:</b> {profile.email}</p>
            <div className="profile-role-status">
                <span className="profile-role"><b>Role:</b> {profile.roles.join(", ")}</span>
                <span className={`profile-premium-status ${profile.premiumStatus}`}><b>Trạng thái:</b> {profile.premiumStatus.toUpperCase()}</span>
            </div>

            {/* PAYMENT STATUS SECTION */}
            {paymentStatus && (
                <div className="payment-status-section">
                    <h3 className="payment-status-title">💳 Thông tin Gói Dịch vụ</h3>
                    <div className="payment-status-grid">
                        <div className="payment-status-card">
                            <div className="payment-status-label">Loại gói</div>
                            <div className="payment-status-value">
                                {paymentStatus.user.memberType === "free" 
                                    ? "Miễn phí" 
                                    : paymentStatus.user.memberType === "creator" 
                                        ? "Creator VIP 1" 
                                        : "Brand VIP 2"}
                            </div>
                        </div>
                        <div className="payment-status-card">
                            <div className="payment-status-label">Trạng thái</div>
                            <div className={`payment-status-value ${paymentStatus.status.isActive ? "active" : "inactive"}`}>
                                {paymentStatus.status.isActive ? "✓ Đang hoạt động" : "✗ Chưa kích hoạt"}
                            </div>
                        </div>
                        {paymentStatus.user.premiumExpiredAt && (
                            <>
                                <div className="payment-status-card">
                                    <div className="payment-status-label">Ngày hết hạn</div>
                                    <div className="payment-status-value">
                                        {new Date(paymentStatus.user.premiumExpiredAt).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </div>
                                </div>
                                <div className="payment-status-card">
                                    <div className="payment-status-label">Còn lại</div>
                                    <div className={`payment-status-value ${paymentStatus.status.daysRemaining > 7 ? "success" : paymentStatus.status.daysRemaining > 0 ? "warning" : "danger"}`}>
                                        {paymentStatus.status.daysRemaining > 0 
                                            ? `${paymentStatus.status.daysRemaining} ngày` 
                                            : "Đã hết hạn"}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {paymentStatus.latestTransaction && (
                        <div className="latest-transaction-info">
                            <h4>Giao dịch gần nhất</h4>
                            <div className="transaction-details">
                                <p><strong>Gói:</strong> {paymentStatus.latestTransaction.plan === "creator" ? "Creator VIP 1" : "Brand VIP 2"}</p>
                                <p><strong>Số tiền:</strong> {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(paymentStatus.latestTransaction.amount)}</p>
                                <p><strong>Trạng thái:</strong> 
                                    <span className={`transaction-status ${paymentStatus.latestTransaction.status}`}>
                                        {paymentStatus.latestTransaction.status === "pending" ? "Chờ duyệt" : 
                                         paymentStatus.latestTransaction.status === "completed" ? "Đã duyệt" : "Đã hủy"}
                                    </span>
                                </p>
                                <p><strong>Ngày:</strong> {new Date(paymentStatus.latestTransaction.createdAt).toLocaleDateString("vi-VN")}</p>
                            </div>
                        </div>
                    )}
                    {!paymentStatus.status.isActive && (
                        <div className="upgrade-prompt">
                            <p>Bạn chưa có gói dịch vụ hoặc gói đã hết hạn.</p>
                            <button 
                                className="upgrade-btn"
                                onClick={() => navigate("/services")}
                            >
                                Nâng cấp ngay →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* EDIT FORM */}
            <div className="profile-form-group">
                <label className="profile-label">Username</label>
                <input
                    className="profile-input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={!editMode}
                />
            </div>
            <div className="profile-form-group">
                <label className="profile-label">Bio</label>
                <textarea
                    className="profile-textarea"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    disabled={!editMode}
                />
            </div>
            {!editMode ? (
                <button className="profile-save-btn" onClick={() => setEditMode(true)}>
                    Chỉnh sửa thông tin cá nhân
                </button>
            ) : (
                <button
                    className="profile-save-btn"
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        const res = await axios.put(
                            `${API_URLS.AUTH}/me`,
                            { name: username, bio },
                            {
                                headers: { Authorization: `Bearer ${token}` }
                            }
                        );
                        setProfile(res.data.user);
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        setEditMode(false);
                        setLoading(false);
                    }}
                >
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            )}
            <button
                className="profile-save-btn profile-change-password-btn"
                style={{marginTop: 12, background: 'linear-gradient(90deg,#6366f1,#d946ef)'}}
                onClick={() => setShowChangePassword(!showChangePassword)}
            >
                Đổi mật khẩu
            </button>
            {showChangePassword && (
                <div className="change-password-modal-bg" onClick={() => setShowChangePassword(false)}>
                  <div className="change-password-modal" onClick={e => e.stopPropagation()}>
                    <h3 className="change-password-title">Đổi mật khẩu</h3>
                    <div className="profile-form-group" style={{marginTop: 10}}>
                        <label className="profile-label">Mật khẩu cũ</label>
                        <div style={{position:'relative'}}>
                        <input
                            className="profile-input"
                            type={showOldPass ? "text" : "password"}
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                        />
                        <span onClick={()=>setShowOldPass(v=>!v)} className="profile-password-eye">
                          {showOldPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        </div>
                        <label className="profile-label">Mật khẩu mới</label>
                        <div style={{position:'relative'}}>
                        <input
                            className="profile-input"
                            type={showNewPass ? "text" : "password"}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <span onClick={()=>setShowNewPass(v=>!v)} className="profile-password-eye">
                          {showNewPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        </div>
                        <label className="profile-label">Nhập lại mật khẩu mới</label>
                        <div style={{position:'relative'}}>
                        <input
                            className="profile-input"
                            type={showConfirmPass ? "text" : "password"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <span onClick={()=>setShowConfirmPass(v=>!v)} className="profile-password-eye">
                          {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        </div>
                        <button
                            className="profile-save-btn"
                            style={{marginTop: 10, background: 'linear-gradient(90deg,#d946ef,#6366f1)'}}
                            onClick={async () => {
                                setPasswordMsg("");
                                if (!oldPassword || !newPassword || !confirmPassword) {
                                    setPasswordMsg("Vui lòng nhập đầy đủ thông tin!");
                                    return;
                                }
                                if (newPassword !== confirmPassword) {
                                    setPasswordMsg("Mật khẩu mới không khớp!");
                                    return;
                                }
                                try {
                                    await axios.post(
                                        `${API_URLS.AUTH}/change-password`,
                                        { oldPassword, newPassword },
                                        { headers: { Authorization: `Bearer ${token}` } }
                                    );
                                    setPasswordMsg("Đổi mật khẩu thành công!");
                                    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
                                } catch (err) {
                                    setPasswordMsg("Đổi mật khẩu thất bại!");
                                }
                            }}
                        >
                            Xác nhận đổi mật khẩu
                        </button>
                        {passwordMsg && <div className="profile-password-msg">{passwordMsg}</div>}
                    </div>
                    <button className="close-modal-btn" onClick={() => setShowChangePassword(false)}>Đóng</button>
                  </div>
                </div>
            )}
        </div>
        </div>
    );
}
