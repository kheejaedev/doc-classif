import { useState, useCallback } from "react";

export function usePaginatedData<T>(data: T[], initialPageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  const getVisibleRows = useCallback(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  // const setPage = (page: number) => {
  //   if (page < 1) {
  //     setCurrentPage(1);
  //   } else if (page > totalPages) {
  //     setCurrentPage(totalPages);
  //   } else {
  //     setCurrentPage(page);
  //   }
  // };

  const setNewPageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return {
    currentPage,
    totalPages, // total number of pages needed
    pageSize, // number of items per page
    totalRows, // total number of items
    getVisibleRows,
    setCurrentPage,
    setPageSize: setNewPageSize,
  };
}
