import Transaction from "../../models/Transaction.js";
import User from "../../models/User.js";
import JobPost from "../../models/JobPost.js";
import Application from "../../models/Application.js";
import Blog from "../../models/Blog.js";

// Lấy thống kê tổng quan cho dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    
    const weekAgo = new Date(todayStart);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(todayStart);
    monthAgo.setDate(monthAgo.getDate() - 30);

    // Doanh thu hôm nay (từ transactions completed)
    const todayRevenue = await Transaction.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const yesterdayRevenue = await Transaction.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const todayRevenueAmount = todayRevenue[0]?.total || 0;
    const yesterdayRevenueAmount = yesterdayRevenue[0]?.total || 0;
    const revenueChange =
      yesterdayRevenueAmount > 0
        ? ((todayRevenueAmount - yesterdayRevenueAmount) / yesterdayRevenueAmount) * 100
        : 0;

    // Đơn hàng mới (pending transactions)
    const newOrders = await Transaction.countDocuments({
      status: "pending",
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const lastWeekOrders = await Transaction.countDocuments({
      status: "pending",
      createdAt: { $gte: weekAgo, $lte: todayStart },
    });

    const ordersChange =
      lastWeekOrders > 0 ? ((newOrders - lastWeekOrders) / lastWeekOrders) * 100 : 0;

    // Khách hàng mới (users created trong 7 ngày)
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: weekAgo },
      roles: { $in: ["user", "creator", "brand"] },
    });

    const previousWeekCustomers = await User.countDocuments({
      createdAt: { $gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000), $lt: weekAgo },
      roles: { $in: ["user", "creator", "brand"] },
    });

    const customersChange =
      previousWeekCustomers > 0
        ? ((newCustomers - previousWeekCustomers) / previousWeekCustomers) * 100
        : 0;

    // Tỷ lệ hủy đơn
    const totalTransactions = await Transaction.countDocuments({
      createdAt: { $gte: monthAgo },
    });

    const cancelledTransactions = await Transaction.countDocuments({
      status: "cancelled",
      createdAt: { $gte: monthAgo },
    });

    const previousMonthTotal = await Transaction.countDocuments({
      createdAt: {
        $gte: new Date(monthAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
        $lt: monthAgo,
      },
    });

    const previousMonthCancelled = await Transaction.countDocuments({
      status: "cancelled",
      createdAt: {
        $gte: new Date(monthAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
        $lt: monthAgo,
      },
    });

    const cancelRate = totalTransactions > 0 ? (cancelledTransactions / totalTransactions) * 100 : 0;
    const previousCancelRate =
      previousMonthTotal > 0 ? (previousMonthCancelled / previousMonthTotal) * 100 : 0;
    const cancelRateChange = cancelRate - previousCancelRate;

    res.json({
      revenue: {
        today: todayRevenueAmount,
        change: revenueChange,
      },
      orders: {
        new: newOrders,
        change: ordersChange,
      },
      customers: {
        new: newCustomers,
        change: customersChange,
      },
      cancelRate: {
        rate: cancelRate,
        change: cancelRateChange,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Lấy dữ liệu cho biểu đồ doanh thu (7 ngày gần nhất)
export const getRevenueChart = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Lấy transactions completed trong 7 ngày
    const transactions = await Transaction.find({
      status: "completed",
      createdAt: { $gte: sevenDaysAgo },
    }).select("amount createdAt");

    // Nhóm theo ngày
    const dailyRevenue = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toISOString().split("T")[0];
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      dailyRevenue[date] += transaction.amount;
    });

    // Tạo array cho 7 ngày gần nhất
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = date.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" });
      labels.push(dayLabel);
      data.push(dailyRevenue[dateStr] || 0);
    }

    res.json({ labels, data });
  } catch (error) {
    console.error("getRevenueChart error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Lấy transactions gần đây
export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "username email")
      .select("amount status createdAt plan");

    res.json({ transactions });
  } catch (error) {
    console.error("getRecentTransactions error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Lấy thống kê tổng quan khác
export const getOverviewStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCreators,
      totalBrands,
      totalJobPosts,
      totalApplications,
      totalBlogs,
      pendingTransactions,
    ] = await Promise.all([
      User.countDocuments({ roles: { $in: ["user", "creator", "brand"] } }),
      User.countDocuments({ roles: "creator" }),
      User.countDocuments({ roles: "brand" }),
      JobPost.countDocuments(),
      Application.countDocuments(),
      Blog.countDocuments(),
      Transaction.countDocuments({ status: "pending" }),
    ]);

    res.json({
      totalUsers,
      totalCreators,
      totalBrands,
      totalJobPosts,
      totalApplications,
      totalBlogs,
      pendingTransactions,
    });
  } catch (error) {
    console.error("getOverviewStats error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};
