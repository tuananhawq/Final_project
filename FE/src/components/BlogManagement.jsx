import { useState, useEffect } from "react";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../services/blogService.jsx";

export function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      showMessage("Lỗi khi tải blogs: " + error.message, "error");
    }
  };

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
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
        showMessage("Cập nhật Blog thành công!");
      } else {
        await createBlog(formData);
        showMessage("Tạo Blog thành công!");
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
      showMessage("Lỗi: " + error.message, "error");
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
    if (!window.confirm("Bạn có chắc muốn xóa Blog này?")) return;
    try {
      await deleteBlog(id);
      showMessage("Xóa Blog thành công!");
      loadBlogs();
    } catch (error) {
      showMessage("Lỗi: " + error.message, "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Quản lý Blog & News</h2>

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: message.includes("Lỗi") ? "#fee" : "#efe",
            color: message.includes("Lỗi") ? "#c00" : "#0c0",
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

      {/* Form */}
      <div style={{ marginBottom: "30px", padding: "20px", background: "#1f2937", borderRadius: "8px" }}>
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>
          {editingBlog ? "Chỉnh sửa Blog" : "Thêm Blog mới"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "15px", maxWidth: "800px" }}>
            <input
              type="text"
              placeholder="Tiêu đề bài viết"
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
              Hình ảnh <span style={{ color: "#c00" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập URL hình ảnh"
              value={blogForm.image}
              onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
              required
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #374151",
                background: "#111827",
                color: "#fff",
                width: "100%",
              }}
            />

            <textarea
              placeholder="Mô tả ngắn (excerpt)"
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
              placeholder="Nội dung bài viết (HTML hoặc text)"
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
                placeholder="Tags (phân cách bằng dấu phẩy)"
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
                Bài viết nổi bật
              </label>

              <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={blogForm.isPublished}
                  onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                />
                Xuất bản
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
                {loading ? "Đang xử lý..." : editingBlog ? "Cập nhật" : "Tạo mới"}
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
                  Hủy
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Blog List */}
      <div>
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>Danh sách Blogs</h3>
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
                      Nổi bật
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
                      Chưa xuất bản
                    </span>
                  )}
                </div>
                <p style={{ color: "#9ca3af", margin: "5px 0", fontSize: "14px" }}>
                  {blog.excerpt || blog.content?.substring(0, 150) + "..."}
                </p>
                <div style={{ display: "flex", gap: "15px", marginTop: "10px", fontSize: "12px", color: "#6b7280" }}>
                  <span>Category: {blog.category}</span>
                  <span>Views: {blog.views || 0}</span>
                  <span>Likes: {blog.likes?.length || 0}</span>
                  <span>Comments: {blog.comments?.length || 0}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
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
                  Sửa
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
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

