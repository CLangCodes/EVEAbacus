'use client';

import React from 'react';
import type { Order } from '@/types/orders';

interface OrderCardReadOnlyProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  isSelected?: boolean;
}

export function OrderCardReadOnly({ order, onEdit, onDelete, isSelected = false }: OrderCardReadOnlyProps) {
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

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      onClick={() => onEdit(order)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
            {order.blueprintName}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getActivityName(order.activityId)}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(order.id);
          }}
          className="text-red-500 hover:text-red-700 text-sm ml-2"
          title="Delete order"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Copies:</span>
          <span className="ml-1 font-medium text-gray-900 dark:text-white">
            {order.copies}
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Runs:</span>
          <span className="ml-1 font-medium text-gray-900 dark:text-white">
            {order.runs}
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">ME:</span>
          <span className="ml-1 font-medium text-gray-900 dark:text-white">
            {order.me}
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">TE:</span>
          <span className="ml-1 font-medium text-gray-900 dark:text-white">
            {order.te}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Click to edit • Updated {new Date(order.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 