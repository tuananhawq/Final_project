import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import "../styles/reset-password.css";
import { useNotification } from "../context/NotificationContext.jsx";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

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
      return "Vui lòng nhập đầy đủ thông tin";
    }

    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return "Mật khẩu phải chứa ít nhất 1 chữ và 1 số";
    }

    if (password !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
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

      notifySuccess("Đổi mật khẩu thành công");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
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
      setError("Không thể gửi lại OTP");
    }
  };

  if (!email) return <p>Invalid reset flow</p>;

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Đặt lại mật khẩu</h2>
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
            placeholder="Mật khẩu mới"
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
            placeholder="Xác nhận mật khẩu"
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
          {loading ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
        </button>

        <div className="resend">
          {canResend ? (
            <span onClick={handleResendOTP}>Gửi lại mã OTP</span>
          ) : (
            <span>Gửi lại OTP sau {countdown}s</span>
          )}
        </div>

        <div className="back-login" onClick={() => navigate("/login")}>
          ← Quay lại đăng nhập
        </div>
      </div>
    </div>
  );
}
