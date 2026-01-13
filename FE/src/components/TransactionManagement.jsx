import { useState, useEffect } from "react";
import {
  getAllTransactions,
  approveTransaction,
  cancelTransaction,
} from "../services/paymentService";
import { useNotification } from "../context/NotificationContext";
import "../styles/transaction-management.css";

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending"); // pending, completed, cancelled, all
  const { notifySuccess, notifyError, confirm } = useNotification();

  useEffect(() => {
    fetchTransactions();
  }, [filterStatus]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const status = filterStatus === "all" ? null : filterStatus;
      const data = await getAllTransactions(status);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      notifyError("Không thể tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    const confirmed = await confirm(
      "Bạn có chắc chắn muốn duyệt giao dịch này? Hệ thống sẽ tự động nâng cấp tài khoản người dùng.",
      {
        confirmLabel: "Duyệt",
        cancelLabel: "Hủy",
      }
    );

    if (!confirmed) return;

    try {
      await approveTransaction(transactionId);
      notifySuccess("Duyệt giao dịch thành công!");
      fetchTransactions();
    } catch (error) {
      console.error("Error approving transaction:", error);
      notifyError(
        error.response?.data?.message || "Không thể duyệt giao dịch"
      );
    }
  };

  const handleCancel = async (transactionId) => {
    const confirmed = await confirm(
      "Bạn có chắc chắn muốn hủy giao dịch này?",
      {
        confirmLabel: "Hủy giao dịch",
        cancelLabel: "Quay lại",
      }
    );

    if (!confirmed) return;

    // Lý do mặc định - có thể cải thiện sau bằng custom input modal
    const reason = "Đã hủy bởi Staff";

    try {
      await cancelTransaction(transactionId, reason);
      notifySuccess("Hủy giao dịch thành công!");
      fetchTransactions();
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      notifyError(
        error.response?.data?.message || "Không thể hủy giao dịch"
      );
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "Chờ duyệt", class: "status-pending" },
      completed: { text: "Đã duyệt", class: "status-completed" },
      cancelled: { text: "Đã hủy", class: "status-cancelled" },
    };
    return badges[status] || badges.pending;
  };

  const getPlanName = (plan) => {
    return plan === "creator" ? "Creator VIP 1" : "Brand VIP 2";
  };

  if (loading) {
    return (
      <div className="transaction-management">
        <div className="transaction-loading">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return (
    <div className="transaction-management">
      <div className="transaction-header">
        <h2>Quản lý Giao dịch</h2>
        {filterStatus === "pending" && pendingCount > 0 && (
          <div className="pending-badge">
            {pendingCount} đơn chờ duyệt
          </div>
        )}
      </div>

      <div className="transaction-filters">
        <button
          className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
          onClick={() => setFilterStatus("pending")}
        >
          Chờ duyệt
        </button>
        <button
          className={`filter-btn ${filterStatus === "completed" ? "active" : ""}`}
          onClick={() => setFilterStatus("completed")}
        >
          Đã duyệt
        </button>
        <button
          className={`filter-btn ${filterStatus === "cancelled" ? "active" : ""}`}
          onClick={() => setFilterStatus("cancelled")}
        >
          Đã hủy
        </button>
        <button
          className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          Tất cả
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="transaction-empty">
          <p>Không có giao dịch nào</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => {
            const statusBadge = getStatusBadge(transaction.status);
            return (
              <div key={transaction._id} className="transaction-card">
                <div className="transaction-card-header">
                  <div className="transaction-info">
                    <h3>
                      {transaction.user?.username || transaction.user?.email}
                    </h3>
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                  <div className="transaction-plan">
                    {getPlanName(transaction.plan)}
                  </div>
                </div>

                <div className="transaction-details">
                  <div className="detail-row">
                    <span className="detail-label">Số tiền:</span>
                    <span className="detail-value">
                      <span className="price-original">
                        {formatCurrency(transaction.originalAmount)}
                      </span>
                      <span className="price-discounted">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Nội dung chuyển khoản:</span>
                    <span className="detail-value transfer-content">
                      {transaction.transferContent}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Thời gian yêu cầu:</span>
                    <span className="detail-value">
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>

                  {transaction.status === "completed" && transaction.approvedBy && (
                    <div className="detail-row">
                      <span className="detail-label">Duyệt bởi:</span>
                      <span className="detail-value">
                        {transaction.approvedBy?.username || transaction.approvedBy?.email}
                      </span>
                      <span className="detail-value">
                        ({formatDate(transaction.approvedAt)})
                      </span>
                    </div>
                  )}

                  {transaction.status === "cancelled" && transaction.cancelledReason && (
                    <div className="detail-row">
                      <span className="detail-label">Lý do hủy:</span>
                      <span className="detail-value cancelled-reason">
                        {transaction.cancelledReason}
                      </span>
                    </div>
                  )}

                  {transaction.beforeUpgrade && (
                    <div className="upgrade-info">
                      <div className="detail-row">
                        <span className="detail-label">Trước nâng cấp:</span>
                        <span className="detail-value">
                          <span className={`member-type-badge ${transaction.beforeUpgrade.memberType || "free"}`}>
                            {transaction.beforeUpgrade.memberType === "free" 
                              ? "Miễn phí" 
                              : transaction.beforeUpgrade.memberType === "creator" 
                                ? "Creator VIP 1" 
                                : "Brand VIP 2"}
                          </span>
                          {transaction.beforeUpgrade.premiumExpiredAt &&
                            ` (Hết hạn: ${formatDate(transaction.beforeUpgrade.premiumExpiredAt)})`}
                        </span>
                      </div>
                      {transaction.afterUpgrade && (
                        <div className="detail-row">
                          <span className="detail-label">Sau nâng cấp:</span>
                          <span className="detail-value success-text">
                            <span className={`member-type-badge ${transaction.afterUpgrade.memberType}`}>
                              {transaction.afterUpgrade.memberType === "creator" 
                                ? "Creator VIP 1" 
                                : "Brand VIP 2"}
                            </span>
                            {transaction.afterUpgrade.premiumExpiredAt &&
                              ` (Hết hạn: ${formatDate(transaction.afterUpgrade.premiumExpiredAt)})`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {transaction.status === "pending" && (
                  <div className="transaction-actions">
                    <button
                      className="action-btn approve-btn"
                      onClick={() => handleApprove(transaction._id)}
                    >
                      ✓ Duyệt
                    </button>
                    <button
                      className="action-btn cancel-btn"
                      onClick={() => handleCancel(transaction._id)}
                    >
                      ✕ Hủy
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
