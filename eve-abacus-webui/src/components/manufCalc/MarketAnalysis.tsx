'use client';

import React from 'react';
import type { MarketProfile } from '@/types/manufacturing';

interface MarketAnalysisProps {
  marketProfile?: MarketProfile;
}

export default function MarketAnalysis({ marketProfile }: MarketAnalysisProps) {
  if (!marketProfile) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Market Analysis</h3>
            <p className="mb-4">No market data available. Add some orders first.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Market Analysis</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Material Cost */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Material Cost</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(marketProfile.materialCost)} Ƶ
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue from Sell Orders */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue (Sell)</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(marketProfile.revenueSellOrder)} Ƶ
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue from Buy Orders */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue (Buy)</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(marketProfile.revenueBuyOrder)} Ƶ
                  </p>
                </div>
              </div>
            </div>

            {/* Profit from Sell Orders */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit (Sell)</p>
                  <p className={`text-lg font-semibold ${getProfitColor(marketProfile.profitSellOrder)}`}>
                    {formatCurrency(marketProfile.profitSellOrder)} Ƶ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profit Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Profit from Sell Orders:</span>
                  <span className={`text-sm font-medium ${getProfitColor(marketProfile.profitSellOrder)}`}>
                    {formatCurrency(marketProfile.profitSellOrder)} Ƶ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Profit from Buy Orders:</span>
                  <span className={`text-sm font-medium ${getProfitColor(marketProfile.profitBuyOrder)}`}>
                    {formatCurrency(marketProfile.profitBuyOrder)} Ƶ
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Total Revenue:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(marketProfile.revenueSellOrder + marketProfile.revenueBuyOrder)} Ƶ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cost Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Material Cost:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(marketProfile.materialCost)} Ƶ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Revenue (Sell):</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(marketProfile.revenueSellOrder)} Ƶ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Revenue (Buy):</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(marketProfile.revenueBuyOrder)} Ƶ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
