import { useState, useEffect } from "react";
import axios from "axios";
import {
    adminGetJobPosts,
    adminWarnBrandPost,
    adminDeleteJobPost,
} from "../services/adminJobPostService.jsx";
import { API_URLS } from "../config/api.js";
import { useNotification } from "../context/NotificationContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export function AdminJobPostManagement() {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [warnModal, setWarnModal] = useState(null); // { postId, brandName }
    const [warnReason, setWarnReason] = useState("");
    const [detailPost, setDetailPost] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const { notifySuccess, notifyError, confirm } = useNotification();
    const { t } = useLanguage();

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async (page = 1) => {
        try {
            setLoading(true);
            const data = await adminGetJobPosts(page);
            setPosts(data.posts);
            setPagination(data.pagination);
        } catch (error) {
            notifyError("Failed to load posts: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        const ok = await confirm("Bạn có chắc chắn muốn xóa bài đăng này? Hành động không thể hoàn tác.");
        if (!ok) return;

        try {
            await adminDeleteJobPost(postId);
            notifySuccess("Đã xóa bài đăng thành công.");
            loadPosts(pagination.currentPage);
        } catch (error) {
            notifyError("Lỗi xóa bài đăng: " + error.message);
        }
    };

    const openWarnModal = (post) => {
        setWarnModal({
            postId: post._id,
            brandName: post.brandName || post.brand?.companyName || "Unknown",
        });
        setWarnReason("");
    };

    const handleWarnSubmit = async () => {
        if (!warnReason.trim()) {
            notifyError("Vui lòng nhập lý do cảnh báo.");
            return;
        }

        try {
            const res = await adminWarnBrandPost(warnModal.postId, warnReason.trim());
            notifySuccess(res.message);
            setWarnModal(null);
            loadPosts(pagination.currentPage); // Reload to update warnings count? Actually warnings count is on Brand.
        } catch (error) {
            notifyError("Lỗi gửi cảnh báo: " + error.message);
        }
    };

    const openDetailModal = async (postId) => {
        try {
            setDetailLoading(true);
            setDetailPost(null);
            const res = await axios.get(`${API_URLS.JOB_POST}/job-posts/${postId}`);
            setDetailPost(res.data.post);
        } catch (error) {
            notifyError("Không tải được chi tiết bài đăng: " + error.message);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetailModal = () => {
        setDetailPost(null);
        setDetailLoading(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "20px" }}>Quản lý Bài đăng (Brand Job Posts)</h2>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #374151", textAlign: "left" }}>
                                <th style={{ padding: "10px" }}>Brand</th>
                                <th style={{ padding: "10px" }}>Tiêu đề</th>
                                <th style={{ padding: "10px" }}>Loại</th>
                                <th style={{ padding: "10px" }}>Ngày đăng</th>
                                <th style={{ padding: "10px" }}>Cảnh báo (Vi phạm)</th>
                                <th style={{ padding: "10px" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => {
                                const brand = post.brand || {};
                                const warnings = brand.warnings || 0;
                                const isLocked = brand.isActive === false; // Check if locked

                                return (
                                    <tr key={post._id} style={{ borderBottom: "1px solid #1f2937" }}>
                                        <td style={{ padding: "10px" }}>
                                            <div>{brand.companyName || post.brandName}</div>
                                            <div style={{ fontSize: "12px", color: isLocked ? "red" : "#9ca3af" }}>
                                                {isLocked ? "(Đã bị khoá)" : ""}
                                            </div>
                                        </td>
                                        <td style={{ padding: "10px" }}>
                                            <div style={{ fontWeight: "bold" }}>{post.title}</div>
                                            <div style={{ fontSize: "12px", color: "#9ca3af", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {post.content}
                                            </div>
                                        </td>
                                        <td style={{ padding: "10px" }}>{post.jobType}</td>
                                        <td style={{ padding: "10px" }}>
                                            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td style={{ padding: "10px" }}>
                                            <span
                                                style={{
                                                    padding: "2px 8px",
                                                    borderRadius: "4px",
                                                    backgroundColor: warnings > 0 ? (warnings >= 3 ? "#ef4444" : "#f59e0b") : "#10b981",
                                                    color: "white",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {warnings}/3
                                            </span>
                                        </td>
                                        <td style={{ padding: "10px" }}>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => openDetailModal(post._id)}
                                                    title="Xem chi tiết bài đăng"
                                                    style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#0ea5e9",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        color: "white",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    onClick={() => openWarnModal(post)}
                                                    disabled={isLocked}
                                                    title="Gửi nhắc nhở/Cảnh báo"
                                                    style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#eab308",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        color: "white",
                                                        cursor: isLocked ? "not-allowed" : "pointer",
                                                        opacity: isLocked ? 0.5 : 1
                                                    }}
                                                >
                                                    ⚠️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    title="Xóa bài đăng"
                                                    style={{
                                                        padding: "6px 12px",
                                                        backgroundColor: "#ef4444",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        color: "white",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {posts.length === 0 && (
                        <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>
                            Không có bài đăng nào.
                        </div>
                    )}

                    {/* Pagination */}
                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() => loadPosts(pagination.currentPage - 1)}
                            style={{ padding: "5px 10px", cursor: "pointer" }}
                        >
                            Prev
                        </button>
                        <span style={{ color: "white", padding: "5px" }}>
                            {pagination.currentPage} / {pagination.totalPages || 1}
                        </span>
                        <button
                            disabled={pagination.currentPage >= (pagination.totalPages || 1)}
                            onClick={() => loadPosts(pagination.currentPage + 1)}
                            style={{ padding: "5px 10px", cursor: "pointer" }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Warn Modal */}
            {warnModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setWarnModal(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#1f2937",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "500px",
                            maxWidth: "90%",
                            color: "white",
                        }}
                    >
                        <h3>Gửi nhắc nhở vi phạm</h3>
                        <p>Brand: <strong>{warnModal.brandName}</strong></p>
                        <p style={{ fontSize: "13px", color: "#d1d5db", margin: "10px 0" }}>
                            Lưu ý: Mỗi lần nhắc nhở tính là 1 lần cảnh cáo. Vi phạm quá 3 lần tài khoản sẽ bị khoá.
                        </p>

                        <textarea
                            rows={4}
                            placeholder="Nhập lý do vi phạm (ví dụ: Nội dung không phù hợp, Spam...)"
                            value={warnReason}
                            onChange={(e) => setWarnReason(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                margin: "10px 0",
                                borderRadius: "4px",
                                backgroundColor: "#111827",
                                border: "1px solid #374151",
                                color: "white",
                            }}
                        />

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                onClick={() => setWarnModal(null)}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                    border: "none",
                                    backgroundColor: "#4b5563",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleWarnSubmit}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                    border: "none",
                                    backgroundColor: "#eab308",
                                    color: "white",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                Gửi nhắc nhở
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {(detailLoading || detailPost) && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={closeDetailModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#111827",
                            padding: "20px",
                            borderRadius: "10px",
                            width: "700px",
                            maxWidth: "95%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            color: "white",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        }}
                    >
                        {detailLoading || !detailPost ? (
                            <p>Đang tải chi tiết bài đăng...</p>
                        ) : (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <h3 style={{ margin: 0 }}>{detailPost.title}</h3>
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
                                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "10px" }}>
                                    {detailPost.brandName} · {detailPost.jobType} · {detailPost.workTime}
                                </p>
                                <p style={{ fontWeight: "600", marginBottom: "16px" }}>
                                    Ngân sách: {detailPost.budget}
                                </p>
                                <div style={{ marginBottom: "16px" }}>
                                    <h4>Nội dung</h4>
                                    <p style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>{detailPost.content}</p>
                                </div>
                                <div style={{ marginBottom: "16px" }}>
                                    <h4>Yêu cầu</h4>
                                    <p style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>{detailPost.requirements}</p>
                                </div>
                                <div style={{ marginBottom: "16px" }}>
                                    <h4>Quyền lợi</h4>
                                    <p style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>{detailPost.benefits}</p>
                                </div>
                                <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                                    Ngày đăng:{" "}
                                    {detailPost.createdAt
                                        ? new Date(detailPost.createdAt).toLocaleString("vi-VN")
                                        : ""}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
