import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCrown, FaShieldAlt, FaGem } from "react-icons/fa";
import { HiSparkles, HiLightningBolt, HiClock, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { Header } from "../components/Header";
import { checkPaymentStatus } from "../services/paymentService";
import { useNotification } from "../context/NotificationContext";
import { API_URLS } from "../config/api.js";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import "../styles/profile.css";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
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
    const { t } = useLanguage();

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
            } finally {
                setLoadingPaymentStatus(false);
            }
        };

        if (token) {
            fetchPaymentStatus();
        }
    }, [token]);

    /* ===== HANDLERS ===== */
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
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
            const userWithNoCache = {
                ...res.data.user,
                avatar: res.data.user.avatar ? res.data.user.avatar + "?t=" + Date.now() : ""
            };
            setProfile(userWithNoCache);
            localStorage.setItem("user", JSON.stringify(userWithNoCache));
            window.dispatchEvent(new Event("storage"));
        } catch (error) {
            console.error("Error uploading avatar:", error);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const res = await axios.put(
                `${API_URLS.AUTH}/me`,
                { name: username, bio },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfile(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordMsg("");
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordMsg(t("profile.fillAllFields"));
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMsg(t("profile.newPasswordMismatch"));
            return;
        }
        try {
            await axios.post(
                `${API_URLS.AUTH}/change-password`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPasswordMsg(t("profile.passwordChanged"));
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordMsg(t("profile.passwordChangeFailed"));
        }
    };

    const getRoleDisplay = () => {
        const roles = profile?.roles || [];
        if (roles.includes("admin")) return "Admin";
        if (roles.includes("staff")) return "Staff";
        if (roles.includes("creator")) return "Creator";
        if (roles.includes("brand")) return "Brand";
        return "User";
    };

    const getPackageDisplay = () => {
        if (!paymentStatus) return null;
        const memberType = paymentStatus.user.memberType;

        if (memberType === "free") return { name: t("profile.free"), icon: <HiSparkles /> };
        if (memberType === "creator") return { name: "Creator VIP", icon: <FaCrown /> };
        if (memberType === "brand") {
            const amount = paymentStatus.latestTransaction?.amount || 0;
            return amount >= 499000
                ? { name: "Brand Premium", icon: <FaGem /> }
                : { name: "Brand Basic", icon: <FaShieldAlt /> };
        }
        return { name: "N/A", icon: null };
    };

    /* ===== LOADING STATE ===== */
    if (!profile) {
        return (
            <div className="profile-bg">
                <Header />
                <div className="profile-loading">
                    <div className="profile-loading-spinner" />
                    <p className="profile-loading-text">{t("common.loading")}</p>
                </div>
            </div>
        );
    }

    const packageInfo = getPackageDisplay();

    return (
        <div className="profile-bg">
            <Header />

            <div className="profile-container modern-profile">
                <h2 className="profile-title">{t("profile.title")}</h2>

                <div className="profile-two-column">
                    {/* LEFT COLUMN - Profile Info & Edit */}
                    <div className="profile-left-column">
                        {/* Avatar & Basic Info Row */}
                        <div className="profile-avatar-info-row">
                            <div className="avatar-wrapper-small">
                                <label className="avatar-upload">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            className="profile-avatar-small"
                                            alt="Avatar"
                                        />
                                    ) : (
                                        <div className="profile-avatar-small profile-avatar-placeholder">
                                            {(profile.username || profile.email || "U")[0].toUpperCase()}
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        title={t("profile.changeAvatar")}
                                        onChange={handleAvatarUpload}
                                    />
                                </label>
                            </div>

                            <div className="profile-info-side">
                                {/* Premium Badge */}
                                {profile.premiumStatus !== "free" && (
                                    <div className="badges">
                                        <span className={`badge premium ${profile.premiumStatus}`}>
                                            <FaCrown style={{ marginRight: 4 }} />
                                            {profile.premiumStatus.toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                {/* Email & Role Info */}
                                <div className="profile-info-card">
                                    <div className="profile-info-item">
                                        <span className="profile-info-label">{t("profile.email")}</span>
                                        <span className="profile-info-value">{profile.email}</span>
                                    </div>
                                    <div className="profile-info-item">
                                        <span className="profile-info-label">{t("profile.role")}</span>
                                        <span className="profile-info-value">{getRoleDisplay()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="profile-form-group">
                            <label className="profile-label">{t("profile.displayName")}</label>
                            <input
                                className="profile-input"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder={t("profile.enterName")}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label className="profile-label">{t("profile.bio")}</label>
                            <textarea
                                className="profile-textarea"
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                rows={4}
                                placeholder={t("profile.enterBio")}
                            />
                        </div>

                        <button
                            className="profile-save-btn"
                            disabled={loading}
                            onClick={handleSaveProfile}
                        >
                            {loading ? t("profile.saving") : `💾 ${t("profile.saveChanges")}`}
                        </button>

                        <button
                            className="profile-save-btn profile-change-password-btn"
                            onClick={() => setShowChangePassword(!showChangePassword)}
                        >
                            🔐 {t("profile.changePassword")}
                        </button>
                    </div>

                    {/* RIGHT COLUMN - Package & Payment Status */}
                    <div className="profile-right-column">
                        {paymentStatus && (
                            <div className="payment-status-section">
                                <h3 className="payment-status-title">{t("profile.servicePackage")}</h3>

                                <div className="payment-status-grid">
                                    <div className="payment-status-card">
                                        <div className="payment-status-label">{t("profile.currentPlan")}</div>
                                        <div className="payment-status-value">
                                            {packageInfo?.icon && (
                                                <span style={{ marginRight: 6, verticalAlign: 'middle' }}>
                                                    {packageInfo.icon}
                                                </span>
                                            )}
                                            {packageInfo?.name}
                                        </div>
                                    </div>

                                    {paymentStatus.user.premiumExpiredAt && (
                                        <div className="payment-status-card">
                                            <div className="payment-status-label">{t("profile.duration")}</div>
                                            <div className={`payment-status-value ${paymentStatus.status.daysRemaining > 7 ? "success" :
                                                paymentStatus.status.daysRemaining > 0 ? "warning" : "danger"
                                                }`}>
                                                <HiClock style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                {paymentStatus.status.daysRemaining > 0
                                                    ? `${paymentStatus.status.daysRemaining} ${t("profile.daysRemaining")}`
                                                    : t("profile.expired")}
                                            </div>
                                        </div>
                                    )}

                                    <div className="payment-status-card">
                                        <div className="payment-status-label">{t("profile.status")}</div>
                                        <div className={`payment-status-value ${paymentStatus.status.isActive ? "active" : "inactive"
                                            }`}>
                                            {paymentStatus.status.isActive ? (
                                                <>
                                                    <HiCheckCircle style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                    {t("profile.active")}
                                                </>
                                            ) : (
                                                <>
                                                    <HiXCircle style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                    {t("profile.inactive")}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {!paymentStatus.status.isActive && (
                                    <div className="upgrade-prompt">
                                        <button
                                            className="upgrade-btn"
                                            onClick={() => navigate("/pricing")}
                                        >
                                            <HiLightningBolt style={{ marginRight: 6 }} />
                                            {t("profile.upgradeNow")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Show placeholder if no payment status */}
                        {!paymentStatus && !loadingPaymentStatus && (
                            <div className="payment-status-section">
                                <h3 className="payment-status-title">{t("profile.servicePackage")}</h3>
                                <div className="payment-status-card">
                                    <div className="payment-status-label">{t("profile.currentPlan")}</div>
                                    <div className="payment-status-value">
                                        <HiSparkles style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                        {t("profile.free")}
                                    </div>
                                </div>
                                <div className="upgrade-prompt" style={{ marginTop: 20 }}>
                                    <button
                                        className="upgrade-btn"
                                        onClick={() => navigate("/pricing")}
                                    >
                                        <HiLightningBolt style={{ marginRight: 6 }} />
                                        {t("profile.discoverPlans")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Change Password Modal */}
                {showChangePassword && (
                    <div className="change-password-modal-bg" onClick={() => setShowChangePassword(false)}>
                        <div className="change-password-modal" onClick={e => e.stopPropagation()}>
                            <h3 className="change-password-title">{t("profile.changePassword")}</h3>

                            <div className="profile-form-group">
                                <label className="profile-label">{t("profile.oldPassword")}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="profile-input"
                                        type={showOldPass ? "text" : "password"}
                                        value={oldPassword}
                                        onChange={e => setOldPassword(e.target.value)}
                                        placeholder={t("profile.enterOldPassword")}
                                    />
                                    <span
                                        onClick={() => setShowOldPass(v => !v)}
                                        className="profile-password-eye"
                                    >
                                        {showOldPass ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>

                            <div className="profile-form-group">
                                <label className="profile-label">{t("profile.newPassword")}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="profile-input"
                                        type={showNewPass ? "text" : "password"}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder={t("profile.enterNewPassword")}
                                    />
                                    <span
                                        onClick={() => setShowNewPass(v => !v)}
                                        className="profile-password-eye"
                                    >
                                        {showNewPass ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>

                            <div className="profile-form-group">
                                <label className="profile-label">{t("profile.confirmPassword")}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="profile-input"
                                        type={showConfirmPass ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder={t("profile.confirmNewPassword")}
                                    />
                                    <span
                                        onClick={() => setShowConfirmPass(v => !v)}
                                        className="profile-password-eye"
                                    >
                                        {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="profile-save-btn"
                                onClick={handleChangePassword}
                            >
                                ✓ {t("profile.confirmChangePassword")}
                            </button>

                            {passwordMsg && (
                                <div className="profile-password-msg">{passwordMsg}</div>
                            )}

                            <button
                                className="close-modal-btn"
                                onClick={() => setShowChangePassword(false)}
                            >
                                {t("profile.close")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

