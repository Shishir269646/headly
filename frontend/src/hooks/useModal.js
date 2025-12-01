
import { useState, useCallback } from 'react';


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