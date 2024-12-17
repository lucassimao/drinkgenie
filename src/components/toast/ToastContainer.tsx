"use client";
import React from "react";
import { useToastStore } from "../../stores/useToastStore";
import { ToastItem } from "./ToastItem";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      aria-live="polite"
      className="fixed top-4 left-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-md px-4"
      style={{ transform: "translateX(-50%)" }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
