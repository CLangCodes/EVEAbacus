'use client';

import React from 'react';
import { DataTable, Column } from '../DataTable';
import { DocumentDuplicateIcon, PencilIcon } from '../Icons';
import type { ProductionRoute } from '@/types/manufacturing';
import { useCustomBlueprintStorage } from '@/hooks/useCustomBlueprintStorage';

interface ProductionRoutingProps {
  productionRouting: ProductionRoute[];
  onEditInventory?: (typeId: number, currentQuantity: number, itemName?: string) => void;
  onEditBlueprint?: (blueprintTypeId: number, currentME: number, currentTE: number, blueprintName?: string) => void;
}

interface RouteItem extends Record<string, unknown> {
  id: number;
  blueprintName: string;
  blueprintTypeId: number;
  materialName: string;
  materialTypeId: number;
  requisitioned: number;
  inventory: number;
  netRequisitioned: number;
  copies: number;
  runs: number;
  produced: number;
  me: number;
  te: number;
  producedPerRun: number;
  groupName?: string;
  categoryName?: string;
}

export default function ProductionRouting({ productionRouting, onEditInventory, onEditBlueprint }: ProductionRoutingProps) {
  const { getCustomBlueprint } = useCustomBlueprintStorage();
  
  // Ensure productionRouting is an array
  const routes = Array.isArray(productionRouting) ? productionRouting : [];

  // Transform ProductionRoute objects to table data
  const routeData: RouteItem[] = routes.map((route, index) => {
    // Check for custom blueprint values
    const customBlueprint = getCustomBlueprint(route.blueprintTypeId);
    const hasCustomBlueprint = customBlueprint !== undefined;
    
    // Debug logging
    console.log(`ProductionRouting - Route ${index}:`, {
      blueprintTypeId: route.blueprintTypeId,
      blueprintName: route.blueprintName,
      originalME: route.order.me,
      originalTE: route.order.te,
      customBlueprint,
      hasCustomBlueprint,
      finalME: hasCustomBlueprint ? customBlueprint!.materialEfficiency : route.order.me,
      finalTE: hasCustomBlueprint ? customBlueprint!.timeEfficiency : route.order.te
    });
    
    return {
      id: index + 1,
      blueprintName: route.blueprintName || 'N/A',
      blueprintTypeId: route.blueprintTypeId,
      materialName: route.materialName,
      materialTypeId: route.materialTypeId,
      requisitioned: route.requisitioned,
      inventory: route.inventory || 0,
      netRequisitioned: route.netRequisitioned || 0,
      copies: route.order.copies,
      runs: route.order.runs,
      produced: route.produced,
      me: hasCustomBlueprint ? customBlueprint!.materialEfficiency : route.order.me,
      te: hasCustomBlueprint ? customBlueprint!.timeEfficiency : route.order.te,
      producedPerRun: route.producedPerRun,
      groupName: route.materialMetaData?.group?.groupName,
      categoryName: route.materialMetaData?.group?.category?.categoryName
    };
  });

  const copyBlueprintName = (blueprintName: string) => {
    if (blueprintName && blueprintName !== 'N/A') {
      navigator.clipboard.writeText(blueprintName);
    }
  };

  const copyRuns = (runs: number) => {
    if (runs && runs > 0) {
      navigator.clipboard.writeText(runs.toString());
    }
  };

  const columns: Column<RouteItem>[] = [
    {
      key: 'blueprintName',
      header: 'Blueprint',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center justify-between">
          <span className="truncate">{value as string}</span>
          <button
            onClick={() => copyBlueprintName(row.blueprintName as string)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex-shrink-0 ml-2"
            title="Copy blueprint name to clipboard"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
        </div>
      )
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
      key: 'requisitioned',
      header: 'Required',
      sortable: true,
      render: (value) => (value as number)?.toLocaleString() || '0'
    },
    {
      key: 'inventory',
      header: 'Inventory',
      sortable: true,
      render: (value, row) => {
        const inventory = value as number;
        return (
          <div className="flex items-center justify-between">
            <span className={inventory > 0 ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-400"}>
              {inventory > 0 ? inventory.toLocaleString() : "0"}
            </span>
            {onEditInventory && (
              <button
                onClick={() => onEditInventory(row.materialTypeId as number, inventory, row.materialName as string)}
                className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex-shrink-0 ml-2"
                title="Edit inventory quantity"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      }
    },
    {
      key: 'netRequisitioned',
      header: 'Net Required',
      sortable: true,
      render: (value) => {
        const netRequired = value as number;
        return netRequired > 0 ? (
          <span className="text-red-600 dark:text-red-400 font-medium">
            {netRequired.toLocaleString()}
          </span>
        ) : (
          <span className="text-green-600 dark:text-green-400 font-medium">
            ✓ Covered
          </span>
        );
      }
    },
    {
      key: 'copies',
      header: 'Copies',
      sortable: true
    },
    {
      key: 'runs',
      header: 'Runs',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center justify-between">
          <span className="truncate">{value as number}</span>
          <button
            onClick={() => copyRuns(row.runs as number)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex-shrink-0 ml-2"
            title="Copy runs to clipboard"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      key: 'me',
      header: 'ME',
      sortable: true,
      render: (value, row) => {
        const me = value as number;
        const customBlueprint = getCustomBlueprint(row.blueprintTypeId as number);
        const isCustomValue = customBlueprint !== undefined;
        
        return (
          <div className="flex items-center justify-between">
            <span className={`${isCustomValue ? "text-green-600 dark:text-green-400 font-medium" : me > 0 ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-400"}`}>
              {me}
              {isCustomValue && (
                <span className="ml-1 text-xs text-green-500 dark:text-green-400" title="Custom blueprint value">
                  ★
                </span>
              )}
            </span>
            {onEditBlueprint && (
              <button
                onClick={() => onEditBlueprint(row.blueprintTypeId as number, me, row.te as number, row.blueprintName as string)}
                className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex-shrink-0 ml-2"
                title="Edit blueprint ME/TE"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      }
    },
    {
      key: 'te',
      header: 'TE',
      sortable: true,
      render: (value, row) => {
        const te = value as number;
        const customBlueprint = getCustomBlueprint(row.blueprintTypeId as number);
        const isCustomValue = customBlueprint !== undefined;
        
        return (
          <div className="flex items-center justify-between">
            <span className={`${isCustomValue ? "text-green-600 dark:text-green-400 font-medium" : te > 0 ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-400"}`}>
              {te}
              {isCustomValue && (
                <span className="ml-1 text-xs text-green-500 dark:text-green-400" title="Custom blueprint value">
                  ★
                </span>
              )}
            </span>
            {onEditBlueprint && (
              <button
                onClick={() => onEditBlueprint(row.blueprintTypeId as number, row.me as number, te, row.blueprintName as string)}
                className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex-shrink-0 ml-2"
                title="Edit blueprint ME/TE"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      }
    },

  ];

  if (!routes || routes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Production Routing</h3>
            <p className="mb-4">No production routes found. Add some orders first.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        {/* <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Production Routing</h2>
        </div> */}
        <DataTable
            data={routeData}
            columns={columns}
            emptyMessage="No production routes found. Add some orders first."
            className="w-full"
            secondarySortKey="blueprintName"
          />
        {/* <div className="p-6">
          
        </div> */}
      </div>
    </div>
  );
}
