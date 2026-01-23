import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ message, type, onRemove }) => {
    const icons = {
        success: <CheckCircle className="text-green-500" size={18} />,
        error: <AlertCircle className="text-red-500" size={18} />,
        warning: <AlertTriangle className="text-yellow-500" size={18} />,
        info: <Info className="text-blue-500" size={18} />,
    };

    const colors = {
        success: 'border-green-100 bg-white shadow-green-100',
        error: 'border-red-100 bg-white shadow-red-100',
        warning: 'border-yellow-100 bg-white shadow-yellow-100',
        info: 'border-blue-100 bg-white shadow-blue-100',
    };

    return (
        <div className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg 
            animate-in slide-in-from-right fade-in duration-300 min-w-[280px] max-w-md
            ${colors[type]}
        `}>
            {icons[type]}
            <p className="text-sm font-medium text-gray-800 flex-grow">{message}</p>
            <button onClick={onRemove} className="text-gray-400 hover:text-gray-600 transition">
                <X size={16} />
            </button>
        </div>
    );
};
