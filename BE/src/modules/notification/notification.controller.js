import Notification from "../../models/Notification.js";

// Get notifications for logged-in user
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Count unread
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    return res.json({ notifications, unreadCount });
  } catch (err) {
    console.error("getMyNotifications error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Mark as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notif = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notif) return res.status(404).json({ error: "NOT_FOUND" });

    return res.json({ success: true, notification: notif });
  } catch (err) {
    console.error("markAsRead error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
    return res.json({ success: true });
  } catch (err) {
    console.error("markAllAsRead error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

// Delete a single notification of current user
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteNotification error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};
