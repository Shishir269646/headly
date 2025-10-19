
import { useState, useCallback } from 'react';

/**
 * Modal management hook
 * @returns {object} Modal utilities
 */
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);

    const open = useCallback((modalData = null) => {
        setData(modalData);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setData(null);
    }, []);

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


// ব্যবহার উদাহরণ:
// const deleteModal = useModal();
// <button onClick={() => deleteModal.open(contentId)}>Delete</button>
// {deleteModal.isOpen && <Modal onClose={deleteModal.close} />}

