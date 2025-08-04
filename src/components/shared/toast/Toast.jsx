import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, type = "success", show, duration = 3000, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
