'use client';

import React, { useState } from 'react';
import ManufacturingResults from '@/components/manufCalc/ManufacturingResults';
import { apiService } from '@/services/api';
import type { ManufBatch, OrderDTO } from '@/types/manufacturing';

export default function CalculatorTest() {
  const [manufBatch, setManufBatch] = useState<ManufBatch | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestCalculation = async () => {
    setLoading(true);
    try {
      // Create test OrderDTO objects that match the .NET backend expectations
      const testOrderDTOs: OrderDTO[] = [
        {
          blueprintName: 'Tritanium Blueprint',
          activityId: 1,
          copies: 1,
          runs: 10,
          me: 0,
          te: 0
        },
        {
          blueprintName: 'Pyerite Blueprint',
          activityId: 1,
          copies: 2,
          runs: 5,
          me: 2,
          te: 1
        }
      ];

      const request = {
        orderDTOs: testOrderDTOs,
        stationIds: ['60003760', '60008494', '60011866'] // Convert to strings: Jita 4-4, Amarr VIII, Dodixie
      };

      const result = await apiService.getManufacturingBatch(request);
      setManufBatch(result);
    } catch (error) {
      console.error('Error testing manufacturing calculation:', error);
      alert('Error testing manufacturing calculation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manufacturing Calculator Test
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test the manufacturing calculator components
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Test Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Controls
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={handleTestCalculation}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Testing...' : 'Test Manufacturing Calculation'}
              </button>
              <button
                onClick={() => setManufBatch(null)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                Clear Results
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              This will test the manufacturing calculator with sample data and display the results using the new components.
            </p>
          </div>

          {/* Results */}
          <ManufacturingResults manufBatch={manufBatch || undefined} loading={loading} />
        </div>
      </div>
    </div>
  );
} 