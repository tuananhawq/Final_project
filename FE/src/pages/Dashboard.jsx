import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HomeManagement } from "../components/HomeManagement.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [staffName, setStaffName] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const roles = decoded.roles || [];

      // Chỉ cho phép role "staff" vào trang Dashboard
      if (!roles.includes("staff")) {
        navigate("/home");
        return;
      }

      // Lấy thông tin user từ localStorage nếu có
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setStaffName(user.name || user.fullName || user.email || "Staff");
      } else {
        setStaffName("Staff");
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">MyDashboard</div>
          <nav>
            <div
              className={`nav-item ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveMenu("dashboard")}
              style={{ cursor: "pointer" }}
            >
              Dashboard
            </div>
            <div
              className={`nav-item ${activeMenu === "home-management" ? "active" : ""}`}
              onClick={() => setActiveMenu("home-management")}
              style={{ cursor: "pointer" }}
            >
              Quản lý Home
            </div>
            <div className="nav-item">Users</div>
            <div className="nav-item">Reports</div>
            <div className="nav-item">Settings</div>
          </nav>
          <div className="sidebar-footer">© 2025 Company</div>
        </aside>

        {/* MAIN */}
        <div className="dashboard-main">
          {/* HEADER */}
          <header className="dashboard-header">
            <div className="header-left">
              <div className="header-title">Dashboard tổng quan</div>
              <div className="header-subtitle">
                Tổng hợp số liệu trong ngày hôm nay
              </div>
            </div>
            <div className="header-right">
              <div className="staff-info">
                <span className="staff-name">{staffName}</span>
                <span className="staff-role">Staff</span>
              </div>
              <button className="header-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
              <div className="avatar" />
            </div>
          </header>

          {/* CONTENT */}
          <main className="dashboard-content">
            {activeMenu === "home-management" ? (
              <HomeManagement />
            ) : (
              <>
                {/* STATS */}
                <section className="stats-grid">
              <div className="card">
                <div className="card-label">Doanh thu hôm nay</div>
                <div className="card-value">12.5M đ</div>
                <div className="card-trend">+8.2% so với hôm qua</div>
              </div>
              <div className="card">
                <div className="card-label">Đơn hàng mới</div>
                <div className="card-value">128</div>
                <div className="card-trend">+3.1% so với tuần trước</div>
              </div>
              <div className="card">
                <div className="card-label">Khách hàng mới</div>
                <div className="card-value">42</div>
                <div className="card-trend">+12.0% trong 7 ngày</div>
              </div>
              <div className="card">
                <div className="card-label">Tỷ lệ huỷ</div>
                <div className="card-value">2.4%</div>
                <div className="card-trend negative">
                  -0.6% so với tháng trước
                </div>
              </div>
            </section>

            {/* CHART + TABLE */}
            <section className="grid-2">
              <div className="chart-placeholder">
                <div className="chart-title">Biểu đồ doanh thu</div>
                <div className="chart-subtitle">
                  Doanh thu 7 ngày gần nhất (demo)
                </div>
                <div className="chart-box">
                  Biểu đồ sẽ hiển thị ở đây (có thể dùng Chart.js hoặc
                  thư viện khác)
                </div>
              </div>

              <div className="table-card">
                <h3>Đơn hàng gần đây</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Ngày</th>
                      <th>Giá trị</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#ORD-00125</td>
                      <td>Nguyễn Văn A</td>
                      <td>23/12/2025</td>
                      <td>1.200.000 đ</td>
                      <td>
                        <span className="status-pill status-success">
                          Hoàn thành
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>#ORD-00126</td>
                      <td>Trần Thị B</td>
                      <td>23/12/2025</td>
                      <td>850.000 đ</td>
                      <td>
                        <span className="status-pill status-pending">
                          Đang xử lý
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>#ORD-00127</td>
                      <td>Lê Văn C</td>
                      <td>23/12/2025</td>
                      <td>2.100.000 đ</td>
                      <td>
                        <span className="status-pill status-cancel">
                          Đã huỷ
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


