import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { ToastNotification } from "../types";

interface ToastProps {
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div
      id="toast-notification-panel"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  key?: string;
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          border: "border-emerald-500/30",
          bg: "bg-white/95 dark:bg-navy-900/95 shadow-emerald-500/5",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          border: "border-rose-500/30",
          bg: "bg-white/95 dark:bg-navy-900/95 shadow-rose-500/5",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-5 h-5 text-gold-500 shrink-0" />,
          border: "border-gold-500/30",
          bg: "bg-white/95 dark:bg-navy-900/95 shadow-gold-500/5",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      id={`toast-item-${toast.id}`}
      className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl border ${styles.border} ${styles.bg} shadow-lg backdrop-blur-md transform transition-all duration-300 animate-slide-in-right`}
    >
      {styles.icon}
      <div className="flex-1">
        <p className="text-xs font-semibold text-navy-800 dark:text-gold-100 uppercase tracking-wider">
          {toast.type === "success" ? "Success" : toast.type === "error" ? "System Message" : "Inbound Info"}
        </p>
        <p className="text-xs text-navy-600 dark:text-navy-300 font-light mt-0.5 leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-navy-400 hover:text-navy-600 dark:hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
