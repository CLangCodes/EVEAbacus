'use client';

import React, { useState, useEffect } from 'react';
import { XIcon } from '../Icons';
import type { StockInventory } from '@/types/manufacturing';

interface InventoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (inventoryItem: StockInventory) => void;
  inventoryItem?: StockInventory | null;
  title?: string;
}

export default function InventoryEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  inventoryItem, 
  title = 'Edit Inventory Item' 
}: InventoryEditModalProps) {
  const [formData, setFormData] = useState({
    typeId: '',
    quantity: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or inventory item changes
  useEffect(() => {
    if (isOpen) {
      if (inventoryItem) {
        setFormData({
          typeId: inventoryItem.typeId.toString(),
          quantity: inventoryItem.quantity.toString()
        });
      } else {
        setFormData({
          typeId: '',
          quantity: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, inventoryItem]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.typeId.trim()) {
      newErrors.typeId = 'Type ID is required';
    } else {
      const typeId = parseInt(formData.typeId);
      if (isNaN(typeId) || typeId <= 0) {
        newErrors.typeId = 'Type ID must be a positive number';
      }
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity < 0) {
        newErrors.quantity = 'Quantity must be 0 or greater';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const inventoryItem: StockInventory = {
      typeId: parseInt(formData.typeId),
      quantity: parseInt(formData.quantity)
    };

    onSave(inventoryItem);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="typeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type ID
              </label>
              <input
                type="number"
                id="typeId"
                value={formData.typeId}
                onChange={(e) => handleInputChange('typeId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.typeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter Type ID"
                min="1"
              />
              {errors.typeId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.typeId}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter quantity"
                min="0"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {inventoryItem ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 