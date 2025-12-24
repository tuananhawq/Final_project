import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";
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

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    /* ===== LOAD PROFILE ===== */
    useEffect(() => {
        axios.get("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const u = res.data.user;
            setProfile(u);
            setUsername(u.username || "");
            setBio(u.bio || "");
        });
    }, []);

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="profile-bg">
        <button
          className="profile-home-btn"
          onClick={() => navigate("/home")}
          title="Quay lại trang chủ"
        >
          <FaHome style={{fontSize: 22, marginRight: 8, verticalAlign: 'middle'}} />
          <span style={{verticalAlign: 'middle'}}>Trang chủ</span>
        </button>
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
                                "http://localhost:3000/api/upload/image",
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
                                "http://localhost:3000/api/auth/me",
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
                            "http://localhost:3000/api/auth/me",
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
                                        "http://localhost:3000/api/auth/change-password",
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
