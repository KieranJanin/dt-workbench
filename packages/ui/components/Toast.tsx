"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "../utils";
import { useEffect } from "react";

export function Toast() {
  const { toasts, removeToast } = usePhaseStore();

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: any, onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const Icon = toast.type === 'success' ? CheckCircle 
             : toast.type === 'warning' ? AlertCircle 
             : toast.type === 'error' ? X 
             : Info;

  const colorClass = toast.type === 'success' ? 'bg-success text-black border-green-400'
                   : toast.type === 'warning' ? 'bg-warning text-black border-orange-400'
                   : toast.type === 'error' ? 'bg-urgent text-white border-pink-500'
                   : 'bg-info text-white border-blue-400';

  return (
    <div className={cn(
      "p-4 rounded-lg shadow-lg border flex items-start space-x-3 cursor-pointer transform transition-all animate-in slide-in-from-right-full",
      colorClass
    )} onClick={onRemove}>
      <Icon className="shrink-0 mt-0.5" size={18} />
      <div className="flex-1">
        <h4 className="font-bold text-sm">{toast.title}</h4>
        {toast.description && <p className="text-xs mt-1 opacity-90">{toast.description}</p>}
      </div>
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="shrink-0 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}
