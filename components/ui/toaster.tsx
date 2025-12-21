'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// Global toast state
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const newToast: Toast = {
    id: Math.random().toString(36).slice(2),
    type,
    message,
  };
  toasts = [...toasts, newToast];
  toastListeners.forEach(listener => listener(toasts));

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== newToast.id);
    toastListeners.forEach(listener => listener(toasts));
  }, 5000);
}

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push(setCurrentToasts);
    return () => {
      toastListeners = toastListeners.filter(l => l !== setCurrentToasts);
    };
  }, []);

  const dismiss = (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    toastListeners.forEach(listener => listener(toasts));
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-200',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {currentToasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${colors[t.type]} animate-in slide-in-from-right`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
