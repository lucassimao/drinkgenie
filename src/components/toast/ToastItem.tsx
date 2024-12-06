import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Toast } from "@/types/toast";
import { ToastIcon } from "./ToastIcon";
import { useToastStore } from "@/stores/useToastStore";

interface ToastItemProps {
  toast: Toast;
}

export function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast);
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 5000;

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;

      if (newProgress > 0) {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [duration]);

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-100";
      case "error":
        return "bg-red-50 border-red-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div
      className={`relative overflow-hidden w-full max-w-sm rounded-lg border ${getBgColor()} shadow-lg`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <ToastIcon type={toast.type} />
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {toast.title}
              </h3>
            )}
            <p className="text-sm text-gray-700">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
