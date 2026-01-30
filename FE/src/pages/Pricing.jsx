import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getPricing, checkoutCreator, checkoutBrand } from "../services/paymentService";
import { useNotification } from "../context/NotificationContext";
import { useLanguage } from "../context/LanguageContext.jsx";
import "../styles/pricing.css";

export default function Pricing() {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { notifyError, notifyInfo } = useNotification();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await getPricing();
        setPricing(data.pricing);
      } catch (error) {
        console.error("Error fetching pricing:", error);
        notifyError(t("pricing.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [notifyError]);

  const formatVnd = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const handleBuyNow = async (plan, planLevel) => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      notifyInfo(t("pricing.loginRequired"));
      navigate("/login");
      return;
    }

    if (processing) {
      return; // Tránh click nhiều lần
    }

    setProcessing(true);

    try {
      // Gọi API checkout để tạo PayOS payment link
      let result;
      if (plan === "creator") {
        result = await checkoutCreator();
      } else if (plan === "brand") {
        result = await checkoutBrand(planLevel || "basic");
      } else {
        throw new Error(t("pricing.invalidPlan"));
      }

      // Redirect đến PayOS checkout page
      if (result.paymentLink) {
        window.location.href = result.paymentLink;
      } else {
        throw new Error(t("pricing.paymentLinkError"));
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      setProcessing(false);
      if (error.response?.status === 401) {
        notifyError(t("pricing.sessionExpired"));
        navigate("/login");
      } else {
        notifyError(
          error.response?.data?.message || t("pricing.paymentError")
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="pricing-page">
        <Header />
        <div className="pricing-loading">
          <p>{t("pricing.loading")}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="pricing-page">
        <Header />
        <div className="pricing-error">
          <p>{t("pricing.error")}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pricing-page">
      <Header />
      <div className="pricing-container">
        {/* Hero Section */}
        <div className="pricing-hero">
          <div className="hero-icon">💎</div>
          <h1 className="hero-title">{t("pricing.heroTitle")}</h1>
          <p className="hero-subtitle">
            {t("pricing.heroSubtitle")}
          </p>
          <div className="hero-badges">
            <span className="badge-item">✨ {t("pricing.benefits.specialOffer")}</span>
            <span className="badge-item">🚀 {t("pricing.benefits.upgradeNow")}</span>
            <span className="badge-item">💳 {t("pricing.benefits.easyPayment")}</span>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="pricing-benefits">
          <div className="benefit-item">
            <div className="benefit-icon">🎯</div>
            <h3>{t("pricing.benefits.suitable.title")}</h3>
            <p>{t("pricing.benefits.suitable.desc")}</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h3>{t("pricing.benefits.instant.title")}</h3>
            <p>{t("pricing.benefits.instant.desc")}</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🔄</div>
            <h3>{t("pricing.benefits.accumulate.title")}</h3>
            <p>{t("pricing.benefits.accumulate.desc")}</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {/* Creator VIP 1 */}
          <div className="pricing-card creator-card">
            <div className="card-icon">👤</div>
            <h2 className="pricing-title">{t("pricing.creator")}</h2>
            <p className="card-description">{t("pricing.plans.creator.desc")}</p>
            <div className="pricing-price">
              <span className="price-original">
                {formatVnd(pricing.creator.original)}
              </span>
              <span className="price-discounted">
                {formatVnd(pricing.creator.discounted)}
              </span>
            </div>
            <div className="pricing-duration">
              <p><strong>{t("pricing.plans.creator.duration")}</strong></p>
              <p className="pricing-note">
                {t("pricing.plans.creator.note")}
              </p>
            </div>
            <ul className="pricing-features">
              <li>
                <span className="feature-icon">📄</span>
                <span>{t("pricing.plans.creator.features.cv")}</span>
              </li>
              <li>
                <span className="feature-icon">💼</span>
                <span>{t("pricing.plans.creator.features.apply")}</span>
              </li>
              <li>
                <span className="feature-icon">🔍</span>
                <span>{t("pricing.plans.creator.features.viewBrand")}</span>
              </li>
              <li>
                <span className="feature-icon">🔔</span>
                <span>{t("pricing.plans.creator.features.notification")}</span>
              </li>
            </ul>
            <button
              className="pricing-btn creator-btn"
              onClick={() => handleBuyNow("creator")}
              disabled={processing}
            >
              {processing ? t("common.processing") : t("pricing.buyNow").toUpperCase()}
            </button>
          </div>

          {/* Brand VIP 2 (Basic) */}
          <div className="pricing-card brand-card">
            <div className="card-icon">🏢</div>
            <h2 className="pricing-title">{t("pricing.brandBasic")}</h2>
            <p className="card-description">{t("pricing.plans.brandBasic.desc")}</p>
            <div className="pricing-price">
              <span className="price-original">
                {formatVnd(pricing.brand.basic.original)}
              </span>
              <span className="price-discounted">
                {formatVnd(pricing.brand.basic.discounted)}
              </span>
            </div>
            <div className="pricing-duration">
              <p><strong>{t("pricing.plans.brandBasic.duration")}</strong></p>
              <p className="pricing-note">
                {t("pricing.plans.brandBasic.note")}
              </p>
            </div>
            <ul className="pricing-features">
              <li>
                <span className="feature-icon">📢</span>
                <span>{t("pricing.plans.brandBasic.features.postJob")}</span>
              </li>
              <li>
                <span className="feature-icon">📋</span>
                <span>{t("pricing.plans.brandBasic.features.viewCv")}</span>
              </li>
              <li>
                <span className="feature-icon">🎯</span>
                <span>{t("pricing.plans.brandBasic.features.findCreator")}</span>
              </li>
              <li>
                <span className="feature-icon">⚙️</span>
                <span>{t("pricing.plans.brandBasic.features.manageBrand")}</span>
              </li>
            </ul>
            <button
              className="pricing-btn brand-btn"
              onClick={() => handleBuyNow("brand", "basic")}
              disabled={processing}
            >
              {processing ? t("common.processing") : t("pricing.buyNow").toUpperCase()}
            </button>
          </div>

          {/* Brand Premium (499k) */}
          <div className="pricing-card brand-card">
            <div className="card-icon">🏢</div>
            <h2 className="pricing-title">{t("pricing.brandPremium")}</h2>
            <p className="card-description">
              {t("pricing.plans.brandPremium.desc")}
            </p>
            <div className="pricing-price">
              <span className="price-original">{formatVnd(pricing.brand.premium.original)}</span>
              <span className="price-discounted">{formatVnd(pricing.brand.premium.discounted)}</span>
            </div>
            <div className="pricing-duration">
              <p>
                <strong>{t("pricing.plans.brandPremium.duration")}</strong>
              </p>
              <p className="pricing-note">{t("pricing.plans.brandPremium.note")}</p>
            </div>
            <ul className="pricing-features">
              <li>
                <span className="feature-icon">📢</span>
                <span>{t("pricing.plans.brandPremium.features.postJob")}</span>
              </li>
              <li>
                <span className="feature-icon">📋</span>
                <span>{t("pricing.plans.brandPremium.features.viewCv")}</span>
              </li>
              <li>
                <span className="feature-icon">🚀</span>
                <span>{t("pricing.plans.brandPremium.features.postProject")}</span>
              </li>
              <li>
                <span className="feature-icon">⚙️</span>
                <span>{t("pricing.plans.brandPremium.features.manageBrand")}</span>
              </li>
            </ul>
            <button
              className="pricing-btn brand-btn"
              onClick={() => handleBuyNow("brand", "premium")}
              disabled={processing}
            >
              {processing ? t("common.processing") : t("pricing.plans.brandPremium.upgrade").toUpperCase()}
            </button>
          </div>
        </div>

        {/* Trust Section */}
        <div className="pricing-trust">
          <h3 className="trust-title">{t("pricing.trust.title")}</h3>
          <div className="trust-items">
            <div className="trust-item">
              <div className="trust-number">1000+</div>
              <div className="trust-label">{t("pricing.trust.users")}</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">24/7</div>
              <div className="trust-label">{t("pricing.trust.support")}</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">99%</div>
              <div className="trust-label">{t("pricing.trust.satisfaction")}</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">30+</div>
              <div className="trust-label">{t("pricing.trust.guarantee")}</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
