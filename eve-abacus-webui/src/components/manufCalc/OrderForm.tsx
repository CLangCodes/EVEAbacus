'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderFormData } from '@/types/orders';
import { XIcon } from '@/components/Icons';
import { Autocomplete } from '@/components/Autocomplete';
import { apiService, BlueprintValidation } from '@/services/api';

interface OrderFormProps {
  order?: Order | null;
  onSubmit: (formData: OrderFormData) => void;
  onCancel: () => void;
}

export function OrderForm({ order, onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    blueprintName: '',
    activityId: 1,
    copies: 1,
    runs: 1,
    me: 0,
    te: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [blueprintValidation, setBlueprintValidation] = useState<BlueprintValidation | null>(null);

  useEffect(() => {
    if (order) {
      setFormData({
        blueprintName: order.blueprintName,
        activityId: order.activityId,
        copies: order.copies,
        runs: order.runs,
        me: order.me,
        te: order.te,
      });
    }
  }, [order]);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    if (!formData.blueprintName.trim()) {
      newErrors.blueprintName = 'Blueprint name is required';
    }

    if (formData.copies < 1) {
      newErrors.copies = 'Copies must be at least 1';
    }

    if (formData.runs < 1) {
      newErrors.runs = 'Runs must be at least 1';
    }

    if (formData.me < 0 || formData.me > 10) {
      newErrors.me = 'ME must be between 0 and 10';
    }

    if (formData.te < 0 || formData.te > 20) {
      newErrors.te = 'TE must be between 0 and 20';
    }

    setErrors(newErrors);

    // If there are validation errors, don't proceed with blueprint validation
    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    // Validate blueprint if name is provided
    if (formData.blueprintName.trim()) {
      setIsValidating(true);
      try {
        const validation = await apiService.validateBlueprint(formData.blueprintName, formData.activityId);
        if (!validation) {
          newErrors.blueprintName = 'Invalid blueprint name or activity combination';
          setErrors(newErrors);
          setBlueprintValidation(null);g
          setIsValidating(false);
          return false;
        }
        setBlueprintValidation(validation);
      } catch (error) {
        console.error('Blueprint validation error:', error);
        newErrors.blueprintName = 'Failed to validate blueprint';
        setErrors(newErrors);
        setBlueprintValidation(null);
        setIsValidating(false);
        return false;
      } finally {
        setIsValidating(false);
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Only clear blueprint validation if the user is typing in the blueprintName field
    if (field === 'blueprintName') {
      setBlueprintValidation(null);
    }
  };

  const handleNumberInputChange = (field: keyof OrderFormData, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    handleInputChange(field, numValue);
  };

  const handleBlueprintSelect = async (blueprintName: string) => {
    handleInputChange('blueprintName', blueprintName);
    setIsValidating(true);
    try {
      const validation = await apiService.validateBlueprint(blueprintName, formData.activityId);
      setBlueprintValidation(validation);
      if (!validation) {
        setErrors(prev => ({ ...prev, blueprintName: 'Invalid blueprint name or activity combination' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.blueprintName;
          return newErrors;
        });
      }
    } catch (error) {
      setBlueprintValidation(null);
      setErrors(prev => ({ ...prev, blueprintName: 'Failed to validate blueprint' }));
    } finally {
      setIsValidating(false);
    }
  };

  const isSubmitDisabled = !formData.blueprintName.trim() || isValidating || !blueprintValidation;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {order ? 'Edit Order' : 'Create Order'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Blueprint Name with Autocomplete */}
          <Autocomplete
            value={formData.blueprintName}
            onChange={(value) => handleInputChange('blueprintName', value)}
            onSelect={handleBlueprintSelect}
            onSearch={(query) => apiService.searchBlueprints(query)}
            label="Blueprint Name *"
            placeholder="Search blueprints..."
            error={errors.blueprintName}
            minSearchLength={2}
          />

          {/* Blueprint Validation Info */}
          {/*
          {blueprintValidation && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-sm text-green-800 dark:text-green-200">
                <div className="font-medium">Blueprint validated ✓</div>
                <div className="text-xs mt-1">
                  Product: {blueprintValidation.productTypeId}
                </div>
              </div>
            </div>
          )}
          */}
          {/* Activity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activity
            </label>
            <select
              value={formData.activityId}
              onChange={(e) => handleInputChange('activityId', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value={1}>Manufacture</option>
              {/* <option value={3}>TE Research</option> */}
              {/* <option value={4}>ME Research</option> */}
              {/* <option value={5}>Copy</option> */}
              {/* <option value={8}>Invention</option> */}
              {/* <option value={11}>Reaction</option> */}
            </select>
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
                value={formData.copies}
                onChange={(e) => handleNumberInputChange('copies', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.copies ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.copies && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.copies}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Runs *
              </label>
              <input
                type="number"
                min="1"
                value={formData.runs}
                onChange={(e) => handleNumberInputChange('runs', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.runs ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.runs && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.runs}</p>
              )}
            </div>
          </div>

          {/* ME and TE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Material Efficiency (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.me}
                onChange={(e) => handleNumberInputChange('me', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.me ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.me && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.me}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Efficiency (0-20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="2"
                value={formData.te}
                onChange={(e) => handleNumberInputChange('te', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.te ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.te && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.te}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
                isSubmitDisabled
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isValidating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </div>
              ) : (
                order ? 'Update Order' : 'Create Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 