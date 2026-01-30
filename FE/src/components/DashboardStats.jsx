import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  getDashboardStats,
  getRevenueChart,
  getRecentTransactions,
  getOverviewStats,
} from "../services/dashboardService";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard-stats.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState("week"); // week | month | quarter | year
  const { notifyError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
    // Refresh mỗi 30 giây
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch lại biểu đồ khi thay đổi period
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const chartDataResult = await getRevenueChart(revenuePeriod);
        setChartData(chartDataResult);
      } catch (error) {
        console.error("Error fetching revenue chart:", error);
      }
    };
    fetchChartData();
  }, [revenuePeriod]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsData, chartDataResult, transactionsData, overviewData] =
        await Promise.all([
          getDashboardStats(),
          getRevenueChart(revenuePeriod),
          getRecentTransactions(),
          getOverviewStats(),
        ]);

      setStats(statsData);
      setChartData(chartDataResult);
      setRecentTransactions(transactionsData.transactions || []);
      setOverview(overviewData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      notifyError("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "Chờ duyệt", class: "status-pending" },
      completed: { text: "Hoàn thành", class: "status-success" },
      cancelled: { text: "Đã hủy", class: "status-cancel" },
    };
    return badges[status] || badges.pending;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            return formatCurrency(context.parsed.y);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          callback: function (value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + "M";
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + "k";
            }
            return value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
        },
      },
    },
  };

  const chartDataConfig = chartData
    ? {
      labels: chartData.labels,
      datasets: [
        {
          label: "Doanh thu",
          data: chartData.data,
          borderColor: "rgb(125, 211, 252)",
          backgroundColor: "rgba(125, 211, 252, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgb(125, 211, 252)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    }
    : null;

  if (loading) {
    return (
      <div className="dashboard-stats-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="card revenue-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Doanh thu hôm nay</div>
            <div className="card-value">
              {stats ? formatCurrency(stats.revenue.today) : "0 đ"}
            </div>
            <div
              className={`card-trend ${stats?.revenue.change >= 0 ? "positive" : "negative"
                }`}
            >
              {stats?.revenue.change >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(stats?.revenue.change || 0).toFixed(1)}% so với hôm qua
            </div>
          </div>
        </div>

        <div className="card orders-card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <div className="card-label">Đơn hàng mới</div>
            <div className="card-value">{stats?.orders.new || 0}</div>
            <div
              className={`card-trend ${stats?.orders.change >= 0 ? "positive" : "negative"
                }`}
            >
              {stats?.orders.change >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(stats?.orders.change || 0).toFixed(1)}% so với tuần trước
            </div>
          </div>
        </div>

        <div className="card customers-card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <div className="card-label">Khách hàng mới</div>
            <div className="card-value">{stats?.customers.new || 0}</div>
            <div
              className={`card-trend ${stats?.customers.change >= 0 ? "positive" : "negative"
                }`}
            >
              {stats?.customers.change >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(stats?.customers.change || 0).toFixed(1)}% trong 7 ngày
            </div>
          </div>
        </div>

        <div className="card cancel-card">
          <div className="card-icon">❌</div>
          <div className="card-content">
            <div className="card-label">Tỷ lệ hủy</div>
            <div className="card-value">
              {(stats?.cancelRate.rate || 0).toFixed(1)}%
            </div>
            <div
              className={`card-trend ${stats?.cancelRate.change <= 0 ? "positive" : "negative"
                }`}
            >
              {stats?.cancelRate.change <= 0 ? "↓" : "↑"}{" "}
              {Math.abs(stats?.cancelRate.change || 0).toFixed(1)}% so với tháng trước
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      {overview && overview.pendingTransactions > 0 && (
        <section className="quick-actions">
          <div className="quick-action-card">
            <div className="quick-action-icon">⚡</div>
            <div className="quick-action-content">
              <h3>Có {overview.pendingTransactions} đơn hàng chờ duyệt</h3>
              <p>Kiểm tra và duyệt các giao dịch đang chờ xử lý</p>
              <button
                className="quick-action-btn"
                onClick={() => navigate("/admin?tab=transaction-management")}
              >
                Xem ngay →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Chart + Table */}
      <section className="grid-2">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Biểu đồ doanh thu</div>
              <div className="chart-subtitle">
                {revenuePeriod === "week" && "Doanh thu 7 ngày gần nhất"}
                {revenuePeriod === "month" && "Doanh thu theo tháng"}
                {revenuePeriod === "quarter" && "Doanh thu theo quý"}
                {revenuePeriod === "year" && "Doanh thu theo năm"}
              </div>
            </div>
            <div className="chart-period-filter">
              <button
                className={`period-btn ${revenuePeriod === "week" ? "active" : ""}`}
                onClick={() => setRevenuePeriod("week")}
              >
                7 Ngày
              </button>
              <button
                className={`period-btn ${revenuePeriod === "month" ? "active" : ""}`}
                onClick={() => setRevenuePeriod("month")}
              >
                Tháng
              </button>
              <button
                className={`period-btn ${revenuePeriod === "quarter" ? "active" : ""}`}
                onClick={() => setRevenuePeriod("quarter")}
              >
                Quý
              </button>
              <button
                className={`period-btn ${revenuePeriod === "year" ? "active" : ""}`}
                onClick={() => setRevenuePeriod("year")}
              >
                Năm
              </button>
            </div>
          </div>
          <div className="chart-container">
            {chartDataConfig ? (
              <Line data={chartDataConfig} options={chartOptions} />
            ) : (
              <div className="chart-empty">Chưa có dữ liệu</div>
            )}
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Giao dịch gần đây</h3>
            <button
              className="view-all-btn"
              onClick={() => navigate("/admin?tab=transaction-management")}
            >
              Xem tất cả →
            </button>
          </div>
          {recentTransactions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Gói</th>
                  <th>Số tiền</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => {
                  const statusBadge = getStatusBadge(transaction.status);
                  return (
                    <tr key={transaction._id}>
                      <td>
                        {transaction.user?.username || transaction.user?.email || "N/A"}
                      </td>
                      <td>
                        {transaction.plan === "creator" ? "Creator VIP 1" : "Brand VIP 2"}
                      </td>
                      <td className="amount-cell">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>{formatDate(transaction.createdAt)}</td>
                      <td>
                        <span className={`status-pill ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="table-empty">
              <p>Chưa có giao dịch nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Overview Stats */}
      {overview && (
        <section className="overview-grid">
          <div className="overview-card">
            <div className="overview-icon">👤</div>
            <div className="overview-value">{overview.totalUsers}</div>
            <div className="overview-label">Tổng người dùng</div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">🎨</div>
            <div className="overview-value">{overview.totalCreators}</div>
            <div className="overview-label">Creators</div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">🏢</div>
            <div className="overview-value">{overview.totalBrands}</div>
            <div className="overview-label">Brands</div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">💼</div>
            <div className="overview-value">{overview.totalJobPosts}</div>
            <div className="overview-label">Tin tuyển dụng</div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">📝</div>
            <div className="overview-value">{overview.totalApplications}</div>
            <div className="overview-label">Ứng tuyển</div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">📰</div>
            <div className="overview-value">{overview.totalBlogs}</div>
            <div className="overview-label">Blog posts</div>
          </div>
        </section>
      )}
    </div>
  );
}
