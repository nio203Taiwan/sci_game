import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface Props {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
}

export const Toast: React.FC<Props> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColors = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  };

  const Icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const Icon = Icons[type];

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] animate-pop pointer-events-none">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border-l-4 shadow-2xl ${bgColors[type]}`}>
        <Icon className="w-6 h-6 shrink-0" />
        <span className="font-bold text-lg whitespace-nowrap">{message}</span>
      </div>
    </div>
  );
};