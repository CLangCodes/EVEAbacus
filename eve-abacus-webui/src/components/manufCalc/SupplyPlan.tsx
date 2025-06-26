'use client';

import React, { useState } from 'react';
import type { SupplyPlan, ProcurementPlan } from '@/types/manufacturing';

interface SupplyPlanProps {
  supplyPlan: SupplyPlan;
}

interface ProcurementPlanContainerProps {
  procurementPlan: ProcurementPlan}

function ProcurementPlanContainer({ procurementPlan }: ProcurementPlanContainerProps) {
  const exportShoppingList = () => {
    if (procurementPlan.marketImport.length > 0) {
      const exportText = procurementPlan.marketImport.join('\n');
      navigator.clipboard.writeText(exportText);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price (Ƶ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Volume (m³)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {procurementPlan.purchaseRequisitions.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.marketOrder?.volumeRemain || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {((item.item.volume || 0) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Total Cost: {procurementPlan.estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ƶ</p>
          <p>Total Volume: {procurementPlan.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³</p>
        </div>
        <button
          onClick={exportShoppingList}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Export Shopping List for {procurementPlan.stationName}
        </button>
      </div>
    </div>
  );
}

export default function SupplyPlan({ supplyPlan }: SupplyPlanProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!supplyPlan || !supplyPlan.procurementPlans || supplyPlan.procurementPlans.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Supply Plan</h3>
            <p className="mb-4">No supply plan available. Add some orders first.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract solar system names from station names
  const getSolarSystemName = (stationName: string) => {
    const match = stationName.match(/^([\w\-]+)/);
    return match ? match[1] : stationName;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Supply Plan</h2>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Total Cost: {supplyPlan.estimatedTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ƶ</p>
            <p>Total Volume: {supplyPlan.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {supplyPlan.procurementPlans.map((plan, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === index
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                {getSolarSystemName(plan.stationName)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {supplyPlan.procurementPlans[activeTab] && (
            <ProcurementPlanContainer procurementPlan={supplyPlan.procurementPlans[activeTab]} />
          )}
        </div>
      </div>
    </div>
  );
}
