import React from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { ToastType } from "../../types/toast";

interface ToastIconProps {
  type: ToastType;
}

export function ToastIcon({ type }: ToastIconProps) {
  const iconProps = {
    className: "h-5 w-5",
    strokeWidth: 2,
  };

  switch (type) {
    case "success":
      return <CheckCircle2 {...iconProps} className="text-green-500" />;
    case "error":
      return <XCircle {...iconProps} className="text-red-500" />;
    case "warning":
      return <AlertCircle {...iconProps} className="text-amber-500" />;
    default:
      return <Info {...iconProps} className="text-blue-500" />;
  }
}
