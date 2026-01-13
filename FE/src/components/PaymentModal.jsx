import { useState } from "react";
import { useNotification } from "../context/NotificationContext";
import "../styles/payment-modal.css";

export default function PaymentModal({ plan, transaction, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const { notifySuccess, notifyError, confirm } = useNotification();

  const planName = plan === "creator" ? "Creator VIP 1" : "Brand VIP 2";
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(transaction.amount);

  const handleConfirmTransfer = async () => {
    const confirmed = await confirm(
      "Bạn đã chuyển khoản thành công? Vui lòng xác nhận để hoàn tất đơn hàng.",
      {
        confirmLabel: "Đã chuyển khoản",
        cancelLabel: "Hủy",
      }
    );

    if (confirmed) {
      setConfirmed(true);
      notifySuccess(
        "Đơn hàng của bạn đã được gửi đến hệ thống. Staff sẽ kiểm tra và duyệt trong thời gian sớm nhất."
      );
      // Đóng modal sau 2 giây
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleCopyTransferContent = () => {
    navigator.clipboard.writeText(transaction.transferContent);
    notifySuccess("Đã sao chép nội dung chuyển khoản");
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="payment-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="payment-modal-header">
          <h2>Xác nhận thanh toán</h2>
          <p className="payment-plan-name">{planName}</p>
        </div>

        <div className="payment-modal-content">
          {/* QR Code */}
          {transaction.qrCodeUrl ? (
            <div className="payment-qr-section">
              <h3>Quét mã QR để thanh toán</h3>
              <div className="payment-qr-container">
                <img
                  src={transaction.qrCodeUrl}
                  alt="QR Code"
                  className="payment-qr-image"
                />
              </div>
            </div>
          ) : (
            <div className="payment-qr-section">
              <h3>Thông tin chuyển khoản</h3>
              <p className="payment-qr-placeholder">
                QR Code sẽ được cập nhật bởi Staff
              </p>
            </div>
          )}

          {/* Thông tin chuyển khoản */}
          <div className="payment-transfer-info">
            <div className="payment-amount">
              <span className="payment-label">Số tiền:</span>
              <span className="payment-value">{formattedAmount}</span>
            </div>

            <div className="payment-transfer-content">
              <span className="payment-label">Nội dung chuyển khoản:</span>
              <div className="payment-content-box">
                <code className="payment-content-text">
                  {transaction.transferContent}
                </code>
                <button
                  className="payment-copy-btn"
                  onClick={handleCopyTransferContent}
                  title="Sao chép"
                >
                  📋
                </button>
              </div>
              <p className="payment-content-note">
                ⚠️ <strong>Quan trọng:</strong> Vui lòng chuyển khoản đúng nội dung trên để Staff có thể đối soát nhanh chóng.
              </p>
            </div>
          </div>

          {/* Hướng dẫn */}
          <div className="payment-instructions">
            <h4>Hướng dẫn thanh toán:</h4>
            <ol>
              <li>Chuyển khoản số tiền <strong>{formattedAmount}</strong> vào tài khoản ngân hàng</li>
              <li>Nhập nội dung chuyển khoản: <strong>{transaction.transferContent}</strong></li>
              <li>Nhấn nút "Tôi đã chuyển khoản thành công" sau khi hoàn tất</li>
              <li>Staff sẽ kiểm tra và duyệt đơn hàng trong thời gian sớm nhất</li>
            </ol>
          </div>

          {/* Nút xác nhận */}
          {!confirmed && (
            <div className="payment-modal-actions">
              <button
                className="payment-confirm-btn"
                onClick={handleConfirmTransfer}
              >
                Tôi đã chuyển khoản thành công
              </button>
              <button className="payment-cancel-btn" onClick={onClose}>
                Hủy
              </button>
            </div>
          )}

          {confirmed && (
            <div className="payment-success-message">
              <p>✓ Đơn hàng của bạn đã được gửi đến hệ thống!</p>
              <p>Staff sẽ kiểm tra và duyệt trong thời gian sớm nhất.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
