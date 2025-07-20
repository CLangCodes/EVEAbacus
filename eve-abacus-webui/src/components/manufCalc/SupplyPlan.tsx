'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '../DataTable';
import type { SupplyPlan, ProcurementPlan } from '@/types/manufacturing';

interface SupplyPlanProps {
  supplyPlan: SupplyPlan;
}

interface ProcurementPlanContainerProps {
  procurementPlan: ProcurementPlan;
}

interface PurchaseRequisitionItem extends Record<string, unknown> {
  id: number;
  name: string;
  quantity: number;
  volumeRemain: number;
  price: number;
  volume: number;
  stationName: string;
}

function ProcurementPlanContainer({ procurementPlan }: ProcurementPlanContainerProps) {
  // Transform PurchaseRequisition objects to table data
  const requisitionData: PurchaseRequisitionItem[] = procurementPlan.purchaseRequisitions.map((item, index) => ({
    id: index + 1,
    name: item.name,
    quantity: item.quantity,
    groupName: item.item.group.groupName,
    categoryName: item.item.group.category.categoryName,
    volumeRemain: item.marketOrder?.volumeRemain || 0,
    price: item.price,
    volume: (item.item.volume || 0) * item.quantity,
    stationName: procurementPlan.stationName
  }));

  const columns: Column<PurchaseRequisitionItem>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      width: 'w-60'
    },
    {
      key: 'quantity',
      header: 'Qty',
      sortable: true,
      width: 'w-20',
      render: (value) => (value as number)?.toLocaleString() || '0'
    },
    {
      key: 'groupName',
      header: 'Group',
      sortable: true,
      render: (value) => (value as string) || 'N/A'
    },
    {
      key: 'categoryName',
      header: 'Category',
      sortable: true,
      render: (value) => (value as string) || 'N/A'
    },
    {
      key: 'volumeRemain',
      header: 'Remaining',
      sortable: true,
      width: 'w-20',
      render: (value) => (value as number)?.toLocaleString() || '0'
    },
    {
      key: 'price',
      header: 'Price (Ƶ)',
      sortable: true,
      width: 'w-32',
      render: (value) => (value as number)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'
    },
    {
      key: 'volume',
      header: 'Volume (m³)',
      sortable: true,
      width: 'w-32',
      render: (value) => (value as number)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'
    }
  ];

  const exportShoppingList = () => {
    if (procurementPlan.marketImport.length > 0) {
      const exportText = procurementPlan.marketImport.join('\n');
      navigator.clipboard.writeText(exportText);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <DataTable
            data={requisitionData}
            columns={columns}
            emptyMessage="No purchase requisitions to display."
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Station Total Cost: {procurementPlan.estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ƶ</p>
          <p>Station Total Volume: {procurementPlan.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³</p>
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
        {/* <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Supply Plan</h2>
          
        </div> */}
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
        {/* Tabs */}
        {/* <div className="border-b border-gray-200 dark:border-gray-700">
          
        </div> */}

        {/* Tab Content */}
        <div className="p-6">
          {supplyPlan.procurementPlans[activeTab] && (
            <ProcurementPlanContainer procurementPlan={supplyPlan.procurementPlans[activeTab]} />
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Total Cost: {supplyPlan.estimatedTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ƶ</p>
            <p>Total Volume: {supplyPlan.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³</p>
          </div>
      </div>
    </div>
  );
}
