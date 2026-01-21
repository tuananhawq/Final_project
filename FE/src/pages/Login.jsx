import { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_URLS } from "../config/api.js";
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
    const token = new URLSearchParams(location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const roles = decoded.roles || [];

      if (roles.includes("admin")) navigate("/admin");
      else if (roles.includes("staff")) navigate("/dashboard");
      else navigate("/home");
    }
  }, []);


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
        `${API_URLS.AUTH}/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // 🔥 BẮT BUỘC

      // Decode token để kiểm tra role và redirect đúng trang
      const decoded = jwtDecode(res.data.token);
      const roles = decoded.roles || [];

      if (roles.includes("admin")) {
        navigate("/admin");
      } else if (roles.includes("staff")) {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
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
    window.location.href = `${API_URLS.AUTH}/google`;
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

        <div
          className="forgot"
          onClick={() => navigate("/forgot-password")}
          style={{ cursor: "pointer" }}
        >
          Quên mật khẩu?
        </div>


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
          src="/logo-revlive.png"
          alt="Revlive Logo"
          className="login-logo"
        />
      </div>
    </div>
  );
}
