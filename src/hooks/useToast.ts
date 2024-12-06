import { useCallback } from "react";
import { useToastStore } from "@/stores/useToastStore";
import { ToastType } from "@/types/toast";

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  const show = useCallback(
    (type: ToastType, message: string, title?: string, duration = 5000) => {
      addToast({ type, message, title, duration });
    },
    [addToast],
  );

  return {
    success: (message: string, title?: string, duration?: number) =>
      show("success", message, title, duration),
    error: (message: string, title?: string, duration?: number) =>
      show("error", message, title, duration),
    warning: (message: string, title?: string, duration?: number) =>
      show("warning", message, title, duration),
    info: (message: string, title?: string, duration?: number) =>
      show("info", message, title, duration),
  };
}
