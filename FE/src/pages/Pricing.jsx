import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getPricing, createTransaction } from "../services/paymentService";
import { useNotification } from "../context/NotificationContext";
import PaymentModal from "../components/PaymentModal";
import "../styles/pricing.css";

export default function Pricing() {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const { notifyError, notifyInfo } = useNotification();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await getPricing();
        setPricing(data.pricing);
      } catch (error) {
        console.error("Error fetching pricing:", error);
        notifyError("Không thể tải thông tin bảng giá");
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [notifyError]);

  const handleBuyNow = async (plan) => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      notifyInfo("Vui lòng đăng nhập để tiếp tục");
      navigate("/login");
      return;
    }

    try {
      // Tạo transaction
      const result = await createTransaction(plan);
      setSelectedPlan({
        plan,
        transaction: result.transaction,
      });
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error creating transaction:", error);
      if (error.response?.status === 401) {
        notifyError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        navigate("/login");
      } else {
        notifyError(
          error.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại"
        );
      }
    }
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="pricing-page">
        <Header />
        <div className="pricing-loading">
          <p>Đang tải...</p>
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
          <p>Không thể tải thông tin bảng giá</p>
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
          <h1 className="hero-title">Bảng Giá Thành Viên</h1>
          <p className="hero-subtitle">
            Nâng cấp tài khoản của bạn để trải nghiệm đầy đủ các tính năng
          </p>
          <div className="hero-badges">
            <span className="badge-item">✨ Ưu đãi đặc biệt</span>
            <span className="badge-item">🚀 Nâng cấp ngay</span>
            <span className="badge-item">💳 Thanh toán dễ dàng</span>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="pricing-benefits">
          <div className="benefit-item">
            <div className="benefit-icon">🎯</div>
            <h3>Phù hợp với nhu cầu</h3>
            <p>Gói dịch vụ được thiết kế riêng cho Creator và Brand</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h3>Kích hoạt ngay lập tức</h3>
            <p>Nâng cấp tài khoản ngay sau khi thanh toán thành công</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🔄</div>
            <h3>Cộng dồn thời gian</h3>
            <p>Thời gian sử dụng được cộng dồn khi gia hạn</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {/* Creator VIP 1 */}
          <div className="pricing-card creator-card">
            <div className="card-icon">👤</div>
            <h2 className="pricing-title">Creator</h2>
            <p className="card-description">Dành cho các Creator tài năng</p>
            <div className="pricing-price">
              <span className="price-original">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(pricing.creator.original)}
              </span>
              <span className="price-discounted">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(pricing.creator.discounted)}
              </span>
            </div>
            <div className="pricing-duration">
              <p>Thời gian sử dụng: <strong>01 tháng (30 ngày)</strong></p>
              <p className="pricing-note">
                ✓ Có hỗ trợ cộng dồn thời gian
              </p>
            </div>
            <ul className="pricing-features">
              <li>
                <span className="feature-icon">📄</span>
                <span>Tạo và quản lý CV chuyên nghiệp</span>
              </li>
              <li>
                <span className="feature-icon">💼</span>
                <span>Ứng tuyển vào các công việc phù hợp</span>
              </li>
              <li>
                <span className="feature-icon">🔍</span>
                <span>Xem thông tin chi tiết Brand</span>
              </li>
              <li>
                <span className="feature-icon">🔔</span>
                <span>Nhận thông báo việc làm mới</span>
              </li>
            </ul>
            <button
              className="pricing-btn creator-btn"
              onClick={() => handleBuyNow("creator")}
            >
              MUA NGAY
            </button>
          </div>

          {/* Brand VIP 2 */}
          <div className="pricing-card brand-card">
            <div className="card-icon">🏢</div>
            <h2 className="pricing-title">Brand</h2>
            <p className="card-description">Dành cho các Brand và Doanh nghiệp</p>
            <div className="pricing-price">
              <span className="price-original">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(pricing.brand.original)}
              </span>
              <span className="price-discounted">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(pricing.brand.discounted)}
              </span>
            </div>
            <div className="pricing-duration">
              <p>Thời gian sử dụng: <strong>01 tháng (30 ngày)</strong></p>
              <p className="pricing-note">
                ✓ Có hỗ trợ cộng dồn thời gian
              </p>
            </div>
            <ul className="pricing-features">
              <li>
                <span className="feature-icon">📢</span>
                <span>Đăng tin tuyển dụng không giới hạn</span>
              </li>
              <li>
                <span className="feature-icon">📋</span>
                <span>Xem và quản lý CV ứng viên</span>
              </li>
              <li>
                <span className="feature-icon">🎯</span>
                <span>Tìm kiếm Creator phù hợp</span>
              </li>
              <li>
                <span className="feature-icon">⚙️</span>
                <span>Quản lý thông tin Brand</span>
              </li>
            </ul>
            <button
              className="pricing-btn brand-btn"
              onClick={() => handleBuyNow("brand")}
            >
              MUA NGAY
            </button>
          </div>
        </div>

        {/* Trust Section */}
        <div className="pricing-trust">
          <h3 className="trust-title">Tại sao chọn REVLIVE?</h3>
          <div className="trust-items">
            <div className="trust-item">
              <div className="trust-number">1000+</div>
              <div className="trust-label">Người dùng tin tưởng</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">24/7</div>
              <div className="trust-label">Hỗ trợ khách hàng</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">99%</div>
              <div className="trust-label">Độ hài lòng</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">30+</div>
              <div className="trust-label">Ngày đảm bảo hoàn tiền</div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedPlan && (
        <PaymentModal
          plan={selectedPlan.plan}
          transaction={selectedPlan.transaction}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </div>
  );
}
