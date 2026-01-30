import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import "../styles/reset-password.css";
import { useNotification } from "../context/NotificationContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { notifySuccess } = useNotification();

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  /* ================= VALIDATE ================= */
  const validate = () => {
    if (!otp || !password || !confirmPassword) {
      return t("resetPassword.passwordRequired");
    }

    if (password.length < 8) {
      return t("resetPassword.passwordRequired");
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return t("resetPassword.passwordRequired");
    }

    if (password !== confirmPassword) {
      return t("resetPassword.passwordMismatch");
    }

    return "";
  };

  /* ================= RESET ================= */
  const handleReset = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_URLS.AUTH}/reset-password`, {
        email,
        otp,
        newPassword: password,
      });

      notifySuccess(t("resetPassword.success"));
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || t("resetPassword.tokenInvalid"));
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendOTP = async () => {
    try {
      setError("");
      setCanResend(false);
      setCountdown(30);

      await axios.post(`${API_URLS.AUTH}/forgot-password`, {
        email,
      });
    } catch {
      setError(t("common.error"));
    }
  };

  if (!email) return <p>{t("resetPassword.tokenInvalid")}</p>;

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>{t("resetPassword.title")}</h2>
        <p>Email: <b>{email}</b></p>

        <div className="input-box">
          <FaKey />
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <div className="input-box">
          <FaLock />
          <input
            placeholder={t("resetPassword.newPassword")}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="input-box">
          <FaLock />
          <input
            placeholder={t("resetPassword.confirmPassword")}
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="reset-btn" onClick={handleReset} disabled={loading}>
          {loading ? t("common.processing") : t("resetPassword.submit")}
        </button>

        <div className="resend">
          {canResend ? (
            <span onClick={handleResendOTP}>{t("forgotPassword.submit")}</span>
          ) : (
            <span>{t("common.processing")} {countdown}s</span>
          )}
        </div>

        <div className="back-login" onClick={() => navigate("/login")}>
          ← {t("forgotPassword.backToLogin")}
        </div>
      </div>
    </div>
  );
}

