import React, { useState, useCallback } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.floating-toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
}

.floating-toast {
  background: #ffffff;
  border: 1.5px solid #f1f5f9;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  width: fit-content;
  min-width: 300px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
  animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: auto;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-toast::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #16a34a;
  border-radius: 16px 0 0 16px;
}

.floating-toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 6px 16px rgba(0, 0, 0, 0.06);
  border-color: #bbf7d0;
}

.floating-toast.success {
  border-color: #f1f5f9;
}

.floating-toast.success::before {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
}

.floating-toast.error {
  border-color: #fecaca;
}

.floating-toast.error::before {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.floating-toast.warning {
  border-color: #fed7aa;
}

.floating-toast.warning::before {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.floating-toast.info {
  border-color: #bfdbfe;
}

.floating-toast.info::before {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.floating-icon-wrapper {
  width: 44px;
  height: 44px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
}

.floating-toast:hover .floating-icon-wrapper {
  transform: scale(1.08);
}

.floating-toast.success .floating-icon-wrapper {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.floating-toast.error .floating-icon-wrapper {
  background: #fef2f2;
  border-color: #fecaca;
}

.floating-toast.warning .floating-icon-wrapper {
  background: #fffbeb;
  border-color: #fed7aa;
}

.floating-toast.info .floating-icon-wrapper {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.floating-icon {
  font-size: 18px;
  font-weight: 700;
  color: #16a34a;
}

.floating-toast.error .floating-icon {
  color: #dc2626;
}

.floating-toast.warning .floating-icon {
  color: #f59e0b;
}

.floating-toast.info .floating-icon {
  color: #3b82f6;
}

.floating-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.floating-text {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
  line-height: 1.4;
}

.floating-message {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.5;
}

.floating-close {
  background: #f8fafc;
  border: 1.5px solid #f1f5f9;
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
  opacity: 0.7;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-weight: 600;
}

.floating-close:hover {
  opacity: 1;
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
  transform: rotate(90deg);
}

.floating-toast.error .floating-close:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.floating-toast.warning .floating-close:hover {
  background: #fffbeb;
  border-color: #fed7aa;
  color: #f59e0b;
}

.floating-toast.info .floating-close:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #3b82f6;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(400px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(400px) scale(0.95);
  }
}

.floating-toast.hide {
  animation: slideOutRight 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Progress bar */
.floating-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #f1f5f9;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}

.floating-progress-bar {
  height: 100%;
  background: #16a34a;
  border-radius: 0 0 16px 16px;
  animation: progressShrink linear forwards;
}

.floating-toast.error .floating-progress-bar {
  background: #dc2626;
}

.floating-toast.warning .floating-progress-bar {
  background: #f59e0b;
}

.floating-toast.info .floating-progress-bar {
  background: #3b82f6;
}

@keyframes progressShrink {
  from { width: 100%; }
  to { width: 0%; }
}

@media (max-width: 640px) {
  .floating-toast-container {
    left: 16px;
    right: 16px;
    top: 16px;
    max-width: unset;
  }

  .floating-toast {
    width: 100% !important;
    min-width: unset;
    padding: 14px 16px;
  }

  .floating-icon-wrapper {
    width: 38px;
    height: 38px;
  }

  .floating-icon {
    font-size: 16px;
  }

  .floating-text {
    font-size: 0.8125rem;
  }

  .floating-message {
    font-size: 0.6875rem;
  }

  .floating-close {
    width: 26px;
    height: 26px;
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .floating-toast {
    gap: 10px;
    padding: 12px 14px;
  }

  .floating-icon-wrapper {
    width: 34px;
    height: 34px;
  }

  .floating-close {
    width: 24px;
    height: 24px;
  }
}
`;

/**
 * Floating Toast Context
 */
export const FloatingToastContext = React.createContext();

export function FloatingToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options = {}) => {
    const {
      message = 'Notification',
      title = null,
      type = 'success', // success, error, warning, info
      icon = null,
      duration = 4000,
    } = options;

    const id = Date.now() + Math.random();

    const newToast = {
      id,
      message,
      title,
      type,
      icon,
      duration,
    };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // NEW: showToast method for backward compatibility
  const showToast = useCallback((message, type = 'success') => {
    return addToast({
      message,
      type,
      duration: 4000,
    });
  }, [addToast]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <FloatingToastContext.Provider value={{ addToast, showToast, removeToast }}>
      {children}
      <FloatingToastContainer toasts={toasts} onRemove={removeToast} />
    </FloatingToastContext.Provider>
  );
}

function FloatingToastContainer({ toasts, onRemove }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="floating-toast-container">
        {toasts.map(toast => (
          <FloatingToastItem
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </div>
    </>
  );
}

function FloatingToastItem({ toast, onRemove }) {
  const [isHiding, setIsHiding] = React.useState(false);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 350);
  };

  const getIcon = () => {
    if (toast.icon) return toast.icon;
    
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div className={`floating-toast ${toast.type} ${isHiding ? 'hide' : ''}`}>
      <div className="floating-icon-wrapper">
        <div className="floating-icon">{getIcon()}</div>
      </div>
      <div className="floating-content">
        <div className="floating-text">{toast.message}</div>
        {toast.title && (
          <div className="floating-message">{toast.title}</div>
        )}
      </div>
      <button className="floating-close" onClick={handleClose} aria-label="Close">
        ×
      </button>
      {toast.duration > 0 && (
        <div className="floating-progress">
          <div 
            className="floating-progress-bar" 
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Hook to use Floating Toast
 */
export function useFloatingToast() {
  const context = React.useContext(FloatingToastContext);
  if (!context) {
    console.error('useFloatingToast must be used within FloatingToastProvider');
    // Return a fallback function instead of throwing
    return {
      addToast: (options) => console.log('[Toast]', options),
      showToast: (message, type) => console.log(`[Toast - ${type}]`, message),
      removeToast: () => {},
    };
  }
  return context;
}

export default FloatingToastProvider;