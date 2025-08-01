'use client';

import React, { useState, useMemo } from 'react';
import { Pagination } from './Pagination';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  // Secondary sorting prop
  secondarySortKey?: keyof T | string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  pageSize = 25,
  onPageChange,
  showPagination = false,
  secondarySortKey
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // If primary sort values are equal and we have a secondary sort key, sort by that
      if (comparison === 0 && secondarySortKey && sortConfig.key !== secondarySortKey) {
        const aSecondaryValue = a[secondarySortKey];
        const bSecondaryValue = b[secondarySortKey];

        if (aSecondaryValue === null || aSecondaryValue === undefined) return 1;
        if (bSecondaryValue === null || bSecondaryValue === undefined) return -1;

        if (typeof aSecondaryValue === 'string' && typeof bSecondaryValue === 'string') {
          comparison = aSecondaryValue.localeCompare(bSecondaryValue);
        } else if (typeof aSecondaryValue === 'number' && typeof bSecondaryValue === 'number') {
          comparison = aSecondaryValue - bSecondaryValue;
        }
      }

      return comparison;
    });
  }, [data, sortConfig, secondarySortKey]);

  const handleSort = (key: keyof T | string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: keyof T | string) => {
    if (sortConfig?.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 h-8 mb-2 rounded"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 h-12 mb-1 rounded"></div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                  } ${column.width || ''}`}
                  style={{
                    minWidth: column.width?.includes('w-8') ? '32px' : undefined,
                    width: column.width?.includes('w-8') ? 'auto' : undefined
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span className="truncate">{column.header}</span>
                    {column.sortable && (
                      <span className="text-xs flex-shrink-0">{getSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-2 py-1 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600"
                    style={{
                      minWidth: column.width?.includes('w-8') ? '32px' : undefined,
                      width: column.width?.includes('w-8') ? 'auto' : undefined
                    }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]?.toString() || 'N/A'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showPagination && onPageChange && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
} 