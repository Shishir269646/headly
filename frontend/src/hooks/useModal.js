// ============================================
// 📄 hooks/useModal.js
// Modal Management Hook
// ============================================

import { useState, useCallback } from 'react';

/**
 * useModal Hook
 * 
 * Purpose: Manage modal/dialog state and data
 * 
 * Features:
 * - Open/close modal
 * - Store and retrieve modal data
 * - Toggle functionality
 * 
 * 
 */
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);


    const open = useCallback((modalData = null) => {
        setData(modalData);
        setIsOpen(true);
    }, []);

    /*
      Close modal and clear data
     */
    const close = useCallback(() => {
        setIsOpen(false);
        // Small delay before clearing data for smooth closing animation
        setTimeout(() => {
            setData(null);
        }, 200);
    }, []);

    /*
      Toggle modal state
     */
    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return {
        isOpen,
        data,
        open,
        close,
        toggle
    };
};