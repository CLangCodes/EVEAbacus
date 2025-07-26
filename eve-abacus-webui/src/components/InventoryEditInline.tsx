'use client';

import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';

interface InventoryEditInlineProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quantity: number) => void;
  typeId: number;
  currentQuantity: number;
  itemName?: string;
}

export default function InventoryEditInline({ 
  isOpen, 
  onClose, 
  onSave, 
  typeId, 
  currentQuantity,
  itemName 
}: InventoryEditInlineProps) {
  const [quantity, setQuantity] = useState(currentQuantity.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity(currentQuantity.toString());
      setError('');
    }
  }, [isOpen, currentQuantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      setError('Please enter a valid quantity (0 or greater)');
      return;
    }

    onSave(newQuantity);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
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
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Edit Inventory
            </h3>
            <button
              onClick={onClose}
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {itemName ? `Item: ${itemName}` : `Type ID: ${typeId}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current quantity: <span className="font-medium">{currentQuantity.toLocaleString()}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={handleKeyDown}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter new quantity"
                min="0"
                autoFocus
              />
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
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
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 