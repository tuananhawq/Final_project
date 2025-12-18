import { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  /**
   * ✅ Nếu đã có token → không cho vào trang login nữa
   */
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/home");
  //   }
  // }, [navigate]);

  /**
   * ✅ Nhận token khi Google redirect về
   * /login?token=xxxxx
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home");
    }
  }, [location, navigate]);

  /**
   * Login thường (email + password)
   */
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Email hoặc mật khẩu không đúng"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google Login
   */
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="login-container">
      {/* LEFT */}
      <div className="login-left">
        <h1>Chào mừng bạn quay trở lại</h1>
        <p>
          Cùng xây dựng một hồ sơ nổi bật <br />
          và nhận được cơ hội phù hợp
        </p>

        <label>Email / Doanh nghiệp</label>
        <div className="input-box">
          <FaEnvelope />
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>Mật khẩu</label>
        <div className="input-box">
          <FaLock />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="forgot">Quên mật khẩu?</div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
        </button>

        <div className="divider">HOẶC</div>

        <div className="social">
          <button className="google" onClick={handleGoogleLogin}>
            GOOGLE
          </button>
          <button className="facebook">FACEBOOK</button>
        </div>

        <div className="footer">
          Chưa có tài khoản?{" "}
          <span onClick={() => navigate("/register")}>
            Đăng ký ngay
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <img
          src="/src/assets/logo-revlive.png"
          alt="Revlive Logo"
          className="login-logo"
        />
      </div>
    </div>
  );
}
