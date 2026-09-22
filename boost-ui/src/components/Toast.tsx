import * as React from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error' | 'loading';
export type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

/**
 * ToastProps — Properties for an individual Toast notification.
 *
 * @example
 * ```tsx
 * <Toast message="Saved!" variant="success" />
 * ```
 */
export interface ToastProps {
  id?: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  type?: ToastVariant;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  variant,
  type,
  onClose,
  className = '',
  style,
}) => {
  const activeVariant = type || variant || 'info';

  const getTheme = () => {
    switch (activeVariant) {
      case 'success': return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#16a34a' };
      case 'warning': return { bg: '#fffbeb', border: '#fde68a', text: '#854d0e', icon: '#d97706' };
      case 'error': return { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#dc2626' };
      case 'loading': return { bg: '#f8fafc', border: '#e2e8f0', text: '#334155', icon: '#2563eb' };
      case 'info':
      default: return { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#2563eb' };
    }
  };

  const theme = getTheme();
  const isAssertive = activeVariant === 'error';

  return (
    <div
      className={`boost-toast boost-toast-${activeVariant} ${className}`}
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.12)',
        fontFamily: 'inherit',
        maxWidth: '380px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <style>{`
        @keyframes boost-toast-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        :root[data-theme="dark"] .boost-toast,
        .dark .boost-toast {
          background-color: var(--boost-surface, #1e293b) !important;
          border-color: var(--boost-border, rgba(255, 255, 255, 0.12)) !important;
          box-shadow: var(--boost-shadow-lg, 0 14px 30px -5px rgba(0, 0, 0, 0.6)) !important;
          color: var(--boost-text, #f8fafc) !important;
        }
        :root[data-theme="dark"] .boost-toast-title,
        .dark .boost-toast-title {
          color: var(--boost-text, #f8fafc) !important;
        }
        :root[data-theme="dark"] .boost-toast-msg,
        .dark .boost-toast-msg {
          color: var(--boost-text-muted, #cbd5e1) !important;
        }
      `}</style>
      <div style={{ marginTop: '2px', display: 'flex', color: theme.icon, flexShrink: 0 }}>
        {activeVariant === 'loading' && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ animation: 'boost-toast-spin 0.8s linear infinite' }}
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        )}
        {activeVariant === 'success' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {activeVariant === 'error' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
        {activeVariant === 'warning' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        )}
        {activeVariant === 'info' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div className="boost-toast-title" style={{ fontSize: '14px', fontWeight: 600, color: theme.text, marginBottom: '2px' }}>
            {title}
          </div>
        )}
        <div className="boost-toast-msg" style={{ fontSize: '13px', color: theme.text, lineHeight: 1.4 }}>
          {message}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: theme.text,
            opacity: 0.6,
            display: 'flex',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export interface ToastPromiseOptions<T = any> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((err: any) => string);
}

export interface ToastOptions {
  id?: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastContextType {
  toast: {
    (options: ToastOptions): string;
    success: (message: string, title?: string) => string;
    error: (message: string, title?: string) => string;
    warning: (message: string, title?: string) => string;
    info: (message: string, title?: string) => string;
    loading: (message: string, title?: string) => string;
    promise: <T>(promise: Promise<T>, options: ToastPromiseOptions<T>) => Promise<T>;
    dismiss: (id: string) => void;
  };
}

interface ActiveToast extends ToastOptions {
  id: string;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'bottom-right',
  defaultDuration = 4000,
}) => {
  const [toasts, setToasts] = React.useState<ActiveToast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (options: ToastOptions) => {
      const id = options.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const duration = options.duration !== undefined ? options.duration : defaultDuration;

      const newToast: ActiveToast = {
        ...options,
        id,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [defaultDuration, dismiss]
  );

  const toastMethods = React.useMemo(() => {
    const fn = (options: ToastOptions) => addToast(options);
    fn.success = (message: string, title?: string) =>
      addToast({ message, title, variant: 'success' });
    fn.error = (message: string, title?: string) =>
      addToast({ message, title, variant: 'error' });
    fn.warning = (message: string, title?: string) =>
      addToast({ message, title, variant: 'warning' });
    fn.info = (message: string, title?: string) =>
      addToast({ message, title, variant: 'info' });
    fn.loading = (message: string, title?: string) =>
      addToast({ message, title, variant: 'loading', duration: 0 });
    fn.promise = async <T,>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T> => {
      const id = addToast({ message: options.loading, variant: 'loading', duration: 0 });
      try {
        const data = await promise;
        dismiss(id);
        const successMsg = typeof options.success === 'function' ? options.success(data) : options.success;
        addToast({ message: successMsg, variant: 'success' });
        return data;
      } catch (err: any) {
        dismiss(id);
        const errorMsg = typeof options.error === 'function' ? options.error(err) : options.error;
        addToast({ message: errorMsg, variant: 'error' });
        throw err;
      }
    };
    fn.dismiss = dismiss;
    return fn;
  }, [addToast, dismiss]);

  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none',
      padding: '16px',
      maxWidth: '420px',
      width: '100%',
      boxSizing: 'border-box',
    };

    switch (position) {
      case 'top-right':
        return { ...base, top: 0, right: 0 };
      case 'top-left':
        return { ...base, top: 0, left: 0 };
      case 'top-center':
        return { ...base, top: 0, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
      case 'bottom-left':
        return { ...base, bottom: 0, left: 0 };
      case 'bottom-center':
        return { ...base, bottom: 0, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
      case 'bottom-right':
      default:
        return { ...base, bottom: 0, right: 0 };
    }
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      {toasts.length > 0 && (
        <div className="boost-toast-container" style={getPositionStyles()}>
          {toasts.map((t) => (
            <div key={t.id} style={{ pointerEvents: 'auto', width: '100%' }}>
              <Toast
                id={t.id}
                title={t.title}
                message={t.message}
                variant={t.variant}
                onClose={() => dismiss(t.id)}
              />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    // Fallback safe dummy methods if app is not wrapped with ToastProvider
    return {
      toast: Object.assign(
        (options: ToastOptions) => {
          if (typeof window !== 'undefined') console.log(`[Toast] ${options.message}`);
          return '';
        },
        {
          success: (msg: string) => {
            if (typeof window !== 'undefined') console.log(`[Toast Success] ${msg}`);
            return '';
          },
          error: (msg: string) => {
            if (typeof window !== 'undefined') console.error(`[Toast Error] ${msg}`);
            return '';
          },
          warning: (msg: string) => {
            if (typeof window !== 'undefined') console.warn(`[Toast Warning] ${msg}`);
            return '';
          },
          info: (msg: string) => {
            if (typeof window !== 'undefined') console.info(`[Toast Info] ${msg}`);
            return '';
          },
          loading: (msg: string) => {
            if (typeof window !== 'undefined') console.info(`[Toast Loading] ${msg}`);
            return '';
          },
          promise: async <T,>(p: Promise<T>) => await p,
          dismiss: () => {},
        }
      ),
    };
  }
  return context;
};


Toast.displayName = 'Toast';
