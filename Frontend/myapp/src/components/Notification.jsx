// Notification.jsx
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const variants = {
  success: {
    icon: <CheckCircle className="text-green-500 w-5 h-5" />,
    bg: "from-green-400 to-green-600",
    title: "Success",
  },
  error: {
    icon: <XCircle className="text-red-500 w-5 h-5" />,
    bg: "from-red-400 to-red-600",
    title: "Error",
  },
};

const Notification = ({
  message = "",
  type = "success", // 'success' | 'error'
  duration = 6000,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);
  const [show, setShow] = useState(true);
  const variant = variants[type] || variants.success;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => prev - 100 / (duration / 100));
    }, 100);

    const timer = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm w-full animate-fade-in">
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden relative">
        <div className="p-4 flex items-start gap-3">
          <div>{variant.icon}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{variant.title}</p>
            <p className="text-xs text-gray-500">{message}</p>
          </div>
          <button
            onClick={() => {
              setShow(false);
              onClose?.();
            }}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div
          className={`h-1 bg-gradient-to-r ${variant.bg}`}
          style={{ width: `${progress}%`, transition: "width 100ms linear" }}
        ></div>
      </div>
    </div>
  );
};

export default Notification;
