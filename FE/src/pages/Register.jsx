import { useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleRegister = async () => {
        setError("");

        if (!form.name || !form.email || !form.password) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (!form.agree) {
            setError("Bạn cần đồng ý điều khoản & chính sách");
            return;
        }

        try {
            setLoading(true);
            await axios.post("http://localhost:3000/api/auth/register", {
                username: form.name,   // ✅ ĐÚNG SCHEMA
                email: form.email,
                password: form.password
            });


            alert("Đăng ký thành công!");
        } catch (err) {
            const code = err.response?.data?.error;

            if (code === "EMAIL_ALREADY_EXISTS") {
                setError("Email đã được đăng ký");
            } else if (code === "MISSING_FIELDS") {
                setError("Thiếu thông tin bắt buộc");
            } else {
                setError("Lỗi hệ thống");
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* LEFT */}
            <div className="register-left">
                <h1>CHÀO MỪNG BẠN ĐẾN VỚI REVLIVE</h1>
                <p>
                    Đăng ký ngay để được hợp tác cùng <br />
                    những đối tác uy tín tại REVLIVE
                </p>

                <label>Họ và tên / Tên doanh nghiệp</label>
                <div className="input-box">
                    <FaUser />
                    <input
                        name="name"
                        placeholder="Nguyễn Văn A / ABC Media"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <label>Email</label>
                <div className="input-box">
                    <FaEnvelope />
                    <input
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <label>Mật khẩu</label>
                <div className="input-box">
                    <FaLock />
                    <input
                        type={showPass ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <span onClick={() => setShowPass(!showPass)}>
                        {showPass ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <label>Xác nhận lại mật khẩu</label>
                <div className="input-box">
                    <FaLock />
                    <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                    <span onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <div className="checkbox">
                    <input
                        type="checkbox"
                        name="agree"
                        checked={form.agree}
                        onChange={handleChange}
                    />
                    <span>
                        Tôi đã xem và đồng ý với <b>Điều khoản dịch vụ</b> và{" "}
                        <b>Chính sách bảo mật</b> của REVLIVE
                    </span>
                </div>

                {error && <div className="error">{error}</div>}

                <button className="register-btn" onClick={handleRegister} disabled={loading}>
                    {loading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
                </button>

                <div className="divider">HOẶC</div>

                <div className="social">
                    <button className="google">GOOGLE</button>
                    <button className="facebook">FACEBOOK</button>
                   
                </div>

                <div className="footer">
                    Bạn đã có tài khoản?{" "}
                    <span onClick={() => navigate("/login")}>
                        Đăng nhập ngay
                    </span>
                </div>

            </div>

            {/* RIGHT */}
            <div className="register-right">
                <img
                    src="/src/assets/logo-revlive.png"
                    alt="Revlive"
                    className="register-logo"
                />
            </div>
        </div>
    );
}
