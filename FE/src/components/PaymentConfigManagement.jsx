import { useState, useEffect } from "react";
import {
  getPaymentConfig,
  updatePaymentConfig,
} from "../services/paymentService";
import { uploadPaymentQRCode } from "../services/uploadService";
import { useNotification } from "../context/NotificationContext";
import "../styles/payment-config.css";

export default function PaymentConfigManagement() {
  const [config, setConfig] = useState({
    qrCodeUrl: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await getPaymentConfig();
      if (data.config) {
        setConfig({
          qrCodeUrl: data.config.qrCodeUrl || "",
          bankName: data.config.bankName || "",
          accountNumber: data.config.accountNumber || "",
          accountHolder: data.config.accountHolder || "",
        });
      }
    } catch (error) {
      console.error("Error fetching payment config:", error);
      notifyError("Không thể tải cấu hình thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const handleQRCodeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notifyError("Chỉ chấp nhận file hình ảnh");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadPaymentQRCode(file);
      setConfig((prev) => ({ ...prev, qrCodeUrl: result.url }));
      notifySuccess("Upload QR Code thành công!");
    } catch (error) {
      console.error("Error uploading QR code:", error);
      notifyError(
        error.response?.data?.message || "Không thể upload QR Code"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePaymentConfig(config);
      notifySuccess("Cập nhật cấu hình thanh toán thành công!");
    } catch (error) {
      console.error("Error updating payment config:", error);
      notifyError(
        error.response?.data?.message || "Không thể cập nhật cấu hình"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="payment-config-management">
        <div className="config-loading">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-config-management">
      <div className="config-header">
        <h2>⚙️ Cấu hình Thanh toán</h2>
        <p className="config-subtitle">
          Quản lý QR Code và thông tin tài khoản ngân hàng
        </p>
      </div>

      <div className="config-content">
        {/* QR Code Section */}
        <div className="config-section">
          <h3 className="section-title">QR Code Thanh toán</h3>
          <div className="qr-upload-area">
            {config.qrCodeUrl ? (
              <div className="qr-preview">
                <img
                  src={config.qrCodeUrl}
                  alt="QR Code"
                  className="qr-image"
                />
                <button
                  className="remove-qr-btn"
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, qrCodeUrl: "" }))
                  }
                >
                  ✕ Xóa
                </button>
              </div>
            ) : (
              <div className="qr-placeholder">
                <div className="qr-placeholder-icon">📷</div>
                <p>Chưa có QR Code</p>
                <p className="qr-placeholder-hint">
                  Upload QR Code để hiển thị trong modal thanh toán
                </p>
              </div>
            )}
            <div className="upload-controls">
              <label className="upload-btn">
                {uploading ? "Đang upload..." : "📤 Upload QR Code"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQRCodeUpload}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Bank Info Section */}
        <div className="config-section">
          <h3 className="section-title">Thông tin Tài khoản Ngân hàng</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="bankName">Tên ngân hàng</label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={config.bankName}
                onChange={handleInputChange}
                placeholder="Ví dụ: Vietcombank"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accountNumber">Số tài khoản</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={config.accountNumber}
                onChange={handleInputChange}
                placeholder="Ví dụ: 1234567890"
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="accountHolder">Chủ tài khoản</label>
              <input
                type="text"
                id="accountHolder"
                name="accountHolder"
                value={config.accountHolder}
                onChange={handleInputChange}
                placeholder="Ví dụ: CÔNG TY TNHH REVLIVE"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="config-actions">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "💾 Lưu cấu hình"}
          </button>
        </div>
      </div>
    </div>
  );
}
