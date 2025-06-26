'use client';

import React from 'react';
import { Order } from '@/types/orders';
import { 
  DocumentDuplicateIcon, 
  ClockIcon, 
  TrendingUpIcon,
  CogIcon 
} from '@/components/Icons';

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const stats = React.useMemo(() => {
    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalCopies: 0,
        totalRuns: 0,
        averageME: 0,
        averageTE: 0,
      };
    }

    const totalCopies = orders.reduce((sum, order) => sum + order.copies, 0);
    const totalRuns = orders.reduce((sum, order) => sum + order.runs, 0);
    const averageME = orders.reduce((sum, order) => sum + order.me, 0) / orders.length;
    const averageTE = orders.reduce((sum, order) => sum + order.te, 0) / orders.length;

    return {
      totalOrders: orders.length,
      totalCopies,
      totalRuns,
      averageME: Math.round(averageME * 10) / 10,
      averageTE: Math.round(averageTE * 10) / 10,
    };
  }, [orders]);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: DocumentDuplicateIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Copies',
      value: stats.totalCopies,
      icon: DocumentDuplicateIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Runs',
      value: stats.totalRuns,
      icon: ClockIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Avg ME',
      value: `${stats.averageME}/10`,
      icon: TrendingUpIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Avg TE',
      value: `${stats.averageTE}/20`,
      icon: CogIcon,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center">
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 