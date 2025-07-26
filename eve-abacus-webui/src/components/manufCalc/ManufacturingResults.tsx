'use client';

import React, { useState } from 'react';
import type { ManufBatch } from '@/types/manufacturing';
import BillOfMaterials from './BillOfMaterials';
import ProductionRouting from './ProductionRouting';
import SupplyPlan from './SupplyPlan';
import MarketAnalysis from './MarketAnalysis';
import BulkEditMode from './BulkEditMode';

interface ManufacturingResultsProps {
  manufBatch?: ManufBatch;
  loading?: boolean;
  onEditInventory?: (typeId: number, currentQuantity: number, itemName?: string) => void;
  onEditBlueprint?: (blueprintTypeId: number, currentME: number, currentTE: number, blueprintName?: string) => void;
  onBulkEditSave?: (changes: {
    blueprints: Array<{
      blueprintTypeId: number;
      materialEfficiency: number;
      timeEfficiency: number;
    }>;
    inventory: Array<{
      typeId: number;
      quantity: number;
    }>;
  }) => void;
}

export default function ManufacturingResults({ 
  manufBatch, 
  loading = false, 
  onEditInventory, 
  onEditBlueprint,
  onBulkEditSave 
}: ManufacturingResultsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);

  const tabs = [
    { id: 0, name: 'Bill of Materials', icon: '📋' },
    { id: 1, name: 'Production Routing', icon: '🏭' },
    { id: 2, name: 'Supply Plan', icon: '📦' },
    { id: 3, name: 'Market Analysis', icon: '📊' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Calculating...</h3>
            <p className="mb-4">Please wait while we analyze your manufacturing orders.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!manufBatch) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Manufacturing Results</h3>
            <p className="mb-4">No manufacturing data available. Add some orders and calculate to see results.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleBulkEditSave = (changes: any) => {
    if (onBulkEditSave) {
      onBulkEditSave(changes);
    }
    setIsBulkEditMode(false);
  };

  const handleBulkEditCancel = () => {
    setIsBulkEditMode(false);
  };

  // If in bulk edit mode, show the bulk edit component
  if (isBulkEditMode) {
    return (
      <BulkEditMode
        productionRouting={manufBatch.productionRouting || []}
        billOfMaterials={manufBatch.billOfMaterials || []}
        onSaveChanges={handleBulkEditSave}
        onCancel={handleBulkEditCancel}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <BillOfMaterials 
            billOfMaterials={manufBatch.billOfMaterials || []} 
            onEditInventory={onEditInventory}
          />
        );
      case 1:
        return <ProductionRouting productionRouting={manufBatch.productionRouting || []} onEditInventory={onEditInventory} onEditBlueprint={onEditBlueprint} />;
      case 2:
        console.log('Supply Plan Debug:', {
          hasSupplyPlan: !!manufBatch.supplyPlan,
          supplyPlan: manufBatch.supplyPlan,
          procurementPlans: manufBatch.supplyPlan?.procurementPlans,
          procurementPlansLength: manufBatch.supplyPlan?.procurementPlans?.length
        });
        return manufBatch.supplyPlan ? <SupplyPlan supplyPlan={manufBatch.supplyPlan} /> : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Supply Plan</h3>
              <p className="mb-4">No supply plan available for this calculation.</p>
            </div>
          </div>
        );
      case 3:
        return <MarketAnalysis marketProfile={manufBatch.marketProfile} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        {/* Tab Navigation with Bulk Edit Button */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6">
            <nav className="-mb-px flex flex-wrap gap-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
            
            {/* Bulk Edit Button - only show for BOM and Production Routing tabs */}
            {(activeTab === 0 || activeTab === 1) && onBulkEditSave && (
              <button
                onClick={() => setIsBulkEditMode(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                title="Edit multiple blueprints and inventory items at once"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Bulk Edit
              </button>
            )}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 