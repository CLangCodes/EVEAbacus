'use client';

import React from 'react';
import { Order } from '@/types/orders';
import { 
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  ClockIcon 
} from '@/components/Icons';

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export function OrderCard({ order, onEdit, onDelete }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getActivityName = (activityId: number) => {
    switch (activityId) {
      case 1: return 'Manufacture';
      case 3: return 'TE Research';
      case 4: return 'ME Research';
      case 5: return 'Copy';
      case 8: return 'Invention';
      case 11: return 'Reaction';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words whitespace-normal">
              {order.blueprintName}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {getActivityName(order.activityId)}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(order)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit order"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(order.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete order"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <DocumentDuplicateIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {order.copies}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Copies</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <ClockIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {order.runs}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Runs</div>
          </div>
        </div>

        {/* Efficiency Stats */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Material Efficiency:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {order.me}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(order.me / 10) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Time Efficiency:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {order.te}/20
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(order.te / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {formatDate(order.createdAt)}</span>
            <span>Updated: {formatDate(order.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 