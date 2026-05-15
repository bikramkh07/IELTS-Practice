'use client';
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

interface ToastContextType {
  showToast: (msg: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((msg: string, duration = 3000) => {
    clearTimeout(timeout.current);
    setMessage(msg);
    setVisible(true);
    timeout.current = setTimeout(() => setVisible(false), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast" role="status" aria-live="polite" className={visible ? 'visible' : ''}>
        {message}
      </div>
    </ToastContext.Provider>
  );
}
