import { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_URLS } from "../config/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import "../styles/login.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();

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
      setError(t("login.emailRequired") + " & " + t("login.passwordRequired"));
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
        err.response?.data?.error || t("login.invalidCredentials")
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
        <h1>{t("login.title")}</h1>
        <p>
          {language === "vi" ? "Cùng xây dựng một hồ sơ nổi bật và nhận được cơ hội phù hợp" : "Build an outstanding profile and get the right opportunities"}
        </p>

        <label>{t("login.email")}</label>
        <div className="input-box">
          <FaEnvelope />
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>{t("login.password")}</label>
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
          {t("login.forgotPassword")}
        </div>


        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? t("common.processing") : t("login.loginButton")}
        </button>

        <div className="divider">{language === "vi" ? "HOẶC" : "OR"}</div>

        <div className="social">
          <button className="google" onClick={handleGoogleLogin}>
            {t("login.loginWithGoogle")}
          </button>


        </div>

        <div className="footer">
          {t("login.noAccount")}{" "}
          <span onClick={() => navigate("/register")}>
            {t("login.signUp")}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <Link to="/" style={{ display: "block", cursor: "pointer" }}>
        <img
          src="/logo-revlive.png"
          alt="Revlive Logo"
          className="login-logo"
            style={{ cursor: "pointer" }}
        />
        </Link>
      </div>
    </div>
  );
}
