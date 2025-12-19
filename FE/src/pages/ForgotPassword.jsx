import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import "../styles/forgot-password.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= VALIDATE ================= */
  const validateEmail = () => {
    if (!email) {
      return "Vui lòng nhập email";
    }

    // regex email cơ bản (đủ cho đồ án)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email không đúng định dạng";
    }

    return "";
  };

  /* ================= SEND OTP ================= */
  const handleSendOTP = async () => {
    const validationError = validateEmail();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMsg("");

      const res = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email }
      );

      setMsg(res.data.message);

      // 🔥 gửi xong OTP → sang reset password
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi gửi OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Quên mật khẩu</h2>
        <p>Nhập email để nhận mã OTP đặt lại mật khẩu</p>

        <div className="input-box">
          <FaEnvelope />
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // clear lỗi khi user gõ lại
            }}
          />
        </div>

        {error && <div className="error">{error}</div>}
        {msg && <div className="message">{msg}</div>}

        <button
          className="forgot-btn"
          onClick={handleSendOTP}
          disabled={loading}
        >
          {loading ? "ĐANG GỬI..." : "Gửi mã OTP"}
        </button>

        <div className="back-login" onClick={() => navigate("/login")}>
          ← Quay lại đăng nhập
        </div>
      </div>
    </div>
  );
}
