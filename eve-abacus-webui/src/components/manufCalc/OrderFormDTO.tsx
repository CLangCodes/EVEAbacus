'use client';

import React, { useState } from 'react';
import { Autocomplete } from '@/components/Autocomplete';
import { apiService } from '@/services/api';
import type { EditableOrderDTO } from '@/hooks/useOrderCookies';

interface OrderFormDTOProps {
  editingOrder: EditableOrderDTO;
  onUpdate: (field: keyof EditableOrderDTO, value: string | number) => void;
  onSave: () => Promise<boolean>;
  onCancel: () => void;
  isValidating: boolean;
}

export function OrderFormDTO({ 
  editingOrder, 
  onUpdate, 
  onSave, 
  onCancel, 
  isValidating 
}: OrderFormDTOProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBlueprintSearch = async (searchTerm: string): Promise<string[]> => {
    return await apiService.searchBlueprints(searchTerm);
  };

  const handleBlueprintSelect = async (blueprintName: string) => {
    onUpdate('blueprintName', blueprintName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onSave();
      if (!success) {
        // Validation failed, form will show errors
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error saving order:', error);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof EditableOrderDTO, value: string | number) => {
    onUpdate(field, value);
  };

  const handleNumberInputChange = (field: keyof EditableOrderDTO, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    onUpdate(field, numValue);
  };

  const isSubmitDisabled = !editingOrder.blueprintName.trim() || isValidating || isSubmitting;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {editingOrder.id ? 'Edit Order' : 'Create New Order'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Blueprint Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Blueprint Name *
          </label>
          <Autocomplete
            value={editingOrder.blueprintName}
            onChange={(value) => handleInputChange('blueprintName', value)}
            onSelect={handleBlueprintSelect}
            onSearch={handleBlueprintSearch}
            placeholder="Enter blueprint name..."
            minSearchLength={2}
            error={editingOrder.errors.blueprintName}
          />
        </div>

        {/* Activity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activity *
          </label>
          <select
            value={editingOrder.activityId}
            onChange={(e) => handleInputChange('activityId', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              editingOrder.errors.activityId 
                ? 'border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value={1}>Manufacturing</option>
            <option value={3}>Research Time</option>
            <option value={4}>Research Material</option>
            <option value={5}>Copying</option>
            <option value={7}>Reverse Engineering</option>
            <option value={8}>Invention</option>
          </select>
          {editingOrder.errors.activityId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {editingOrder.errors.activityId}
            </p>
          )}
        </div>

        {/* Copies and Runs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Copies *
            </label>
            <input
              type="number"
              min="1"
              value={editingOrder.copies}
              onChange={(e) => handleNumberInputChange('copies', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                editingOrder.errors.copies 
                  ? 'border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {editingOrder.errors.copies && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {editingOrder.errors.copies}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Runs *
            </label>
            <input
              type="number"
              min="1"
              value={editingOrder.runs}
              onChange={(e) => handleNumberInputChange('runs', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                editingOrder.errors.runs 
                  ? 'border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {editingOrder.errors.runs && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {editingOrder.errors.runs}
              </p>
            )}
          </div>
        </div>

        {/* ME and TE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ME (0-10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={editingOrder.me}
              onChange={(e) => handleNumberInputChange('me', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                editingOrder.errors.me 
                  ? 'border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {editingOrder.errors.me && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {editingOrder.errors.me}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              TE (0-20)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={editingOrder.te}
              onChange={(e) => handleNumberInputChange('te', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                editingOrder.errors.te 
                  ? 'border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {editingOrder.errors.te && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {editingOrder.errors.te}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving...' : (editingOrder.id ? 'Update Order' : 'Create Order')}
          </button>
        </div>

        {/* Validation Status */}
        {isValidating && (
          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Validating blueprint...
          </div>
        )}
      </form>
    </div>
  );
} 