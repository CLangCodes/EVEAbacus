'use client';

import React, { useState, useMemo } from 'react';
import { DataTable, Column } from '../DataTable';
import type { Order } from '@/types/orders';

interface OrdersDataGridProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  editingOrderId?: string;
  className?: string;
}

interface OrderTableRow extends Order, Record<string, unknown> {
  activityName: string;
  totalRuns: number;
  lastUpdated: string;
}

export function OrdersDataGrid({ 
  orders, 
  onEdit, 
  onDelete, 
  editingOrderId,
  className = "" 
}: OrdersDataGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTerm] = useState('');

  const getActivityName = (activityId: number) => {
    switch (activityId) {
      case 1: return 'Manufacturing';
      case 3: return 'Research Time';
      case 4: return 'Research Material';
      case 5: return 'Copying';
      case 7: return 'Reverse Engineering';
      case 8: return 'Invention';
      default: return `Activity ${activityId}`;
    }
  };

  // Transform and filter orders to table data
  const tableData: OrderTableRow[] = useMemo(() => {
    const filteredOrders = orders.filter(order => 
      order.blueprintName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filteredOrders.map(order => ({
      ...order,
      activityName: getActivityName(order.activityId),
      totalRuns: order.copies * order.runs,
      lastUpdated: new Date(order.updatedAt).toLocaleDateString()
    }));
  }, [orders, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(tableData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const columns: Column<OrderTableRow>[] = [
    {
      key: 'blueprintName',
      header: 'Blueprint',
      sortable: true,
      width: 'min-w-32 flex-1',
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white truncate" title={value as string}>
          {(value as string) || '(empty)'}
        </div>
      )
    },
    {
      key: 'copies',
      header: 'C:',
      sortable: true,
      width: 'w-8',
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white text-center block">
          {value as number}
        </span>
      )
    },
    {
      key: 'runs',
      header: 'R:',
      sortable: true,
      width: 'w-8',
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white text-center block">
          {value as number}
        </span>
      )
    },
    {
      key: 'totalRuns',
      header: '#',
      sortable: true,
      width: 'w-8',
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white text-center block">
          {value as number}
        </span>
      )
    },
    {
      key: 'me',
      header: 'ME',
      sortable: true,
      width: 'w-8',
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-400 text-center block">
          {value as number}
        </span>
      )
    },
    {
      key: 'te',
      header: 'TE',
      sortable: true,
      width: 'w-8',
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-400 text-center block">
          {value as number}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      width: 'w-8',
      render: (_, row) => (
        <div className="flex items-center justify-center space-x-0.5">
          <button
            onClick={() => onEdit(row)}
            className={`p-0.5 rounded text-sm transition-colors ${
              editingOrderId === row.id
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
            title="Edit order"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-0.5 rounded text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete order"
          >
            🗑️
          </button>
        </div>
      )
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={className}>
      {/* Search Input */}
      {/* <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search blueprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div> */}

      <DataTable
        data={paginatedData}
        columns={columns}
        emptyMessage="No orders found. Add your first order to get started."
        className="w-full"
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={tableData.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        showPagination={tableData.length > pageSize}
      />
    </div>
  );
} 