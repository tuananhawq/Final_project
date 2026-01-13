import { useState, useEffect } from "react";
import { getAllImages, getImageStats, deleteImage } from "../services/imageService.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

export function ImageManagement() {
  const [images, setImages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { confirm, notifySuccess, notifyError, notifyInfo } = useNotification();

  const folders = [
    { value: "", label: "Tất cả" },
    { value: "avatars", label: "Avatars" },
    { value: "brand-cv", label: "Brand CV" },
    { value: "banners", label: "Banners" },
    { value: "home/heroes", label: "Home - Heroes" },
    { value: "home/agencies", label: "Home - Agencies" },
    { value: "home/creators", label: "Home - Creators" },
    { value: "home/topics", label: "Home - Topics" },
    { value: "home/testimonials", label: "Home - Testimonials" },
    { value: "blog", label: "Blog" },
    { value: "brands/logos", label: "Brand Logos" },
  ];

  useEffect(() => {
    loadStats();
    loadImages();
  }, [selectedFolder]);

  const loadStats = async () => {
    try {
      const data = await getImageStats();
      setStats(data);
    } catch (error) {
      notifyError("Lỗi khi tải thống kê: " + error.message);
    }
  };

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await getAllImages(selectedFolder || null);
      setImages(data.images || []);
    } catch (error) {
      notifyError("Lỗi khi tải hình ảnh: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId, filename) => {
    const ok = await confirm(`Bạn có chắc muốn xóa hình ảnh "${filename}"?`);
    if (!ok) return;
    
    try {
      await deleteImage(publicId);
      notifySuccess("Xóa hình ảnh thành công!");
      loadImages();
      loadStats();
    } catch (error) {
      notifyError("Lỗi khi xóa: " + (error.response?.data?.message || error.message));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notifyInfo("Đã copy URL vào clipboard!");
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredImages = images.filter((img) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      img.filename?.toLowerCase().includes(search) ||
      img.publicId?.toLowerCase().includes(search) ||
      img.folder?.toLowerCase().includes(search)
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#fff" }}>Quản lý Hình ảnh Cloudinary</h2>

      {/* Stats */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              borderRadius: "12px",
              color: "#fff",
            }}
          >
            <div style={{ fontSize: "14px", opacity: 0.9 }}>Tổng số hình ảnh</div>
            <div style={{ fontSize: "32px", fontWeight: "700", marginTop: "8px" }}>
              {stats.total || 0}
            </div>
          </div>
          {stats.folders?.map((stat) => (
            <div
              key={stat.folder}
              style={{
                padding: "15px",
                background: "#1f2937",
                borderRadius: "8px",
                border: "1px solid #374151",
              }}
            >
              <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>
                {folders.find((f) => f.value === stat.folder)?.label || stat.folder}
              </div>
              <div style={{ fontSize: "24px", fontWeight: "600", color: "#fff" }}>
                {stat.count || 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: "#1f2937",
            color: "#fff",
            minWidth: "200px",
          }}
        >
          {folders.map((folder) => (
            <option key={folder.value} value={folder.value}>
              {folder.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên file, folder..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: "#111827",
            color: "#fff",
            flex: 1,
            minWidth: "250px",
          }}
        />

        <button
          onClick={loadImages}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Đang tải..." : "🔄 Làm mới"}
        </button>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
          Đang tải hình ảnh...
        </div>
      ) : filteredImages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
          Không tìm thấy hình ảnh nào
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredImages.map((img) => (
            <div
              key={img.publicId}
              style={{
                background: "#1f2937",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #374151",
              }}
            >
              {/* Image Preview */}
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  background: "#111827",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={img.url}
                  alt={img.filename}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = '<div style="color: #9ca3af; padding: 20px;">Không thể tải hình ảnh</div>';
                  }}
                />
              </div>

              {/* Image Info */}
              <div style={{ padding: "15px" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: "8px",
                    wordBreak: "break-word",
                  }}
                >
                  {img.filename || img.publicId.split("/").pop()}
                </div>

                <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>
                  📁 {img.folder || "Root"}
                </div>

                <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>
                  📏 {img.width} × {img.height} • {formatBytes(img.bytes)}
                </div>

                <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
                  📅 {formatDate(img.createdAt)}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => copyToClipboard(img.url)}
                    style={{
                      padding: "6px 12px",
                      background: "#111827",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      flex: 1,
                    }}
                  >
                    📋 Copy URL
                  </button>
                  <button
                    onClick={() => window.open(img.url, "_blank")}
                    style={{
                      padding: "6px 12px",
                      background: "#6366f1",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      flex: 1,
                    }}
                  >
                    🔗 Mở
                  </button>
                  <button
                    onClick={() => handleDelete(img.publicId, img.filename)}
                    style={{
                      padding: "6px 12px",
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredImages.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
          Hiển thị {filteredImages.length} / {images.length} hình ảnh
        </div>
      )}
    </div>
  );
}
