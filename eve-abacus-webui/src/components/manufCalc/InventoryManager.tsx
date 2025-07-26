'use client';

import React, { useState, useCallback } from 'react';
import { DataTable, Column } from '../DataTable';
import { PlusIcon, TrashIcon, PencilIcon } from '../Icons';
import { useInventoryStorage } from '@/hooks/useInventoryStorage';
import InventoryEditModal from './InventoryEditModal';
import type { StockInventory } from '@/types/manufacturing';

interface InventoryManagerProps {
  onInventoryChange?: () => void;
}

interface InventoryItem extends Record<string, unknown> {
  id: number;
  typeId: number;
  quantity: number;
  name?: string;
}

export default function InventoryManager({ onInventoryChange }: InventoryManagerProps) {
  const { inventory, addInventoryItem, deleteInventoryItem, clearInventory } = useInventoryStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockInventory | null>(null);

  // Transform inventory data for table
  const inventoryData: InventoryItem[] = inventory.map((item, index) => ({
    id: index + 1,
    typeId: item.typeId,
    quantity: item.quantity,
    name: `Item ${item.typeId}` // Placeholder - could be enhanced with item names from API
  }));

  const handleAddItem = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const handleEditItem = useCallback((item: InventoryItem) => {
    const stockItem = inventory.find(inv => inv.typeId === item.typeId);
    setEditingItem(stockItem || null);
    setIsModalOpen(true);
  }, [inventory]);

  const handleSaveItem = useCallback((inventoryItem: StockInventory) => {
    addInventoryItem(inventoryItem);
    onInventoryChange?.();
  }, [addInventoryItem, onInventoryChange]);

  const handleDeleteItem = useCallback((typeId: number) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      deleteInventoryItem(typeId);
      onInventoryChange?.();
    }
  }, [deleteInventoryItem, onInventoryChange]);

  const handleClearAll = useCallback(() => {
    if (confirm('Are you sure you want to clear ALL inventory? This cannot be undone.')) {
      clearInventory();
      onInventoryChange?.();
    }
  }, [clearInventory, onInventoryChange]);

  const columns: Column<InventoryItem>[] = [
    {
      key: 'typeId',
      header: 'Type ID',
      sortable: true
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
      render: (value) => (value as number)?.toLocaleString() || '0'
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditItem(row)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            title="Edit inventory item"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteItem(row.typeId)}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            title="Delete inventory item"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Item
          </button>
          {inventory.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <DataTable
          data={inventoryData}
          columns={columns}
          emptyMessage="No inventory items found. Add some items to get started."
          className="w-full"
        />
      </div>

      {/* Summary */}
      {inventory.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Total items in inventory: <span className="font-semibold">{inventory.length}</span> | 
            Total quantity: <span className="font-semibold">{inventory.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}</span>
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <InventoryEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        inventoryItem={editingItem}
        title={editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
      />
    </div>
  );
} 