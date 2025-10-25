import { useState, useCallback } from 'react';

// A more robust unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_DURATION = 3000;

/**
 * A hook for managing toast notifications.
 * Provides utilities to add, remove, and display toasts (success, error, warning, info).
 *
 * @param {object} [options] - Optional configuration.
 * @param {number} [options.defaultDuration=DEFAULT_DURATION] - Default display duration for toasts.
 * @returns {object} Toast management utilities.
 */
export const useToast = ({ defaultDuration = DEFAULT_DURATION } = {}) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (message, type = 'info', duration) => {
            const id = generateId();
            const toastDuration = duration ?? defaultDuration;

            setToasts((prev) => [...prev, { id, message, type }]);

            if (toastDuration) {
                setTimeout(() => {
                    removeToast(id);
                }, toastDuration);
            }
            return id;
        },
        [defaultDuration, removeToast]
    );

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success,
        error,
        warning,
        info,
    };
};