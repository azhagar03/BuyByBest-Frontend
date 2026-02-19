import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div 
        className="position-fixed top-0 end-0 p-3" 
        style={{ zIndex: 9999 }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`alert alert-${
              toast.type === 'success' ? 'success' :
              toast.type === 'error' ? 'danger' :
              'info'
            } alert-dismissible fade show mb-2`}
            role="alert"
            style={{ minWidth: '250px' }}
          >
            {toast.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            ></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;