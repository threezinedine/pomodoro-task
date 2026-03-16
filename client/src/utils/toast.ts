export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

type Subscriber = (toasts: ToastConfig[]) => void;

class ToastManager {
  private toasts: ToastConfig[] = [];
  private subscribers: Set<Subscriber> = new Set();
  
  public subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  private notify() {
    this.subscribers.forEach(callback => callback([...this.toasts]));
  }
  
  public addToast(message: string, variant: ToastVariant = 'info', duration: number = 3000) {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    this.toasts.push({ id, message, variant, duration });
    this.notify();
    
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
  }
  
  public removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }
  
  public clearAll() {
    this.toasts = [];
    this.notify();
  }
  
  public success(message: string, duration?: number) {
    this.addToast(message, 'success', duration);
  }
  
  public error(message: string, duration?: number) {
    this.addToast(message, 'error', duration);
  }
  
  public info(message: string, duration?: number) {
    this.addToast(message, 'info', duration);
  }

  public warning(message: string, duration?: number) {
    this.addToast(message, 'warning', duration);
  }
}

export const toast = new ToastManager();
