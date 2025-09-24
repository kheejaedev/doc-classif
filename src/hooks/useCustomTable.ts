import { useState, useMemo } from 'react';

type SortOrder = 'asc' | 'desc';

interface UseTableOptions<T> {
    data: T[];
    initialSortKey?: keyof T;
    initialSortOrder?: SortOrder;
    pageSize?: number;
    filterFn?: (item: T) => boolean;
    searchFn?: (item: T, query: string) => boolean;
}

export function useCustomTable<T>({
    data,
    initialSortKey,
    initialSortOrder = 'asc',
    pageSize = 10,
    filterFn,
    searchFn,
}: UseTableOptions<T>) {
    const [sortKey, setSortKey] = useState<keyof T | undefined>(initialSortKey);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    // Filtering
    const filteredData = useMemo(() => {
        let result = data;
        if (filterFn) result = result.filter(filterFn);
        if (search && searchFn) result = result.filter(item => searchFn(item, search));
        return result;
    }, [data, filterFn, search, searchFn]);

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            if (aValue === bValue) return 0;
            if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
            return aValue < bValue ? 1 : -1;
        });
    }, [filteredData, sortKey, sortOrder]);

    // Pagination
    const total = sortedData.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, page, pageSize]);

    // Handlers
    const handleSort = (key: keyof T) => {
        if (sortKey === key) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return {
        data: paginatedData,
        page,
        totalPages,
        total,
        sortKey,
        sortOrder,
        setSortKey: handleSort,
        setSortOrder,
        setPage: handlePageChange,
        setSearch: handleSearch,
        search,
    };
}