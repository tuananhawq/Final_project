import Transaction from "../../models/Transaction.js";
import User from "../../models/User.js";
import PaymentConfig from "../../models/PaymentConfig.js";
import {
  sendTransactionNotificationEmail,
  sendUpgradeSuccessEmail,
} from "../../utils/mailer.js";

// Giá gốc và giá ưu đãi
export const PRICING = {
  creator: {
    original: 199000,
    discounted: 99000,
  },
  brand: {
    original: 299000,
    discounted: 199000,
  },
};

// Tạo transaction mới (user đã đăng nhập)
export const createTransaction = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    if (!plan || !["creator", "brand"].includes(plan)) {
      return res.status(400).json({ error: "INVALID_PLAN" });
    }

    const pricing = PRICING[plan];
    if (!pricing) {
      return res.status(400).json({ error: "INVALID_PLAN" });
    }

    // Lấy thông tin user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // Tạo nội dung chuyển khoản: REVLIVE [Username] [Gói dịch vụ]
    const username = user.username || user.email.split("@")[0];
    const planName = plan === "creator" ? "Creator VIP 1" : "Brand VIP 2";
    const transferContent = `REVLIVE ${username} ${planName}`;

    // Lấy QR code URL từ PaymentConfig
    const paymentConfig = await PaymentConfig.getConfig();
    const qrCodeUrl = paymentConfig.qrCodeUrl || process.env.BANK_QR_CODE_URL || "";

    // Lưu thông tin trước khi nâng cấp
    const beforeUpgrade = {
      memberType: user.memberType || "free",
      premiumExpiredAt: user.premiumExpiredAt || null,
    };

    // Tạo transaction
    const transaction = await Transaction.create({
      user: userId,
      plan,
      amount: pricing.discounted,
      originalAmount: pricing.original,
      transferContent,
      qrCodeUrl,
      status: "pending",
      beforeUpgrade,
    });

    // Gửi email thông báo cho staff/admin (bất đồng bộ, không chặn response)
    try {
      const staffUsers = await User.find({
        roles: { $in: ["staff", "admin"] },
        isActive: true,
      }).select("email");

      const staffEmails = staffUsers.map((u) => u.email).filter(Boolean);

      if (staffEmails.length > 0) {
        sendTransactionNotificationEmail(staffEmails, {
          username: user.username || user.email.split("@")[0],
          email: user.email,
          plan,
          amount: pricing.discounted,
          originalAmount: pricing.original,
          transferContent,
          createdAt: transaction.createdAt,
        }).catch((err) => {
          console.error("Failed to send notification email:", err);
          // Không throw error để không ảnh hưởng đến response
        });
      }
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Không throw error để không ảnh hưởng đến response
    }

    res.status(201).json({
      transaction: {
        _id: transaction._id,
        plan: transaction.plan,
        amount: transaction.amount,
        originalAmount: transaction.originalAmount,
        transferContent: transaction.transferContent,
        qrCodeUrl: transaction.qrCodeUrl,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error("createTransaction error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Lấy danh sách transaction của user hiện tại
export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("approvedBy", "username email")
      .select("-__v");

    res.json({ transactions });
  } catch (error) {
    console.error("getMyTransactions error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Lấy tất cả transactions (chỉ staff/admin)
export const getAllTransactions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "completed", "cancelled"].includes(status)) {
      filter.status = status;
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "username email")
      .populate("approvedBy", "username email")
      .select("-__v");

    res.json({ transactions });
  } catch (error) {
    console.error("getAllTransactions error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Duyệt transaction (chỉ staff/admin)
export const approveTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const staffId = req.user.id;

    const transaction = await Transaction.findById(transactionId).populate(
      "user"
    );
    if (!transaction) {
      return res.status(404).json({ error: "TRANSACTION_NOT_FOUND" });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({
        error: "INVALID_STATUS",
        message: "Chỉ có thể duyệt transaction đang chờ xử lý",
      });
    }

    const user = transaction.user;
    const now = new Date();
    const currentExpiredAt = user.premiumExpiredAt || null;

    // Tính toán ngày hết hạn mới: max(Now, CurrentExpiredAt) + 30 ngày
    const baseDate = currentExpiredAt && currentExpiredAt > now 
      ? currentExpiredAt 
      : now;
    const newExpiredAt = new Date(baseDate);
    newExpiredAt.setDate(newExpiredAt.getDate() + 30);

    // Cập nhật memberType và premiumExpiredAt
    const newMemberType = transaction.plan; // "creator" hoặc "brand"

    // Cập nhật user
    user.memberType = newMemberType;
    user.premiumExpiredAt = newExpiredAt;
    user.premiumStatus = "premium";
    
    // Thêm role nếu chưa có
    if (!user.roles.includes(newMemberType)) {
      user.roles.push(newMemberType);
    }

    await user.save();

    // Lưu thông tin sau khi nâng cấp
    const afterUpgrade = {
      memberType: newMemberType,
      premiumExpiredAt: newExpiredAt,
    };

    // Cập nhật transaction
    transaction.status = "completed";
    transaction.approvedBy = staffId;
    transaction.approvedAt = now;
    transaction.afterUpgrade = afterUpgrade;
    await transaction.save();

    // Gửi email thông báo nâng cấp thành công cho user (bất đồng bộ)
    try {
      await sendUpgradeSuccessEmail(user.email, {
        username: user.username || user.email.split("@")[0],
        plan: transaction.plan,
        amount: transaction.amount,
        newMemberType,
        expiredAt: newExpiredAt,
        approvedAt: now,
      });
    } catch (emailError) {
      console.error("Failed to send upgrade success email:", emailError);
      // Không throw error để không ảnh hưởng đến response
    }

    res.json({
      message: "Duyệt transaction thành công",
      transaction: {
        _id: transaction._id,
        status: transaction.status,
        afterUpgrade,
      },
      user: {
        _id: user._id,
        memberType: user.memberType,
        premiumExpiredAt: user.premiumExpiredAt,
      },
    });
  } catch (error) {
    console.error("approveTransaction error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Hủy transaction (chỉ staff/admin)
export const cancelTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "TRANSACTION_NOT_FOUND" });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({
        error: "INVALID_STATUS",
        message: "Chỉ có thể hủy transaction đang chờ xử lý",
      });
    }

    transaction.status = "cancelled";
    transaction.cancelledAt = new Date();
    transaction.cancelledReason = reason || "Đã hủy bởi staff";
    await transaction.save();

    res.json({
      message: "Hủy transaction thành công",
      transaction: {
        _id: transaction._id,
        status: transaction.status,
      },
    });
  } catch (error) {
    console.error("cancelTransaction error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Lấy thông tin pricing (public)
export const getPricing = async (req, res) => {
  try {
    res.json({
      pricing: PRICING,
    });
  } catch (error) {
    console.error("getPricing error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Kiểm tra trạng thái thanh toán/premium của user hiện tại
export const checkPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      "memberType premiumStatus premiumExpiredAt roles email username"
    );

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const now = new Date();
    const isPremium = user.premiumStatus === "premium";
    const isExpired =
      user.premiumExpiredAt
        ? new Date(user.premiumExpiredAt) < now
        : true;
    const isActive = isPremium && !isExpired;

    // Lấy transaction gần nhất
    const latestTransaction = await Transaction.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select("status plan amount createdAt");

    res.json({
      user: {
        memberType: user.memberType || "free",
        premiumStatus: user.premiumStatus || "free",
        premiumExpiredAt: user.premiumExpiredAt || null,
        roles: user.roles || [],
      },
      status: {
        isPremium,
        isExpired,
        isActive,
        daysRemaining: user.premiumExpiredAt && !isExpired
          ? Math.ceil(
              (new Date(user.premiumExpiredAt) - now) / (1000 * 60 * 60 * 24)
            )
          : 0,
      },
      latestTransaction: latestTransaction
        ? {
            status: latestTransaction.status,
            plan: latestTransaction.plan,
            amount: latestTransaction.amount,
            createdAt: latestTransaction.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error("checkPaymentStatus error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Lấy payment config (Staff/Admin only)
export const getPaymentConfig = async (req, res) => {
  try {
    const config = await PaymentConfig.getConfig();
    res.json({ config });
  } catch (error) {
    console.error("getPaymentConfig error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};

// Cập nhật payment config (Staff/Admin only)
export const updatePaymentConfig = async (req, res) => {
  try {
    const { qrCodeUrl, bankName, accountNumber, accountHolder } = req.body;
    const staffId = req.user.id;

    const config = await PaymentConfig.getConfig();
    
    if (qrCodeUrl !== undefined) config.qrCodeUrl = qrCodeUrl;
    if (bankName !== undefined) config.bankName = bankName;
    if (accountNumber !== undefined) config.accountNumber = accountNumber;
    if (accountHolder !== undefined) config.accountHolder = accountHolder;
    
    config.updatedBy = staffId;
    await config.save();

    res.json({
      message: "Cập nhật cấu hình thanh toán thành công",
      config,
    });
  } catch (error) {
    console.error("updatePaymentConfig error:", error);
    res.status(500).json({ error: "SERVER_ERROR", message: error.message });
  }
};
