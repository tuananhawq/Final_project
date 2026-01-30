import { useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URLS } from "../config/api.js";
import "../styles/register.css";
import { useNotification } from "../context/NotificationContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

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
    const { notifySuccess } = useNotification();
    const { t } = useLanguage();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
        setError(""); // 🔥 clear lỗi khi nhập lại
    };


    // thêm helper validate ở trên component
    const validateRegister = (form) => {
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            return t("register.usernameRequired");
        }

        if (form.name.trim().length < 3) {
            return t("register.nameMin");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            return t("register.emailInvalid");
        }

        if (form.password.length < 8) {
            return t("register.passwordMin");
        }

        if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
            return t("register.passwordRequirements");
        }

        if (form.password !== form.confirmPassword) {
            return t("register.passwordMismatch");
        }

        if (!form.agree) {
            return t("register.agreeRequired");
        }

        return "";
    };

    const handleRegister = async () => {
        setError("");

        const validationError = validateRegister(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            await axios.post(`${API_URLS.AUTH}/register`, {
                username: form.name,   // ✅ đúng schema
                email: form.email,
                password: form.password
            });

            notifySuccess(t("register.registerSuccess"));
            navigate("/login");
        } catch (err) {
            const code = err.response?.data?.error;

            if (code === "EMAIL_ALREADY_EXISTS") {
                setError(t("register.emailExists"));
            } else if (code === "MISSING_FIELDS") {
                setError(t("register.missingFields"));
            } else {
                setError(t("register.systemError"));
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="register-container">
            {/* LEFT */}
            <div className="register-left">
                <h1>{t("register.welcome")}</h1>
                <p>{t("register.welcomeDesc")}</p>

                <label>{t("register.fullName")}</label>
                <div className="input-box">
                    <FaUser />
                    <input
                        name="name"
                        placeholder={t("register.namePlaceholder")}
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <label>{t("register.email")}</label>
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

                <label>{t("register.password")}</label>
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

                <label>{t("register.confirmPassword")}</label>
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
                        {t("register.agreeTerms")}{" "}
                        <a href="/legal" target="_blank" rel="noopener noreferrer">
                            <b>{t("register.termsAndPolicy")}</b>
                        </a>{" "}
                        {t("register.ofRevlive")}
                    </span>
                </div>

                {error && <div className="error">{error}</div>}

                <button className="register-btn" onClick={handleRegister} disabled={loading}>
                    {loading ? t("register.registering") : t("register.registerButton")}
                </button>

                <div className="divider">{t("register.or")}</div>

                <div className="social">
                    <button className="google">GOOGLE</button>

                </div>

                <div className="footer">
                    {t("register.haveAccount")}{" "}
                    <span onClick={() => navigate("/login")}>
                        {t("register.signIn")}
                    </span>
                </div>

            </div>

            {/* RIGHT */}
            <div className="register-right">
                <Link to="/" style={{ display: "block", cursor: "pointer" }}>
                <img
                    src="/logo-revlive.png"
                    alt="Revlive"
                    className="register-logo"
                        style={{ cursor: "pointer" }}
                />
                </Link>
            </div>
        </div>
    );
}

