import { useEffect, useState } from "react";
import axios from "axios";

export function CreatorCVManager() {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    title: "",
    mainSkills: "",
    experienceYears: "",
    experienceDetail: "",
    tags: "",
    isPublic: true,
    cvFileUrl: "",
    cvFileType: "",
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCv = async () => {
    try {
      setLoading(true);
      if (!token) {
        setCv(null);
        return;
      }

      const res = await axios.get("http://localhost:3000/api/creator/cv", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCv(res.data.cv);
    } catch (err) {
      console.error("Fetch creator CV error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCv();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setCv(null);
    setForm({
      fullName: "",
      title: "",
      mainSkills: "",
      experienceYears: "",
      experienceDetail: "",
      tags: "",
      isPublic: true,
      cvFileUrl: "",
      cvFileType: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (cvData) => {
    setForm({
      fullName: cvData.fullName || "",
      title: cvData.title || "",
      mainSkills: (cvData.mainSkills || []).join(", "),
      experienceYears: cvData.experienceYears?.toString() || "",
      experienceDetail: cvData.experienceDetail || "",
      tags: (cvData.tags || []).join(", "),
      isPublic: cvData.isPublic !== undefined ? cvData.isPublic : true,
      cvFileUrl: cvData.cvFileUrl || "",
      cvFileType: cvData.cvFileType || "",
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
        "http://localhost:3000/api/upload/cv",
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
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.title.trim()) {
      setError("Vui lòng nhập đầy đủ Họ tên và Tiêu đề CV.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const payload = {
        fullName: form.fullName,
        title: form.title,
        mainSkills: form.mainSkills
          ? form.mainSkills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        experienceYears: parseInt(form.experienceYears) || 0,
        experienceDetail: form.experienceDetail,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        isPublic: form.isPublic,
        cvFileUrl: form.cvFileUrl || "",
        cvFileType: form.cvFileType || "",
      };

      if (cv) {
        await axios.put("http://localhost:3000/api/creator/cv", payload, config);
      } else {
        await axios.post("http://localhost:3000/api/creator/cv", payload, config);
      }

      setShowModal(false);
      await fetchCv();
    } catch (err) {
      console.error("Save creator CV error:", err);
      setError("Có lỗi xảy ra khi lưu CV.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa CV này?")) return;

    try {
      await axios.delete("http://localhost:3000/api/creator/cv", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCv();
    } catch (err) {
      console.error("Delete creator CV error:", err);
    }
  };

  if (loading) {
    return <div className="brand-section-loading">Đang tải CV của bạn...</div>;
  }

  return (
    <div className="brand-cv-manager">
      <div className="brand-cv-header">
        <h2 className="brand-section-title">QUẢN LÝ CV CỦA CREATOR</h2>
        {cv ? (
          <button className="secondary-btn" onClick={() => openEditModal(cv)}>
            ✏️ Sửa CV
          </button>
        ) : (
          <button className="primary-btn" onClick={openCreateModal}>
            + Tạo CV mới
          </button>
        )}
      </div>

      {!cv ? (
        <div className="brand-empty-state">
          <p>Bạn chưa có CV nào.</p>
          <p>Hãy tạo CV để Brand có thể tìm thấy bạn.</p>
        </div>
      ) : (
        <div className="brand-cv-list">
          <div key={cv._id} className="brand-cv-card">
            <h3>{cv.title}</h3>
            <p className="brand-cv-content">
              <strong>Họ tên:</strong> {cv.fullName}
            </p>
            {cv.mainSkills && cv.mainSkills.length > 0 && (
              <p className="brand-cv-content">
                <strong>Kỹ năng:</strong> {cv.mainSkills.join(", ")}
              </p>
            )}
            {cv.experienceYears > 0 && (
              <p className="brand-cv-content">
                <strong>Kinh nghiệm:</strong> {cv.experienceYears} năm
              </p>
            )}
            {cv.experienceDetail && (
              <p className="brand-cv-content">
                <strong>Chi tiết kinh nghiệm:</strong>{" "}
                {cv.experienceDetail.length > 200
                  ? cv.experienceDetail.slice(0, 200) + "..."
                  : cv.experienceDetail}
              </p>
            )}
            {cv.tags && cv.tags.length > 0 && (
              <p className="brand-cv-content">
                <strong>Tags:</strong> {cv.tags.join(", ")}
              </p>
            )}
            <p className="brand-cv-content">
              <strong>Trạng thái:</strong> {cv.isPublic ? "Công khai" : "Riêng tư"}
            </p>
            {cv.cvFileUrl && (
              <div className="brand-cv-file" style={{ marginTop: 16 }}>
                <img
                  src={cv.cvFileUrl}
                  alt="CV"
                  style={{ maxWidth: "100%", borderRadius: 12 }}
                />
              </div>
            )}
            <div className="brand-cv-actions">
              <button
                className="secondary-btn"
                onClick={() => openEditModal(cv)}
              >
                Sửa CV
              </button>
              <button className="danger-btn" onClick={handleDelete}>
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
            <h3>{cv ? "Sửa CV" : "Tạo CV mới"}</h3>
            {error && <p className="brand-error-text">{error}</p>}

            <form onSubmit={handleSubmit} className="brand-form">
              <label>
                Họ tên đầy đủ *
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </label>

              <label>
                Tiêu đề CV *
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Ví dụ: Content Creator chuyên về Lifestyle"
                />
              </label>

              <label>
                Kỹ năng chính (phân cách bằng dấu phẩy)
                <input
                  type="text"
                  value={form.mainSkills}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mainSkills: e.target.value }))
                  }
                  placeholder="Ví dụ: Video Editing, Photography, Social Media"
                />
              </label>

              <label>
                Số năm kinh nghiệm
                <input
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, experienceYears: e.target.value }))
                  }
                  placeholder="Ví dụ: 3"
                />
              </label>

              <label>
                Chi tiết kinh nghiệm
                <textarea
                  rows={4}
                  value={form.experienceDetail}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, experienceDetail: e.target.value }))
                  }
                  placeholder="Mô tả chi tiết kinh nghiệm của bạn..."
                />
              </label>

              <label>
                Tags (phân cách bằng dấu phẩy)
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  placeholder="Ví dụ: lifestyle, travel, vlog"
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

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isPublic: e.target.checked }))
                  }
                />
                <span>CV công khai (Brand có thể xem)</span>
              </label>

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

