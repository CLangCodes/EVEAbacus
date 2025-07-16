'use client';

import React, { useState } from 'react';
import { Order, OrderFormData } from '@/types/orders';
import { OrderCard } from '@/components/manufCalc/OrderCard';
import { OrderForm } from '@/components/manufCalc/OrderForm';
import { OrderStats } from '@/components/manufCalc/OrderStats';
import { useOrderStorage } from '@/hooks/useOrderStorage';
import { PlusIcon, FilterIcon, SortAscendingIcon } from '@/components/Icons';

interface OrdersProps {
  className?: string;
  orders?: Order[];
  onOrdersChange?: (orders: Order[]) => void;
}

export default function Orders({ className = '', orders: externalOrders, onOrdersChange }: OrdersProps) {
  const { orders: internalOrders, addOrder: internalAddOrder, updateOrder: internalUpdateOrder, deleteOrder: internalDeleteOrder, clearOrders: internalClearOrders, isLoading } = useOrderStorage();
  
  // Use external orders if provided, otherwise use internal orders
  const orders = externalOrders || internalOrders;
  
  // Use external callbacks if provided, otherwise use internal ones
  const addOrder = onOrdersChange ? 
    (order: Order) => {
      const newOrders = [...orders, order];
      onOrdersChange(newOrders);
    } : internalAddOrder;
    
  const updateOrder = onOrdersChange ? 
    (order: Order) => {
      const newOrders = orders.map(o => o.id === order.id ? order : o);
      onOrdersChange(newOrders);
    } : internalUpdateOrder;
    
  const deleteOrder = onOrdersChange ? 
    (orderId: string) => {
      const newOrders = orders.filter(o => o.id !== orderId);
      onOrdersChange(newOrders);
    } : internalDeleteOrder;

  const clearAllOrders = onOrdersChange
    ? () => onOrdersChange([])
    : internalClearOrders;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'blueprintName' | 'copies' | 'runs' | 'me' | 'te'>('blueprintName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleClearAllOrders = () => {
    if (orders.length === 0) return;
    if (confirm('Are you sure you want to delete ALL orders? This cannot be undone.')) {
      clearAllOrders();
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => 
      order.blueprintName.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const handleCreateOrder = (formData: OrderFormData) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addOrder(newOrder);
    setIsFormOpen(false);
  };

  const handleUpdateOrder = (formData: OrderFormData) => {
    if (editingOrder) {
      const updatedOrder: Order = {
        ...editingOrder,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      updateOrder(updatedOrder);
      setEditingOrder(null);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manufacturing Orders</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your blueprint manufacturing orders
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Order
          </button>
          <button
            onClick={handleClearAllOrders}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            disabled={orders.length === 0}
            title="Delete all orders"
          >
            {/* Trash icon SVG inline for now */}
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Orders
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <OrderStats orders={orders} />

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blueprints..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'blueprintName' | 'copies' | 'runs' | 'me' | 'te')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="blueprintName">Name</option>
              <option value="copies">Copies</option>
              <option value="runs">Runs</option>
              <option value="me">ME</option>
              <option value="te">TE</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <SortAscendingIcon className={`w-5 h-5 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="mb-4">Get started by creating your first manufacturing order.</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Order
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
            />
          ))}
        </div>
      )}

      {/* Order Form Modal */}
      {(isFormOpen || editingOrder) && (
        <OrderForm
          order={editingOrder}
          onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingOrder(null);
          }}
        />
      )}
    </div>
  );
}
