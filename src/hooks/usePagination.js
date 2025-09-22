import { useState, useMemo } from 'react';

function usePagination({ totalItems, itemsPerPage = 10, initialPage = 1 }) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = useMemo(
        () => Math.ceil(totalItems / itemsPerPage),
        [totalItems, itemsPerPage]
    );

    const startIndex = useMemo(
        () => (currentPage - 1) * itemsPerPage,
        [currentPage, itemsPerPage]
    );

    const endIndex = useMemo(
        () => Math.min(startIndex + itemsPerPage, totalItems),
        [startIndex, itemsPerPage, totalItems]
    );

    const goToPage = (page) => {
        const pageNum = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNum);
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    return {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        goToPage,
        nextPage,
        prevPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
    };
}

export default usePagination;