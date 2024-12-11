import { useToastStore } from "@/stores/useToastStore";
import { ToastType } from "@/types/toast";
import { useMemo } from "react";

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  function show(
    type: ToastType,
    message: string,
    title?: string,
    duration = 5000,
  ) {
    addToast({ type, message, title, duration });
  }

  return useMemo(
    () => ({
      show,
      success: (message: string, title?: string, duration?: number) =>
        show("success", message, title, duration),
      error: (message: string, title?: string, duration?: number) =>
        show("error", message, title, duration),
      warning: (message: string, title?: string, duration?: number) =>
        show("warning", message, title, duration),
      info: (message: string, title?: string, duration?: number) =>
        show("info", message, title, duration),
    }),
    [show],
  );
}
