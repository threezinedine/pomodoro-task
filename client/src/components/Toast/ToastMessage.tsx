import type { ToastVariant } from '../../utils/toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastMessageProps {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  onDismiss: () => void;
}

const icons = {
  success: <CheckCircle className="toast-icon toast-icon--success" size={20} />,
  error: <AlertCircle className="toast-icon toast-icon--error" size={20} />,
  info: <Info className="toast-icon toast-icon--info" size={20} />,
  warning: <AlertTriangle className="toast-icon toast-icon--warning" size={20} />
};

export const ToastMessage = ({ message, variant, duration, onDismiss }: ToastMessageProps) => {
  return (
    <div className={`toast-message toast-message--${variant}`} role="alert" aria-live="polite">
      <div className="toast-message__icon">{icons[variant]}</div>
      <div className="toast-message__content">{message}</div>
      <button 
        className="toast-message__close" 
        onClick={onDismiss} 
        aria-label="Close toast"
        title="Close"
      >
        <X size={16} />
      </button>
      
      {duration && duration > 0 && (
        <div 
          className="toast-message__progress" 
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};
