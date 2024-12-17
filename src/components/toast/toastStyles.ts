interface ToastStyles {
  background: string;
  border: string;
  progress: string;
}

export function getToastStyles(
  type: "success" | "error" | "warning" | "info",
): ToastStyles {
  switch (type) {
    case "success":
      return {
        background: "bg-green-50",
        border: "border-green-100",
        progress: "text-green-500/30",
      };
    case "error":
      return {
        background: "bg-red-50",
        border: "border-red-100",
        progress: "text-red-500/30",
      };
    case "warning":
      return {
        background: "bg-amber-50",
        border: "border-amber-100",
        progress: "text-amber-500/30",
      };
    default:
      return {
        background: "bg-blue-50",
        border: "border-blue-100",
        progress: "text-blue-500/30",
      };
  }
}
