import { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService.jsx";

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    role: "",
    search: "",
  });
  const [userForm, setUserForm] = useState({
    email: "",
    username: "",
    password: "",
    roles: ["user"],
    bio: "",
    avatar: "",
    premiumStatus: "free",
    isActive: true,
    isVerified: false,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [pagination.page, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: filters.role || undefined,
        search: filters.search || undefined,
      });
      setUsers(data.users || []);
      setPagination({
        ...pagination,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0,
      });
    } catch (error) {
      showMessage("Lỗi khi tải users: " + (error.response?.data?.error || error.message), "error");
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
        ...userForm,
        roles: Array.isArray(userForm.roles) ? userForm.roles : [userForm.roles],
      };

      // Nếu đang sửa và không có password mới, không gửi password
      if (editingUser && !formData.password) {
        delete formData.password;
      }

      if (editingUser) {
        await updateUser(editingUser._id, formData);
        showMessage("Cập nhật user thành công!");
      } else {
        await createUser(formData);
        showMessage("Tạo user thành công!");
      }

      resetForm();
      loadUsers();
    } catch (error) {
      showMessage("Lỗi: " + (error.response?.data?.error || error.message), "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUserForm({
      email: "",
      username: "",
      password: "",
      roles: ["user"],
      bio: "",
      avatar: "",
      premiumStatus: "free",
      isActive: true,
      isVerified: false,
    });
    setEditingUser(null);
    setShowPassword(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUserForm({
      email: user.email || "",
      username: user.username || "",
      password: "",
      roles: Array.isArray(user.roles) ? user.roles : [user.roles || "user"],
      bio: user.bio || "",
      avatar: user.avatar || "",
      premiumStatus: user.premiumStatus || "free",
      isActive: user.isActive !== undefined ? user.isActive : true,
      isVerified: user.isVerified !== undefined ? user.isVerified : false,
    });
    setShowPassword(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      await deleteUser(id);
      showMessage("Xóa user thành công!");
      loadUsers();
    } catch (error) {
      showMessage("Lỗi: " + (error.response?.data?.error || error.message), "error");
    }
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setUserForm({
      ...userForm,
      roles: [value],
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, page: 1 }); // Reset về trang 1 khi filter
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#fff" }}>Quản lý Tài khoản</h2>

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
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #374151",
            background: "#111827",
            color: "#fff",
            minWidth: "150px",
          }}
        >
          <option value="">Tất cả roles</option>
          <option value="user">User</option>
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
        </select>
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
          {editingUser ? "Chỉnh sửa User" : "Thêm User mới"}
        </h3>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{ display: "grid", gap: "15px", maxWidth: "800px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input
                type="email"
                placeholder="Email *"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
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
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={editingUser ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  autoComplete="new-password"
                  required={!editingUser}
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #374151",
                    background: "#111827",
                    color: "#fff",
                    width: "100%",
                  }}
                />
                {editingUser && (
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
              <select
                value={userForm.roles[0] || "user"}
                onChange={handleRoleChange}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                }}
              >
                <option value="user">User</option>
                <option value="creator">Creator</option>
                <option value="brand">Brand</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input
                type="text"
                placeholder="Avatar URL"
                value={userForm.avatar}
                onChange={(e) => setUserForm({ ...userForm, avatar: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                }}
              />
              <select
                value={userForm.premiumStatus}
                onChange={(e) => setUserForm({ ...userForm, premiumStatus: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#fff",
                }}
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <textarea
              placeholder="Bio"
              value={userForm.bio}
              onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
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
                  checked={userForm.isActive}
                  onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                />
                Đang hoạt động
              </label>
              <label style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={userForm.isVerified}
                  onChange={(e) => setUserForm({ ...userForm, isVerified: e.target.checked })}
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
                {loading ? "Đang xử lý..." : editingUser ? "Cập nhật" : "Tạo mới"}
              </button>

              {editingUser && (
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

      {/* User List */}
      <div>
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>
          Danh sách Users ({pagination.total})
        </h3>
        {loading && <p style={{ color: "#fff" }}>Đang tải...</p>}
        <div style={{ display: "grid", gap: "15px" }}>
          {users.map((user) => (
            <div
              key={user._id}
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
                  <h4 style={{ color: "#fff", margin: 0 }}>{user.email}</h4>
                  {user.roles?.map((role) => (
                    <span
                      key={role}
                      style={{
                        padding: "4px 8px",
                        background: role === "creator" ? "#7dd3fc" : role === "brand" ? "#d946ef" : "#6b7280",
                        color: "#fff",
                        fontSize: "12px",
                        borderRadius: "4px",
                        fontWeight: "600",
                      }}
                    >
                      {role}
                    </span>
                  ))}
                  {user.premiumStatus === "premium" && (
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                        color: "#fff",
                        fontSize: "12px",
                        borderRadius: "4px",
                        fontWeight: "600",
                      }}
                    >
                      Premium
                    </span>
                  )}
                </div>
                {user.username && (
                  <p style={{ color: "#9ca3af", margin: "5px 0", fontSize: "14px" }}>
                    Username: {user.username}
                  </p>
                )}
                {user.bio && (
                  <p style={{ color: "#9ca3af", margin: "5px 0", fontSize: "14px" }}>
                    {user.bio}
                  </p>
                )}
                <div style={{ display: "flex", gap: "15px", marginTop: "10px", fontSize: "12px", color: "#6b7280" }}>
                  <span>Status: {user.isActive ? "✅ Hoạt động" : "❌ Không hoạt động"}</span>
                  <span>Verified: {user.isVerified ? "✅" : "❌"}</span>
                  <span>Created: {new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleEdit(user)}
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
                  onClick={() => handleDelete(user._id)}
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

