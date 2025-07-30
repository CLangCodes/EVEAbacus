'use client';

import React from 'react';
import { DataTable, Column } from '../DataTable';
import { PencilIcon } from '../Icons';
import type { BOMLineItem } from '@/types/manufacturing';

interface BillOfMaterialsProps {
  billOfMaterials: BOMLineItem[];
  onEditInventory?: (typeId: number, currentQuantity: number, itemName?: string) => void;
}

interface MaterialItem extends Record<string, unknown> {
  id: number;
  name: string;
  typeId: number;
  requisitioned: number;
  inventory: number;
  netRequisitioned: number;
  groupName?: string;
  categoryName?: string;
  lowestSellPrice?: number;
  sellStation?: string;
  lowestBuyPrice?: number;
  buyStation?: string;
}

export default function BillOfMaterials({ billOfMaterials, onEditInventory }: BillOfMaterialsProps) {
  // Ensure billOfMaterials is an array
  const materials = Array.isArray(billOfMaterials) ? billOfMaterials : [];

  // Transform BOMLineItem objects to table data
  const materialData: MaterialItem[] = materials.map((material, index) => ({
    id: index + 1,
    name: material.name,
    typeId: material.typeId,
    requisitioned: material.requisitioned,
    inventory: material.inventory || 0,
    netRequisitioned: material.netRequisitioned || 0,
    groupName: material.item?.group?.groupName,
    categoryName: material.item?.group?.category?.categoryName,
    lowestSellPrice: material.lowestSellPrice,
    sellStation: material.sellStation,
    lowestBuyPrice: material.lowestBuyPrice,
    buyStation: material.buyStation
  }));

  const columns: Column<MaterialItem>[] = [
    {
      key: 'name',
      header: 'Material',
      sortable: true,
      width: 'w-60'
    },
    {
      key: 'groupName',
      header: 'Group',
      sortable: true,
      width: 'w-60',
      render: (value) => (value as string) || 'N/A'
    },
    {
      key: 'categoryName',
      header: 'Category',
      sortable: true,
      width: 'w-60',
      render: (value) => (value as string) || 'N/A'
    },
    {
      key: 'requisitioned',
      header: 'Required',
      sortable: true,
      width: 'w-20',
      render: (value) => (value as number)?.toLocaleString() || '0'
    },
    {
      key: 'inventory',
      header: 'Inventory',
      sortable: true,
      width: 'w-20',
      render: (value, row) => {
        const inventory = value as number;
        return (
          <div className="flex items-center justify-between">
            <span className={inventory > 0 ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-400"}>
              {inventory > 0 ? inventory.toLocaleString() : "0"}
            </span>
            {onEditInventory && (
              <button
                onClick={() => onEditInventory(row.typeId as number, inventory, row.name as string)}
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
      width: 'w-20',
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

  ];

  const exportShoppingList = () => {
    if (materials.length > 0) {
      const exportText = materials
        .filter(material => material.requisitioned > (material.inventory || 0))
        .map(material => {
          const netRequired = Math.max(0, material.requisitioned - (material.inventory || 0));
          return `${material.name} x${netRequired.toLocaleString()}`;
        })
        .join('\n');
      navigator.clipboard.writeText(exportText);
    }
  };

  const downloadShoppingList = () => {
    if (materials.length > 0) {
      const exportText = materials
        .filter(material => material.requisitioned > (material.inventory || 0))
        .map(material => {
          const netRequired = Math.max(0, material.requisitioned - (material.inventory || 0));
          return `${material.name} x${netRequired.toLocaleString()}`;
        })
        .join('\n');
      const blob = new Blob([exportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ShoppingList.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Bill of Materials</h3>
            <p className="mb-4">No materials to display. Add some orders first.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        {/* <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"> */}
          {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bill of Materials</h2> */}
        {/* </div> */}
        <DataTable
            data={materialData}
            columns={columns}
            emptyMessage="No materials to display. Add some orders first."
            className="w-full"
            secondarySortKey="name"
          />
        {/* <div className="p-6">
          
        </div> */}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={exportShoppingList}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Export Shopping List
        </button>
        <button
          onClick={downloadShoppingList}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          Download as .txt
        </button>
      </div>
    </div>
  );
}
