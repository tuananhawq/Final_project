import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../config/api.js";
import { useNotification } from "../context/NotificationContext.jsx";

export function BrandCVManager() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCv, setEditingCv] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    cvFileUrl: "",
    cvFileType: "",
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const { confirm, notifySuccess, notifyError } = useNotification();

  const fetchCvs = async () => {
    try {
      setLoading(true);
      if (!token) {
        setCvs([]);
        return;
      }

      const res = await axios.get(`${API_URLS.BRAND_CV}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCvs(res.data.cvs || []);
    } catch (err) {
      console.error("Fetch brand CV error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setEditingCv(null);
    setForm({ title: "", content: "", cvFileUrl: "", cvFileType: "" });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (cv) => {
    setEditingCv(cv);
    setForm({
      title: cv.title,
      content: cv.content,
      cvFileUrl: cv.cvFileUrl || "",
      cvFileType: cv.cvFileType || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔥 CHỈ CHẤP NHẬN HÌNH ẢNH
    if (!file.type.startsWith("image/")) {
      setError("Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF, etc.).");
      e.target.value = "";
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File quá lớn. Kích thước tối đa là 10MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await axios.post(
        `${API_URLS.UPLOAD}/cv`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.url && res.data.fileType) {
        setForm((prev) => ({
          ...prev,
          cvFileUrl: res.data.url,
          cvFileType: res.data.fileType,
        }));
      } else {
        throw new Error("Không nhận được URL từ server");
      }
    } catch (err) {
      console.error("Upload CV file error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Upload file thất bại. Vui lòng thử lại.";
      setError(errorMsg);
      // Reset file input
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung CV.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editingCv) {
        await axios.put(
          `${API_URLS.BRAND_CV}/${editingCv._id}`,
          form,
          config
        );
      } else {
        await axios.post(
          `${API_URLS.BRAND_CV}`,
          form,
          config
        );
      }

      setShowModal(false);
      await fetchCvs();
    } catch (err) {
      console.error("Save brand CV error:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Có lỗi xảy ra khi lưu CV.";
      setError(errorMsg);
    }
  };

  const handleDelete = async (cvId) => {
    const ok = await confirm("Bạn có chắc chắn muốn xóa CV này?");
    if (!ok) return;

    try {
      await axios.delete(`${API_URLS.BRAND_CV}/${cvId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCvs();
      notifySuccess("Đã xóa CV.");
    } catch (err) {
      console.error("Delete brand CV error:", err);
      notifyError("Xóa CV thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <div className="brand-section-loading">Đang tải CV của bạn...</div>;
  }

  // 🔥 Mỗi Brand chỉ có 1 CV
  const currentCv = cvs.length > 0 ? cvs[0] : null;

  return (
    <div className="brand-cv-manager">
      <div className="brand-cv-header">
        <h2 className="brand-section-title">QUẢN LÝ CV CỦA BRAND</h2>
        {currentCv ? (
          <button className="secondary-btn" onClick={() => openEditModal(currentCv)}>
            ✏️ Sửa CV
          </button>
        ) : (
          <button className="primary-btn" onClick={openCreateModal}>
            + Tạo CV mới
          </button>
        )}
      </div>

      {!currentCv ? (
        <div className="brand-empty-state">
          <p>Bạn chưa có CV nào.</p>
          <p>Hãy tạo CV để giới thiệu về Brand của bạn với các Creator.</p>
        </div>
      ) : (
        <div className="brand-cv-list">
          <div key={currentCv._id} className="brand-cv-card">
            <h3>{currentCv.title}</h3>
            <p className="brand-cv-content">
              {currentCv.content.length > 200
                ? currentCv.content.slice(0, 200) + "..."
                : currentCv.content}
            </p>
            {currentCv.cvFileUrl && (
              <div className="brand-cv-file" style={{ marginTop: 16 }}>
                <img
                  src={currentCv.cvFileUrl}
                  alt="CV"
                  style={{ maxWidth: "100%", borderRadius: 12 }}
                />
              </div>
            )}
            <div className="brand-cv-actions">
              <button
                className="secondary-btn"
                onClick={() => openEditModal(currentCv)}
              >
                Sửa CV
              </button>
              <button
                className="danger-btn"
                onClick={() => handleDelete(currentCv._id)}
              >
                Xóa CV
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="brand-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="brand-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>{editingCv ? "Sửa CV" : "Tạo CV mới"}</h3>
            {error && <p className="brand-error-text">{error}</p>}

            <form onSubmit={handleSubmit} className="brand-form">
              <label>
                Tiêu đề CV
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Ví dụ: Hồ sơ hợp tác KOL cho chiến dịch TikTok"
                />
              </label>

              <label>
                Nội dung CV
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  placeholder="Mô tả chi tiết thế mạnh, case study, kết quả chiến dịch từng làm..."
                />
              </label>

              <label>
                Hình ảnh CV
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>

              {uploading && (
                <p className="brand-section-loading" style={{ marginTop: 8 }}>
                  Đang upload file CV...
                </p>
              )}

              {form.cvFileUrl && (
                <div className="brand-cv-file-preview">
                  <img
                    src={form.cvFileUrl}
                    alt="CV preview"
                    style={{ maxWidth: "100%", borderRadius: 12, marginTop: 12 }}
                  />
                </div>
              )}

              <div className="brand-form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="primary-btn">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


