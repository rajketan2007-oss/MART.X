import React from 'react';
import { useUI } from '../../context/UIContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow-xl border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700'
                : isError
                ? 'bg-rose-950/90 text-rose-100 border-rose-700'
                : 'bg-slate-900/90 text-slate-100 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
