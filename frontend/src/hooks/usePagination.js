
import { useState, useMemo } from 'react';




export const usePagination = (totalItems, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);

    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return { start: indexOfFirstItem, end: indexOfLastItem };
    }, [currentPage, itemsPerPage]);

    const goToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        goToPage(currentPage + 1);
    };

    const prevPage = () => {
        goToPage(currentPage - 1);
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
};