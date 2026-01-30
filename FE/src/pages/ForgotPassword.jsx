import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import "../styles/forgot-password.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useLanguage();

  /* ================= VALIDATE ================= */
  const validateEmail = () => {
    if (!email) {
      return t("forgotPassword.emailRequired");
    }

    // regex email cơ bản (đủ cho đồ án)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t("forgotPassword.emailInvalid");
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
        `${API_URLS.AUTH}/forgot-password`,
        { email }
      );

      setMsg(res.data.message);

      // 🔥 gửi xong OTP → sang reset password
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>{t("forgotPassword.title")}</h2>
        <p>{t("forgotPassword.subtitle")}</p>

        <div className="input-box">
          <FaEnvelope />
          <input
            type="email"
            placeholder={t("forgotPassword.emailPlaceholder")}
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
          {loading ? t("common.processing") : t("forgotPassword.submit")}
        </button>

        <div className="back-login" onClick={() => navigate("/login")}>
          ← {t("forgotPassword.backToLogin")}
        </div>
      </div>
    </div>
  );
}

