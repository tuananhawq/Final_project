import { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext.jsx";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../services/staffService.jsx";

export function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
  });
  const [staffForm, setStaffForm] = useState({
    email: "",
    username: "",
    password: "",
    bio: "",
    avatar: "",
    isActive: true,
    isVerified: true,
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { confirm } = useNotification();

  useEffect(() => {
    loadStaff();
  }, [pagination.page, filters]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await getAllStaff({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
      });
      setStaff(data.staff || []);
      setPagination({
        ...pagination,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0,
      });
    } catch (error) {
      showMessage("Lỗi khi tải staff: " + (error.response?.data?.error || error.message), "error");
    } finally {
      setLoading(false);
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
        ...staffForm,
      };

      // Nếu đang sửa và không có password mới, không gửi password
      if (editingStaff && !formData.password) {
        delete formData.password;
      }

      if (editingStaff) {
        await updateStaff(editingStaff._id, formData);
        showMessage("Cập nhật staff thành công!");
      } else {
        await createStaff(formData);
        showMessage("Tạo staff thành công!");
      }

      resetForm();
      loadStaff();
    } catch (error) {
      showMessage("Lỗi: " + (error.response?.data?.error || error.message), "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStaffForm({
      email: "",
      username: "",
      password: "",
      bio: "",
      avatar: "",
      isActive: true,
      isVerified: true,
    });
    setEditingStaff(null);
    setShowPassword(false);
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setStaffForm({
      email: staffMember.email || "",
      username: staffMember.username || "",
      password: "",
      bio: staffMember.bio || "",
      avatar: staffMember.avatar || "",
      isActive: staffMember.isActive !== undefined ? staffMember.isActive : true,
      isVerified: staffMember.isVerified !== undefined ? staffMember.isVerified : true,
    });
    setShowPassword(false);
  };

  const handleDelete = async (id) => {
    const ok = await confirm("Bạn có chắc muốn xóa staff này?");
    if (!ok) return;
    try {
      await deleteStaff(id);
      showMessage("Xóa staff thành công!");
      loadStaff();
    } catch (error) {
      showMessage("Lỗi: " + (error.response?.data?.error || error.message), "error");
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, page: 1 }); // Reset về trang 1 khi filter
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#fff" }}>Quản lý Staff</h2>

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

      {/* Filters */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "#1f2937",
          borderRadius: "8px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Tìm kiếm theo email hoặc username..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #374151",
            background: "#111827",
            color: "#fff",
            flex: 1,
            minWidth: "200px",
          }}
        />
      </div>

      {/* Form */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          background: "#1f2937",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>
          {editingStaff ? "Chỉnh sửa Staff" : "Thêm Staff mới"}
        </h3>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{ display: "grid", gap: "15px", maxWidth: "800px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input
                type="email"
                placeholder="Email *"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                autoComplete="off"
                required
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                }}
              />
              <input
                type="text"
                placeholder="Username"
                value={staffForm.username}
                onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                autoComplete="off"
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                }}
              />
            </div>

            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={editingStaff ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
                value={staffForm.password}
                onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                autoComplete="new-password"
                required={!editingStaff}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                  width: "100%",
                }}
              />
              {editingStaff && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    marginTop: "5px",
                    padding: "5px 10px",
                    background: "#374151",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {showPassword ? "Ẩn" : "Hiện"} mật khẩu
                </button>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input
                type="text"
                placeholder="Avatar URL"
                value={staffForm.avatar}
                onChange={(e) => setStaffForm({ ...staffForm, avatar: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                }}
              />
            </div>

            <textarea
              placeholder="Bio"
              value={staffForm.bio}
              onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })}
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

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={staffForm.isActive}
                  onChange={(e) => setStaffForm({ ...staffForm, isActive: e.target.checked })}
                />
                Đang hoạt động
              </label>
              <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={staffForm.isVerified}
                  onChange={(e) => setStaffForm({ ...staffForm, isVerified: e.target.checked })}
                />
                Đã xác thực
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
                {loading ? "Đang xử lý..." : editingStaff ? "Cập nhật" : "Tạo mới"}
              </button>

              {editingStaff && (
                <button
                  type="button"
                  onClick={resetForm}
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

      {/* Staff List */}
      <div>
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>
          Danh sách Staff ({pagination.total})
        </h3>
        {loading && <p style={{ color: "#fff" }}>Đang tải...</p>}
        <div style={{ display: "grid", gap: "15px" }}>
          {staff.map((staffMember) => (
            <div
              key={staffMember._id}
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
                  <h4 style={{ color: "#fff", margin: 0 }}>{staffMember.email}</h4>
                  <span
                    style={{
                      padding: "4px 8px",
                      background: "#7dd3fc",
                      color: "#fff",
                      fontSize: "12px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    staff
                  </span>
                </div>
                {staffMember.username && (
                  <p style={{ color: "#9ca3af", margin: "5px 0", fontSize: "14px" }}>
                    Username: {staffMember.username}
                  </p>
                )}
                {staffMember.bio && (
                  <p style={{ color: "#9ca3af", margin: "5px 0", fontSize: "14px" }}>
                    {staffMember.bio}
                  </p>
                )}
                <div style={{ display: "flex", gap: "15px", marginTop: "10px", fontSize: "12px", color: "#6b7280" }}>
                  <span>Status: {staffMember.isActive ? "✅ Hoạt động" : "❌ Không hoạt động"}</span>
                  <span>Verified: {staffMember.isVerified ? "✅" : "❌"}</span>
                  <span>Created: {new Date(staffMember.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleEdit(staffMember)}
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
                  onClick={() => handleDelete(staffMember._id)}
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              style={{
                padding: "8px 16px",
                background: pagination.page === 1 ? "#374151" : "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: pagination.page === 1 ? "not-allowed" : "pointer",
              }}
            >
              Trước
            </button>
            <span style={{ color: "#fff" }}>
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
              style={{
                padding: "8px 16px",
                background: pagination.page >= pagination.totalPages ? "#374151" : "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: pagination.page >= pagination.totalPages ? "not-allowed" : "pointer",
              }}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
