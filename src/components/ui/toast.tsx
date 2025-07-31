import React, { useEffect, useState } from "react";
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = "success",
  duration = 4000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);

    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles =
      "fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg border transform transition-all duration-300 ease-in-out max-w-md";

    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    const typeStyles = {
      success: "bg-white border-green-200 text-green-800",
      error: "bg-white border-red-200 text-red-800",
      warning: "bg-white border-yellow-200 text-yellow-800",
      info: "bg-white border-blue-200 text-blue-800",
    };

    return `${baseStyles} translate-x-0 opacity-100 ${typeStyles[type]}`;
  };

  const getIcon = () => {
    const iconProps = { className: "h-5 w-5 mr-3 flex-shrink-0" };

    switch (type) {
      case "success":
        return (
          <CheckCircle
            {...iconProps}
            className="h-5 w-5 mr-3 flex-shrink-0 text-green-500"
          />
        );
      case "error":
        return (
          <AlertCircle
            {...iconProps}
            className="h-5 w-5 mr-3 flex-shrink-0 text-red-500"
          />
        );
      case "warning":
        return (
          <AlertTriangle
            {...iconProps}
            className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-500"
          />
        );
      case "info":
        return (
          <Info
            {...iconProps}
            className="h-5 w-5 mr-3 flex-shrink-0 text-blue-500"
          />
        );
      default:
        return (
          <CheckCircle
            {...iconProps}
            className="h-5 w-5 mr-3 flex-shrink-0 text-green-500"
          />
        );
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="flex-1">
        <p className="font-medium text-sm">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
  return <div>{children}</div>;
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "error" | "warning" | "info";
      duration?: number;
    }>
  >([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
    duration = 4000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastProvider = () => (
    <ToastContainer>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContainer>
  );

  return { showToast, ToastProvider };
}
