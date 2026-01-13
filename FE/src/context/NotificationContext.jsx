import React, { createContext, useContext, useState, useCallback } from "react";
import "../styles/notification.css";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [confirmState, setConfirmState] = useState({
    open: false,
    message: "",
    resolve: null,
    confirmLabel: "Xác nhận",
    cancelLabel: "Hủy",
  });

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (type, message, duration = 3500) => {
      if (!message) return;
      const id = `${Date.now()}-${Math.random()}`;
      setNotifications((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeNotification(id), duration);
    },
    [removeNotification]
  );

  const confirm = useCallback(
    (message, options = {}) =>
      new Promise((resolve) => {
        setConfirmState({
          open: true,
          message,
          resolve,
          confirmLabel: options.confirmLabel || "Xác nhận",
          cancelLabel: options.cancelLabel || "Hủy",
        });
      }),
    []
  );

  const handleConfirmChoice = (result) => {
    if (confirmState.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState({
      open: false,
      message: "",
      resolve: null,
      confirmLabel: "Xác nhận",
      cancelLabel: "Hủy",
    });
  };

  const value = {
    notifySuccess: (msg, duration) => notify("success", msg, duration),
    notifyError: (msg, duration) => notify("error", msg, duration),
    notifyInfo: (msg, duration) => notify("info", msg, duration),
    confirm,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Toasts */}
      <div className="toast-container">
        {notifications.map((n) => (
          <div key={n.id} className={`toast toast-${n.type}`}>
            <div className="toast-indicator" />
            <div className="toast-message">{n.message}</div>
            <button
              className="toast-close"
              onClick={() => removeNotification(n.id)}
              aria-label="Đóng thông báo"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmState.open && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <div className="confirm-title">Xác nhận</div>
            <div className="confirm-message">{confirmState.message}</div>
            <div className="confirm-actions">
              <button
                className="confirm-btn secondary"
                onClick={() => handleConfirmChoice(false)}
              >
                {confirmState.cancelLabel}
              </button>
              <button
                className="confirm-btn primary"
                onClick={() => handleConfirmChoice(true)}
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
