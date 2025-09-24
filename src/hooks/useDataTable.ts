import { useState, useMemo, useCallback } from 'react';

interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => any;
  isSortable?: boolean;
  isSearchable?: boolean;
  filterFn?: (value: string, rowValue: any) => boolean;
  sortFn?: (a: any, b: any) => number;
  Cell?: (row: T) => React.ReactNode;
}

interface UseTableOptions<T> {
  data: T[];
  columns: Column<T>[];
  initialPageSize?: number;
}

interface UseTableResult<T> {
  columns: Array<
    Column<T> & {
      setFilterValue: (value: string) => void;
      getFilterValue: () => string;
      getToggleSortingHandler: () => void;
      sortingOrder: 'asc' | 'desc' | null;
    }
  >;
  getVisibleRows: () => T[];
  totalRows: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

function useTable<T>({
  data,
  columns: initialColumns,
  initialPageSize = 10,
}: UseTableOptions<T>): UseTableResult<T> {
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<{ columnId: string; order: 'asc' | 'desc' | null } | null>(null);
  const [currentPage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  // const sortingRef = useRef(sorting);

  // Setup columns with sorting and filtering handlers
  const columns = useMemo(() => {
    return initialColumns.map((col) => ({
      ...col,
      setFilterValue: (value: string) => {
        if (col.isSearchable) {
          setColumnFilters((prev) => ({ ...prev, [col.id]: value }));
          setPage(1); // Reset to the first page when filters change
        }
      },
      getFilterValue: () => columnFilters[col.id] || '',
      getToggleSortingHandler: () => {
        if (col.isSortable) {
          setSorting((prev) => {
            if (prev?.columnId === col.id) {
              return prev.order === 'asc'
                ? { columnId: col.id, order: 'desc' }
                : prev.order === 'desc'
                ? null
                : { columnId: col.id, order: 'asc' };
            }
            return { columnId: col.id, order: 'asc' };
          });
          setPage(1); // Reset to the first page when sorting changes
        }
      },
      sortingOrder: sorting?.columnId === col.id ? sorting.order : null,
    }));
  }, [initialColumns, columnFilters, sorting]);

  // Filter the data based on column filters
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((column) => {
        const filterValue = columnFilters[column.id];
        if (!filterValue || !column.isSearchable) return true;

        const rowValue = column.accessor(row);
        const filterFn =
          column.filterFn ||
          ((value: string, rowValue: any) =>
            String(rowValue).toLowerCase().includes(value.toLowerCase()));

        return filterFn(filterValue, rowValue);
      })
    );
  }, [data, columns, columnFilters]);

  // Sort the filtered data based on the sorting state
  const sortedData = useMemo(() => {
    if (!sorting) return filteredData;

    const { columnId, order } = sorting;
    const column = columns.find((col) => col.id === columnId);

    if (!column || !order || !column.isSortable) return filteredData;

    const sortFn = column.sortFn || ((a, b) => String(a).localeCompare(String(b)));

    return [...filteredData].sort((a, b) => {
      const aValue = column.accessor(a);
      const bValue = column.accessor(b);
      return order === 'asc' ? sortFn(aValue, bValue) : sortFn(bValue, aValue);
    });
  }, [filteredData, sorting, columns]);

  // Pagination logic
  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  // Get visible rows based on filters, sorting, and pagination
  const getVisibleRows = useCallback(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  return {
    columns,
    getVisibleRows,
    totalRows,
    totalPages,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
  };
}

export default useTable;