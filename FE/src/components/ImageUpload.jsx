import { useState, useRef } from "react";
import { uploadImage } from "../services/homeService.jsx";

export function ImageUpload({ value, onChange, label = "Hình ảnh", required = false }) {
  const [imageUrl, setImageUrl] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [useUrl, setUseUrl] = useState(true);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview ngay lập tức
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const result = await uploadImage(file);
      const url = `http://localhost:3000${result.url}`;
      setImageUrl(url);
      setPreview(url);
      onChange(url);
      setUseUrl(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Lỗi khi upload hình ảnh: " + (error.response?.data?.error || error.message));
      setPreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreview(url);
    onChange(url);
    setUseUrl(true);
  };

  const handleRemove = () => {
    setImageUrl("");
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
        {label} {required && <span style={{ color: "#c00" }}>*</span>}
      </label>

      {/* Toggle giữa Upload và URL */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button
          type="button"
          onClick={() => {
            setUseUrl(false);
            setImageUrl("");
            setPreview("");
            onChange("");
          }}
          style={{
            padding: "6px 12px",
            background: !useUrl ? "#111827" : "#e5e7eb",
            color: !useUrl ? "#fff" : "#666",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => {
            setUseUrl(true);
            setImageUrl("");
            setPreview("");
            onChange("");
          }}
          style={{
            padding: "6px 12px",
            background: useUrl ? "#111827" : "#e5e7eb",
            color: useUrl ? "#fff" : "#666",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Nhập URL
        </button>
      </div>

      {/* Upload File */}
      {!useUrl && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              width: "100%",
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          />
          {uploading && (
            <div style={{ marginTop: "8px", color: "#666", fontSize: "13px" }}>
              Đang upload...
            </div>
          )}
        </div>
      )}

      {/* Nhập URL */}
      {useUrl && (
        <input
          type="text"
          placeholder="Nhập URL hình ảnh (ví dụ: https://example.com/image.jpg)"
          value={imageUrl}
          onChange={handleUrlChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            width: "100%",
          }}
        />
      )}

      {/* Preview */}
      {preview && (
        <div style={{ marginTop: "15px" }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "300px",
                maxHeight: "200px",
                display: "block",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<div style="padding: 20px; color: #999;">Không thể load hình ảnh</div>';
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              ✕ Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

