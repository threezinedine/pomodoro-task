import { useEffect, useState } from 'react';
import { toast } from '../../utils/toast';
import type { ToastConfig } from '../../utils/toast';
import { ToastMessage } from './ToastMessage';
import './Toast.scss';

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return () => unsubscribe();
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastMessage 
          key={t.id} 
          id={t.id} 
          message={t.message} 
          variant={t.variant} 
          duration={t.duration}
          onDismiss={() => toast.removeToast(t.id)} 
        />
      ))}
    </div>
  );
};
