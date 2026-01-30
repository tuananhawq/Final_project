import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { useNotification } from "../context/NotificationContext.jsx";
import { uploadBrandLogo } from "../services/uploadService.jsx";

export function BrandProfileManager() {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    logo: "",
    website: "",
    industry: "",
    followers: "",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    fetchBrandProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBrandProfile = async () => {
    try {
      setLoading(true);
      if (!token) {
        setBrand(null);
        return;
      }

      const res = await axios.get(`${API_URLS.JOB_POST}/brand/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const brandData = res.data.brand;
      setBrand(brandData);
      setForm({
        companyName: brandData.companyName || "",
        description: brandData.description || "",
        logo: brandData.logo || "",
        website: brandData.website || "",
        industry: brandData.industry || "",
        followers: brandData.followers || "0",
      });
    } catch (err) {
      console.error("Fetch brand profile error:", err);
      notifyError("Không thể tải thông tin brand profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadBrandLogo(file);
      setForm((prev) => ({ ...prev, logo: result.url }));
      notifySuccess("Upload logo thành công!");
    } catch (err) {
      console.error("Upload logo error:", err);
      notifyError("Upload logo thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!form.companyName.trim()) {
      setError("Tên công ty là bắt buộc");
      setSaving(false);
      return;
    }

    if (!form.description.trim()) {
      setError("Mô tả là bắt buộc");
      setSaving(false);
      return;
    }

    try {
      const res = await axios.put(
        `${API_URLS.JOB_POST}/brand/profile`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBrand(res.data.brand);
      notifySuccess("Cập nhật brand profile thành công!");
    } catch (err) {
      console.error("Save brand profile error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Có lỗi xảy ra khi lưu brand profile";
      setError(errorMsg);
      notifyError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="brand-section-loading">
        Đang tải thông tin brand profile...
      </div>
    );
  }

  return (
    <div className="brand-profile-manager">
      <div className="brand-cv-header">
        <h2 className="brand-section-title">QUẢN LÝ BRAND PROFILE</h2>
      </div>

      {error && <p className="brand-error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="brand-form">
        <label>
          Tên công ty <span style={{ color: "#ef4444" }}>*</span>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Nhập tên công ty"
            required
          />
        </label>

        <label>
          Mô tả <span style={{ color: "#ef4444" }}>*</span>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Mô tả về công ty, lĩnh vực hoạt động..."
            rows={6}
            required
          />
        </label>

        <label>
          Logo
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "8px" }}>
            {form.logo && (
              <img
                src={form.logo}
                alt="Logo"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid rgba(148,163,184,0.2)",
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={form.logo}
                onChange={(e) => handleChange("logo", e.target.value)}
                placeholder="Nhập URL logo hoặc upload"
                style={{ marginBottom: "8px" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: "none" }}
                id="logo-upload"
                disabled={uploading}
              />
              <label
                htmlFor="logo-upload"
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  background: uploading ? "#666" : "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                }}
              >
                {uploading ? "Đang upload..." : "📤 Upload Logo"}
              </label>
            </div>
          </div>
        </label>

        <label>
          Website
          <input
            type="url"
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://example.com"
          />
        </label>

        <label>
          Ngành nghề
          <input
            type="text"
            value={form.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
            placeholder="Ví dụ: E-commerce, F&B, Technology..."
          />
        </label>

        <label>
          Số lượng followers
          <input
            type="text"
            value={form.followers}
            onChange={(e) => handleChange("followers", e.target.value)}
            placeholder="Ví dụ: 10000"
          />
        </label>

        <div className="brand-form-actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </div>
      </form>

      {brand && (
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "rgba(15,23,42,0.5)", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "12px", color: "#7dd3fc" }}>Thông tin hiện tại</h3>
          <p><strong>Tên công ty:</strong> {brand.companyName}</p>
          <p><strong>Mô tả:</strong> {brand.description}</p>
          {brand.website && <p><strong>Website:</strong> {brand.website}</p>}
          {brand.industry && <p><strong>Ngành nghề:</strong> {brand.industry}</p>}
          <p><strong>Followers:</strong> {brand.followers}</p>
          <p><strong>Trạng thái:</strong> {brand.isActive ? "Đang hoạt động" : "Không hoạt động"}</p>
        </div>
      )}
    </div>
  );
}

