import { useState, useEffect } from "react";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  warnBlog,
  deleteBlogWithReason,
  lockBrandAccount,
} from "../services/blogService.jsx";
import { uploadBlogImage } from "../services/uploadService.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    featured: false,
    category: "General",
    tags: "",
    isPublished: true,
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [warningModal, setWarningModal] = useState({ open: false, blog: null, type: null });
  const [violationReason, setViolationReason] = useState("");
  const [staffNotes, setStaffNotes] = useState("");
  const [detailBlog, setDetailBlog] = useState(null);
  const { notifySuccess, notifyError, confirm } = useNotification();
  const { t } = useLanguage();

  // Check if user is staff
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  const isStaff = user?.roles?.includes("staff") || user?.roles?.includes("admin");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      notifyError(t("blog.loadError") + ": " + error.message);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const result = await uploadBlogImage(file);
      setBlogForm({ ...blogForm, image: result.url });
      notifySuccess(t("blog.uploadSuccess"));
    } catch (error) {
      notifyError(
        t("blog.uploadError") + ": " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = {
        ...blogForm,
        tags: blogForm.tags
          ? blogForm.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      if (editingBlog) {
        await updateBlog(editingBlog._id, formData);
        notifySuccess(t("blog.updateSuccess"));
      } else {
        await createBlog(formData);
        notifySuccess(t("blog.createSuccess"));
      }

      setBlogForm({
        title: "",
        content: "",
        excerpt: "",
        image: "",
        featured: false,
        category: "General",
        tags: "",
        isPublished: true,
      });
      setEditingBlog(null);
      loadBlogs();
    } catch (error) {
      notifyError("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      image: blog.image || "",
      featured: blog.featured || false,
      category: blog.category || "General",
      tags: blog.tags ? blog.tags.join(", ") : "",
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
    });
  };

  const handleDelete = async (id) => {
    const ok = await confirm(t("blog.deleteConfirm"));
    if (!ok) return;
    try {
      await deleteBlog(id);
      notifySuccess(t("blog.deleteSuccess"));
      loadBlogs();
    } catch (error) {
      notifyError(t("common.error") + ": " + error.message);
    }
  };

  // Staff functions
  const handleWarnBlog = async () => {
    if (!violationReason.trim()) {
      notifyError("Vui lòng nhập lý do vi phạm");
      return;
    }
    try {
      await warnBlog(warningModal.blog._id, violationReason, staffNotes);
      notifySuccess("Đã gửi cảnh cáo cho Brand thành công");
      setWarningModal({ open: false, blog: null, type: null });
      setViolationReason("");
      setStaffNotes("");
      loadBlogs();
    } catch (error) {
      notifyError("Lỗi: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteWithReason = async () => {
    if (!violationReason.trim()) {
      notifyError("Vui lòng nhập lý do vi phạm");
      return;
    }
    const ok = await confirm("Bạn có chắc chắn muốn xóa bài đăng này? Brand sẽ nhận được cảnh cáo.");
    if (!ok) return;
    try {
      await deleteBlogWithReason(warningModal.blog._id, violationReason, staffNotes);
      notifySuccess("Đã xóa bài đăng và gửi cảnh cáo cho Brand");
      setWarningModal({ open: false, blog: null, type: null });
      setViolationReason("");
      setStaffNotes("");
      loadBlogs();
    } catch (error) {
      notifyError("Lỗi: " + (error.response?.data?.error || error.message));
    }
  };

  const handleLockBrand = async (authorId, warningCount) => {
    if (warningCount < 3) {
      notifyError("Brand phải có ít nhất 3 cảnh cáo trước khi khóa tài khoản");
      return;
    }
    const ok = await confirm(`Bạn có chắc chắn muốn khóa tài khoản Brand này? (Đã có ${warningCount} cảnh cáo)`);
    if (!ok) return;
    try {
      await lockBrandAccount(authorId, "Vi phạm quá 3 lần về bài đăng");
      notifySuccess("Đã khóa tài khoản Brand thành công");
      loadBlogs();
    } catch (error) {
      notifyError("Lỗi: " + (error.response?.data?.error || error.message));
    }
  };

  const openDetailModal = (blog) => {
    setDetailBlog(blog);
  };

  const closeDetailModal = () => {
    setDetailBlog(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>{t("blog.title")}</h2>

      {/* Form */}
      <div style={{ marginBottom: "30px", padding: "20px", background: "#1f2937", borderRadius: "8px" }}>
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>
          {editingBlog ? t("blog.editBlog") : t("blog.addNew")}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "15px", maxWidth: "800px" }}>
            <input
              type="text"
              placeholder={t("blog.titlePlaceholder")}
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              required
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #374151",
                background: "#111827",
                color: "#fff",
              }}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              {t("blog.imageLabel")} <span style={{ color: "#c00" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder={t("blog.imagePlaceholder")}
                value={blogForm.image}
                onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                required
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                  flex: 1,
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                style={{ display: "none" }}
                id="blog-image-upload"
              />
              <label
                htmlFor="blog-image-upload"
                style={{
                  padding: "10px 20px",
                  background: uploading ? "#666" : "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: "600",
                }}
              >
                {uploading ? t("common.uploading") : `📤 ${t("common.upload")}`}
              </label>
            </div>

            <textarea
              placeholder={t("blog.excerptPlaceholder")}
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
              rows={3}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #374151",
                background: "#111827",
                color: "#fff",
                fontFamily: "inherit",
              }}
            />

            <textarea
              placeholder={t("blog.contentPlaceholder")}
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
              required
              rows={10}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #374151",
                background: "#111827",
                color: "#fff",
                fontFamily: "inherit",
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <select
                value={blogForm.category}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                }}
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Entertainment">Entertainment</option>
                <option value="News">News</option>
              </select>

              <input
                type="text"
                placeholder={t("blog.tagsPlaceholder")}
                value={blogForm.tags}
                onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={blogForm.featured}
                  onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.checked })}
                />
                {t("blog.featured")}
              </label>

              <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={blogForm.isPublished}
                  onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                />
                {t("blog.published")}
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                {loading ? t("common.processing") : editingBlog ? t("common.update") : t("common.create")}
              </button>

              {editingBlog && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlog(null);
                    setBlogForm({
                      title: "",
                      content: "",
                      excerpt: "",
                      image: "",
                      featured: false,
                      category: "General",
                      tags: "",
                      isPublished: true,
                    });
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#666",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {t("common.cancel")}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Blog List */}
      <div>
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>{t("blog.blogList")}</h3>
        <div style={{ display: "grid", gap: "15px" }}>
          {blogs.map((blog) => (
            <div
              key={blog._id}
              style={{
                padding: "20px",
                border: "1px solid #374151",
                borderRadius: "8px",
                background: "#1f2937",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <h4 style={{ color: "#fff", margin: 0 }}>{blog.title}</h4>
                  {blog.featured && (
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "linear-gradient(135deg, #7dd3fc, #d946ef)",
                        color: "#fff",
                        fontSize: "12px",
                        borderRadius: "4px",
                        fontWeight: "600",
                      }}
                    >
                      {t("blog.featured")}
                    </span>
                  )}
                  {!blog.isPublished && (
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "#666",
                        color: "#fff",
                        fontSize: "12px",
                        borderRadius: "4px",
                      }}
                    >
                      {t("blog.notPublished")}
                    </span>
                  )}
                </div>
                <p style={{ color: "#9ca3af", margin: "5px 0", fontSize: "14px" }}>
                  {blog.excerpt || blog.content?.substring(0, 150) + "..."}
                </p>
                <div style={{ display: "flex", gap: "15px", marginTop: "10px", fontSize: "12px", color: "#6b7280", flexWrap: "wrap" }}>
                  <span>👤 {blog.authorName || blog.author?.username || "Unknown"}</span>
                  <span>{t("blog.category")}: {blog.category}</span>
                  <span>{t("blog.views")}: {blog.views || 0}</span>
                  <span>{t("blog.likes")}: {blog.likes?.length || 0}</span>
                  <span>{t("blog.comments")}: {blog.comments?.length || 0}</span>
                  {blog.status === "warning" && (
                    <span style={{ color: "#f59e0b", fontWeight: "600" }}>
                      ⚠️ Đã cảnh cáo
                    </span>
                  )}
                  {blog.violationReason && (
                    <span style={{ color: "#ef4444", fontSize: "11px" }}>
                      Lý do: {blog.violationReason}
                    </span>
                  )}
                  {isStaff && (
                    (() => {
                      const warningCount = blog.author?.blogWarningCount ?? 0;
                      const bgColor =
                        warningCount >= 3
                          ? "#ef4444"
                          : warningCount > 0
                          ? "#f59e0b"
                          : "#10b981";
                      return (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span>Cảnh báo (Vi phạm):</span>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              backgroundColor: bgColor,
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "12px",
                            }}
                          >
                            {warningCount}/3
                          </span>
                        </span>
                      );
                    })()
                  )}
                  {isStaff && blog.author?.isLocked && (
                    <span style={{ color: "#ef4444", fontWeight: "600" }}>
                      🔒 Đã khóa
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => openDetailModal(blog)}
                    style={{
                      padding: "8px 16px",
                      background: "#0ea5e9",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleEdit(blog)}
                    style={{
                      padding: "8px 16px",
                      background: "#111827",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    style={{
                      padding: "8px 16px",
                      background: "#c00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {t("common.delete")}
                  </button>
                </div>
                {isStaff && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button
                      onClick={() => setWarningModal({ open: true, blog, type: "warn" })}
                      style={{
                        padding: "6px 12px",
                        background: "#f59e0b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      ⚠️ Gửi nhắc nhở
                    </button>
                    <button
                      onClick={() => setWarningModal({ open: true, blog, type: "delete" })}
                      style={{
                        padding: "6px 12px",
                        background: "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      🗑️ Xóa + Cảnh cáo
                    </button>
                    {blog.author?.blogWarningCount >= 3 && !blog.author?.isLocked && (
                      <button
                        onClick={() => handleLockBrand(blog.author._id, blog.author.blogWarningCount)}
                        style={{
                          padding: "6px 12px",
                          background: "#991b1b",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        🔒 Khóa tài khoản
                </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning/Delete Modal for Staff */}
      {warningModal.open && isStaff && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setWarningModal({ open: false, blog: null, type: null });
            setViolationReason("");
            setStaffNotes("");
          }}
        >
          <div
            style={{
              background: "#1f2937",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
              border: "1px solid #374151",
            }}
            onClick={(e) => e.stopPropagation()}
          >
              <h3 style={{ color: "#fff", marginBottom: "16px" }}>
                {warningModal.type === "warn" ? "Gửi nhắc nhở vi phạm" : "🗑️ Xóa bài viết và cảnh cáo"}
              </h3>
            <p style={{ color: "#9ca3af", marginBottom: "16px", fontSize: "14px" }}>
              Bài đăng: <strong style={{ color: "#fff" }}>{warningModal.blog?.title}</strong>
            </p>
            <div style={{ marginBottom: "16px" }}>
              {warningModal.type === "warn" && (
                <p style={{ fontSize: "13px", color: "#d1d5db", marginBottom: "10px" }}>
                  Lưu ý: Mỗi lần nhắc nhở tính là 1 lần cảnh cáo. Vi phạm quá 3 lần tài khoản có thể bị khóa.
                </p>
              )}
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "500" }}>
                Lý do vi phạm <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={violationReason}
                onChange={(e) => setViolationReason(e.target.value)}
                placeholder="Nhập lý do vi phạm..."
                rows={3}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "500" }}>
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="Ghi chú nội bộ..."
                rows={2}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setWarningModal({ open: false, blog: null, type: null });
                  setViolationReason("");
                  setStaffNotes("");
                }}
                style={{
                  padding: "10px 20px",
                  background: "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                onClick={warningModal.type === "warn" ? handleWarnBlog : handleDeleteWithReason}
                style={{
                  padding: "10px 20px",
                  background: warningModal.type === "warn" ? "#f59e0b" : "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {warningModal.type === "warn" ? "Gửi nhắc nhở" : "Xóa và cảnh cáo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailBlog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeDetailModal}
        >
          <div
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "10px",
              width: "700px",
              maxWidth: "95%",
              maxHeight: "90vh",
              overflowY: "auto",
              color: "white",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ margin: 0 }}>{detailBlog.title}</h3>
              <button
                onClick={closeDetailModal}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                ×
              </button>
            </div>
            
            {detailBlog.image && (
              <img 
                src={detailBlog.image} 
                alt={detailBlog.title}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "16px"
                }}
              />
            )}

            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "10px" }}>
                👤 {detailBlog.authorName || detailBlog.author?.username || "Unknown"} · 
                📁 {detailBlog.category} · 
                👁️ {detailBlog.views || 0} lượt xem · 
                ❤️ {detailBlog.likes?.length || 0} thích · 
                💬 {detailBlog.comments?.length || 0} bình luận
              </p>
              {detailBlog.tags && detailBlog.tags.length > 0 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                  {detailBlog.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      style={{
                        padding: "4px 8px",
                        background: "#1f2937",
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: "#9ca3af"
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {detailBlog.excerpt && (
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ marginBottom: "8px" }}>Tóm tắt</h4>
                <p style={{ fontSize: "14px", color: "#d1d5db" }}>{detailBlog.excerpt}</p>
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ marginBottom: "8px" }}>Nội dung</h4>
              <div style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.6" }}>
                {detailBlog.content}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "12px", color: "#9ca3af" }}>
              {detailBlog.featured && (
                <span style={{ 
                  padding: "4px 8px", 
                  background: "linear-gradient(135deg, #7dd3fc, #d946ef)", 
                  borderRadius: "4px",
                  color: "#fff",
                  fontWeight: "600"
                }}>
                  ⭐ Nổi bật
                </span>
              )}
              {!detailBlog.isPublished && (
                <span style={{ padding: "4px 8px", background: "#666", borderRadius: "4px", color: "#fff" }}>
                  📝 Chưa xuất bản
                </span>
              )}
              {detailBlog.status === "warning" && (
                <span style={{ padding: "4px 8px", background: "#f59e0b", borderRadius: "4px", color: "#fff", fontWeight: "600" }}>
                  ⚠️ Đã cảnh cáo
                </span>
              )}
            </div>

            {detailBlog.violationReason && (
              <div style={{ marginTop: "16px", padding: "12px", background: "#7f1d1d", borderRadius: "8px", border: "1px solid #991b1b" }}>
                <h4 style={{ color: "#fca5a5", marginBottom: "8px" }}>⚠️ Lý do vi phạm</h4>
                <p style={{ fontSize: "14px", color: "#fecaca" }}>{detailBlog.violationReason}</p>
              </div>
            )}

            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "16px" }}>
              Ngày đăng: {detailBlog.createdAt ? new Date(detailBlog.createdAt).toLocaleString("vi-VN") : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

