// src/components/ui/Toast.tsx
// Pure Tailwind toast notification system
// Usage: useToast() hook → toast.success("Saved!") / toast.error("Failed")
"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error:   <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-orange-500" />,
  info:    <Info className="h-5 w-5 text-blue-500" />,
};

const BORDER: Record<ToastType, string> = {
  success: "border-l-4 border-green-500",
  error:   "border-l-4 border-red-500",
  warning: "border-l-4 border-orange-500",
  info:    "border-l-4 border-blue-500",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, title, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{
      success: (t, m) => add("success", t, m),
      error:   (t, m) => add("error", t, m),
      warning: (t, m) => add("warning", t, m),
      info:    (t, m) => add("info", t, m),
    }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-lg animate-scale-in",
              BORDER[toast.type]
            )}
          >
            <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
              {toast.message && <p className="mt-0.5 text-xs text-gray-500">{toast.message}</p>}
            </div>
            <button
              onClick={() => remove(toast.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}