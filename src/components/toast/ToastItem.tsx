"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Toast } from "../../types/toast";
import { ToastIcon } from "./ToastIcon";
import { useToastStore } from "../../stores/useToastStore";
import { getToastStyles } from "./toastStyles";

interface ToastItemProps {
  toast: Toast;
}

export function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast);
  const styles = getToastStyles(toast.type);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div
      className={`w-full rounded-lg border shadow-lg pointer-events-auto 
                 animate-toast-slide-in ${styles.background} ${styles.border}`}
      role="alert"
    >
      <div className="relative overflow-hidden">
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
          className={`absolute bottom-0 left-0 h-1 w-full ${styles.progress}`}
        >
          <div
            className="h-full animate-toast-progress origin-left"
            style={{
              animationDuration: `${toast.duration || 5000}ms`,
              backgroundColor: "currentColor",
            }}
          />
        </div>
      </div>
    </div>
  );
}
