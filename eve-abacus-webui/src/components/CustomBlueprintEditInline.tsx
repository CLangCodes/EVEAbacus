'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CustomBlueprintEditInlineProps {
  isOpen: boolean;
  blueprintTypeId: number;
  currentME: number;
  currentTE: number;
  blueprintName?: string;
  onSave: (materialEfficiency: number, timeEfficiency: number) => void;
  onCancel: () => void;
}

export default function CustomBlueprintEditInline({
  isOpen,
  currentME,
  currentTE,
  blueprintName,
  onSave,
  onCancel
}: CustomBlueprintEditInlineProps) {
  const [materialEfficiency, setMaterialEfficiency] = useState(currentME);
  const [timeEfficiency, setTimeEfficiency] = useState(currentTE);
  const [errors, setErrors] = useState<{ me?: string; te?: string }>({});
  const meInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMaterialEfficiency(currentME);
      setTimeEfficiency(currentTE);
      setErrors({});
      // Focus the ME input when modal opens
      setTimeout(() => meInputRef.current?.focus(), 100);
    }
  }, [isOpen, currentME, currentTE]);

  const validateInputs = () => {
    const newErrors: { me?: string; te?: string } = {};

    if (materialEfficiency < 0 || materialEfficiency > 10) {
      newErrors.me = 'ME must be between 0 and 10';
    }

    if (timeEfficiency < 0 || timeEfficiency > 20) {
      newErrors.te = 'TE must be between 0 and 20';
    }

    if (timeEfficiency % 2 !== 0) {
      newErrors.te = 'TE must be an even number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateInputs()) {
      onSave(materialEfficiency, timeEfficiency);
    }
  };

  const handleCancel = () => {
    setMaterialEfficiency(currentME);
    setTimeEfficiency(currentTE);
    setErrors({});
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Blueprint ME/TE
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {blueprintName && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Blueprint:</p>
            <p className="font-medium text-gray-900 dark:text-white">{blueprintName}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="me-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Material Efficiency (ME)
            </label>
            <input
              ref={meInputRef}
              id="me-input"
              type="number"
              min="0"
              max="10"
              value={materialEfficiency}
              onChange={(e) => setMaterialEfficiency(parseInt(e.target.value) || 0)}
              onKeyDown={handleKeyDown}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.me ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0-10"
            />
            {errors.me && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.me}</p>
            )}
          </div>

          <div>
            <label htmlFor="te-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Efficiency (TE)
            </label>
            <input
              id="te-input"
              type="number"
              min="0"
              max="20"
              step="2"
              value={timeEfficiency}
              onChange={(e) => setTimeEfficiency(parseInt(e.target.value) || 0)}
              onKeyDown={handleKeyDown}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.te ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0-20 (even numbers only)"
            />
            {errors.te && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.te}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 