import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../services/blogService.jsx";
import { uploadBlogImage } from "../services/uploadService.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import "../styles/my-blogs.css";

export default function MyBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
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

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { notifySuccess, notifyError, confirm } = useNotification();
    const { t } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const roles = decoded.roles || [];
            // Allow creator, brand to access this page
            if (!roles.some(r => ["creator", "brand"].includes(r))) {
                navigate("/home");
                return;
            }
        } catch {
            navigate("/login");
            return;
        }

        loadBlogs();

        // Auto open form if create=true query param exists
        if (searchParams.get("create") === "true") {
            setShowForm(true);
            // Clear the query param
            setSearchParams({});
        }
    }, [navigate, searchParams, setSearchParams]);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const data = await getAllBlogs();
            setBlogs(data);
        } catch (error) {
            notifyError(t("myBlogs.loadError") + ": " + error.message);
        } finally {
            setLoading(false);
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
                t("blog.uploadError") +
                ": " +
                (error.response?.data?.message || error.message)
            );
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
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

            resetForm();
            loadBlogs();
        } catch (error) {
            notifyError(t("common.error") + ": " + error.message);
        } finally {
            setSubmitting(false);
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
        setShowForm(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
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
        setShowForm(false);
    };

    const handleDelete = async (blog) => {
        const ok = await confirm(t("blog.deleteConfirm"));
        if (!ok) return;

        try {
            await deleteBlog(blog._id);
            notifySuccess(t("blog.deleteSuccess"));
            loadBlogs();
        } catch (error) {
            notifyError(t("common.error") + ": " + error.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <Header />
            <div className="my-blogs-page">
                <div className="my-blogs-container">
                    {/* Page Header */}
                    <div className="my-blogs-header">
                        <div className="my-blogs-title-section">
                            <h1 className="my-blogs-title">{t("myBlogs.title")}</h1>
                            <p className="my-blogs-subtitle">{t("myBlogs.subtitle")}</p>
                        </div>
                        <button
                            className="my-blogs-add-btn"
                            onClick={() => {
                                resetForm();
                                setShowForm(!showForm);
                            }}
                        >
                            {showForm ? t("common.cancel") : t("myBlogs.createNew")}
                        </button>
                    </div>

                    {/* Blog Form */}
                    {showForm && (
                        <div className="my-blogs-form-container">
                            <h2 className="my-blogs-form-title">
                                {editingBlog ? t("blog.editBlog") : t("blog.addNew")}
                            </h2>
                            <form onSubmit={handleSubmit} className="my-blogs-form">
                                <div className="form-group">
                                    <label>{t("myBlogs.blogTitle")} <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        placeholder={t("blog.titlePlaceholder")}
                                        value={blogForm.title}
                                        onChange={(e) =>
                                            setBlogForm({ ...blogForm, title: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{t("blog.imageLabel")} <span className="required">*</span></label>
                                    <div className="image-input-group">
                                        <input
                                            type="text"
                                            placeholder={t("blog.imagePlaceholder")}
                                            value={blogForm.image}
                                            onChange={(e) =>
                                                setBlogForm({ ...blogForm, image: e.target.value })
                                            }
                                            required
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) handleImageUpload(file);
                                            }}
                                            style={{ display: "none" }}
                                            id="blog-image-upload"
                                        />
                                        <label htmlFor="blog-image-upload" className="upload-btn">
                                            {uploading ? t("common.uploading") : `📤 ${t("common.upload")}`}
                                        </label>
                                    </div>
                                    {blogForm.image && (
                                        <div className="image-preview">
                                            <img src={blogForm.image} alt="Preview" />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>{t("myBlogs.excerpt")}</label>
                                    <textarea
                                        placeholder={t("blog.excerptPlaceholder")}
                                        value={blogForm.excerpt}
                                        onChange={(e) =>
                                            setBlogForm({ ...blogForm, excerpt: e.target.value })
                                        }
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{t("myBlogs.content")} <span className="required">*</span></label>
                                    <textarea
                                        placeholder={t("blog.contentPlaceholder")}
                                        value={blogForm.content}
                                        onChange={(e) =>
                                            setBlogForm({ ...blogForm, content: e.target.value })
                                        }
                                        required
                                        rows={10}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t("blog.category")}</label>
                                        <select
                                            value={blogForm.category}
                                            onChange={(e) =>
                                                setBlogForm({ ...blogForm, category: e.target.value })
                                            }
                                        >
                                            <option value="General">General</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Business">Business</option>
                                            <option value="Lifestyle">Lifestyle</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="News">News</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>{t("myBlogs.tags")}</label>
                                        <input
                                            type="text"
                                            placeholder={t("blog.tagsPlaceholder")}
                                            value={blogForm.tags}
                                            onChange={(e) =>
                                                setBlogForm({ ...blogForm, tags: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="form-checkboxes">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={blogForm.isPublished}
                                            onChange={(e) =>
                                                setBlogForm({ ...blogForm, isPublished: e.target.checked })
                                            }
                                        />
                                        {t("blog.published")}
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? t("common.processing")
                                            : editingBlog
                                                ? t("common.update")
                                                : t("common.create")}
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={resetForm}
                                    >
                                        {t("common.cancel")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Blog List */}
                    <div className="my-blogs-list-section">
                        <h2 className="my-blogs-list-title">{t("myBlogs.yourPosts")}</h2>

                        {loading ? (
                            <div className="my-blogs-loading">
                                <div className="loading-spinner"></div>
                                <p>{t("common.loading")}</p>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="my-blogs-empty">
                                <div className="empty-icon">📝</div>
                                <h3>{t("myBlogs.noPosts")}</h3>
                                <p>{t("myBlogs.noPostsDesc")}</p>
                                <button
                                    className="create-first-btn"
                                    onClick={() => setShowForm(true)}
                                >
                                    {t("myBlogs.createFirst")}
                                </button>
                            </div>
                        ) : (
                            <div className="my-blogs-grid">
                                {blogs.map((blog) => (
                                    <div key={blog._id} className="my-blog-card">
                                        <div className="blog-card-image">
                                            <img src={blog.image} alt={blog.title} />
                                            <div className="blog-card-badges">
                                                {!blog.isPublished && (
                                                    <span className="badge draft">{t("myBlogs.draft")}</span>
                                                )}
                                                {blog.featured && (
                                                    <span className="badge featured">{t("blog.featured")}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="blog-card-content">
                                            <div className="blog-card-category">{blog.category}</div>
                                            <h3 className="blog-card-title">{blog.title}</h3>
                                            <p className="blog-card-excerpt">
                                                {blog.excerpt || blog.content?.substring(0, 120) + "..."}
                                            </p>
                                            <div className="blog-card-meta">
                                                <span className="meta-date">{formatDate(blog.createdAt)}</span>
                                                <div className="meta-stats">
                                                    <span>👁 {blog.views || 0}</span>
                                                    <span>❤️ {blog.likes?.length || 0}</span>
                                                    <span>💬 {blog.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                            <div className="blog-card-actions">
                                                <button
                                                    className="action-btn view"
                                                    onClick={() => navigate(`/blog/${blog._id}`)}
                                                >
                                                    {t("common.view")}
                                                </button>
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEdit(blog)}
                                                >
                                                    {t("common.edit")}
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(blog)}
                                                >
                                                    {t("common.delete")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
