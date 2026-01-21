import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { checkoutSuccess } from "../services/paymentService";
import { useNotification } from "../context/NotificationContext";
import "../styles/pricing.css";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [alreadyProcessed, setAlreadyProcessed] = useState(false);
  const hasProcessedRef = useRef(false); // Đảm bảo chỉ gọi API 1 lần

  useEffect(() => {
    // Chỉ xử lý 1 lần
    if (hasProcessedRef.current) {
      return;
    }

    const token = searchParams.get("token");

    if (!token) {
      setError("Token không hợp lệ");
      setLoading(false);
      hasProcessedRef.current = true;
      return;
    }

    const processPayment = async () => {
      // Đánh dấu đã xử lý để tránh gọi lại
      hasProcessedRef.current = true;

      try {
        const result = await checkoutSuccess(token);
        
        // Kiểm tra xem có phải là trường hợp đã xử lý trước đó không
        if (result.alreadyProcessed || (result.message && result.message.includes("đã được xử lý"))) {
          setAlreadyProcessed(true);
          setSuccess(true);
          setTransactionData(result);
          notifySuccess("Giao dịch này đã được xử lý trước đó.");
        } else {
          setSuccess(true);
          setTransactionData(result);
          notifySuccess("Thanh toán thành công! Tài khoản của bạn đã được nâng cấp.");
        }
        
        // Redirect về trang pricing sau 3 giây
        setTimeout(() => {
          navigate("/pricing");
        }, 3000);
      } catch (err) {
        console.error("Error processing payment:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Không thể xử lý thanh toán. Vui lòng liên hệ hỗ trợ.";
        setError(errorMessage);
        notifyError(errorMessage);
        
        // Redirect về trang pricing sau 5 giây nếu có lỗi
        setTimeout(() => {
          navigate("/pricing");
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi component mount

  return (
    <div className="pricing-page">
      <Header />
      <div className="pricing-container">
        <div className="checkout-result">
          {loading && (
            <div className="checkout-loading">
              <div className="loading-spinner">⏳</div>
              <h2>Đang xử lý thanh toán...</h2>
              <p>Vui lòng đợi trong giây lát</p>
            </div>
          )}

          {success && transactionData && (
            <div className="checkout-success">
              <div className="success-icon">✅</div>
              <h2 className="success-title">
                {alreadyProcessed ? "Giao dịch đã được xử lý" : "Thanh toán thành công!"}
              </h2>
              <p className="success-message">
                {alreadyProcessed
                  ? "Giao dịch này đã được xử lý trước đó. Tài khoản của bạn đã được nâng cấp."
                  : "Tài khoản của bạn đã được nâng cấp thành công."}
              </p>
              
              <div className="transaction-details">
                <div className="detail-item">
                  <span className="detail-label">Gói dịch vụ:</span>
                  <span className="detail-value">
                    {transactionData.transaction?.plan === "creator"
                      ? "Creator VIP"
                      : "Brand VIP"}
                  </span>
                </div>
                {transactionData.user?.premiumExpiredAt && (
                  <div className="detail-item">
                    <span className="detail-label">Hết hạn vào:</span>
                    <span className="detail-value">
                      {new Date(
                        transactionData.user.premiumExpiredAt
                      ).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <p className="redirect-message">
                Bạn sẽ được chuyển về trang bảng giá sau 3 giây...
              </p>
            </div>
          )}

          {error && (
            <div className="checkout-error">
              <div className="error-icon">❌</div>
              <h2 className="error-title">Thanh toán thất bại</h2>
              <p className="error-message">{error}</p>
              <p className="redirect-message">
                Bạn sẽ được chuyển về trang bảng giá sau 5 giây...
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

