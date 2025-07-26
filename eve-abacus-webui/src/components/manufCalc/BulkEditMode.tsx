'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { DataTable, Column } from '../DataTable';
import { DocumentDuplicateIcon, CheckIcon, XMarkIcon } from '../Icons';
import type { ProductionRoute, BOMLineItem } from '@/types/manufacturing';

interface BulkEditModeProps {
  productionRouting: ProductionRoute[];
  billOfMaterials: BOMLineItem[];
  onSaveChanges: (changes: BulkEditChanges) => void;
  onCancel: () => void;
}

interface BulkEditChanges {
  blueprints: Array<{
    blueprintTypeId: number;
    materialEfficiency: number;
    timeEfficiency: number;
  }>;
  inventory: Array<{
    typeId: number;
    quantity: number;
  }>;
}

interface EditableRouteItem extends Record<string, unknown> {
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
  isBlueprintEditable: boolean;
  parentBlueprintTypeId?: number;
}

interface EditableMaterialItem extends Record<string, unknown> {
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

export default function BulkEditMode({ 
  productionRouting, 
  billOfMaterials, 
  onSaveChanges, 
  onCancel 
}: BulkEditModeProps) {
  const [editableRoutes, setEditableRoutes] = useState<EditableRouteItem[]>([]);
  const [editableMaterials, setEditableMaterials] = useState<EditableMaterialItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize editable data
  useEffect(() => {
    // Filter out user orders (routes with parentBlueprintTypeId of null or 0)
    const filteredRoutes = productionRouting.filter(route => 
      route.order.parentBlueprintTypeId != null && route.order.parentBlueprintTypeId !== 0
    );

    const routes = filteredRoutes.map((route, index) => ({
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
      me: route.order.me,
      te: route.order.te,
      producedPerRun: route.producedPerRun,
      groupName: route.materialMetaData?.group?.groupName,
      categoryName: route.materialMetaData?.group?.category?.categoryName,
      isBlueprintEditable: route.blueprintTypeId > 0 && route.blueprintName !== 'N/A',
      parentBlueprintTypeId: route.order.parentBlueprintTypeId
    }));

    const materials = billOfMaterials.map((material, index) => ({
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

    setEditableRoutes(routes);
    setEditableMaterials(materials);
    setHasChanges(false);
  }, [productionRouting, billOfMaterials]);

  const updateRoute = useCallback((id: number, field: keyof EditableRouteItem, value: string | number) => {
    setEditableRoutes(prev => prev.map(route => {
      if (route.id === id) {
        let validatedValue = value;
        
        // Validate input values
        if (field === 'me') {
          validatedValue = Math.max(0, Math.min(10, Number(value)));
        } else if (field === 'te') {
          validatedValue = Math.max(0, Math.min(20, Number(value)));
          // Ensure TE is even
          validatedValue = Math.floor(Number(validatedValue) / 2) * 2;
        } else if (field === 'inventory') {
          validatedValue = Math.max(0, Number(value));
        }
        
        const updatedRoute = { ...route, [field]: validatedValue };
        // Recalculate net requisitioned when inventory changes
        if (field === 'inventory') {
          updatedRoute.netRequisitioned = Math.max(0, updatedRoute.requisitioned - Number(validatedValue));
        }
        return updatedRoute;
      }
      return route;
    }));
    setHasChanges(true);
  }, []);

  const updateMaterial = useCallback((id: number, field: keyof EditableMaterialItem, value: string | number) => {
    setEditableMaterials(prev => prev.map(material => {
      if (material.id === id) {
        let validatedValue = value;
        
        // Validate input values
        if (field === 'inventory') {
          validatedValue = Math.max(0, Number(value));
        }
        
        const updatedMaterial = { ...material, [field]: validatedValue };
        // Recalculate net requisitioned when inventory changes
        if (field === 'inventory') {
          updatedMaterial.netRequisitioned = Math.max(0, updatedMaterial.requisitioned - Number(validatedValue));
        }
        return updatedMaterial;
      }
      return material;
    }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    // Collect inventory changes from both Production Routing and Bill of Materials
    const routeInventoryChanges = editableRoutes.map(route => ({
      typeId: route.materialTypeId,
      quantity: route.inventory
    }));

    const materialInventoryChanges = editableMaterials.map(material => ({
      typeId: material.typeId,
      quantity: material.inventory
    }));

    // Merge inventory changes, with Bill of Materials taking precedence for duplicates
    const inventoryMap = new Map<number, number>();
    
    // Add route inventory changes first
    routeInventoryChanges.forEach(change => {
      inventoryMap.set(change.typeId, change.quantity);
    });
    
    // Override with material inventory changes (BOM takes precedence)
    materialInventoryChanges.forEach(change => {
      inventoryMap.set(change.typeId, change.quantity);
    });

    const mergedInventoryChanges = Array.from(inventoryMap.entries()).map(([typeId, quantity]) => ({
      typeId,
      quantity
    }));

    const changes: BulkEditChanges = {
      blueprints: editableRoutes
        .filter(route => route.isBlueprintEditable)
        .map(route => ({
          blueprintTypeId: route.blueprintTypeId,
          materialEfficiency: route.me,
          timeEfficiency: route.te
        })),
      inventory: mergedInventoryChanges
    };

    onSaveChanges(changes);
  }, [editableRoutes, editableMaterials, onSaveChanges]);

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

  // Production Routing columns
  const routeColumns: Column<EditableRouteItem>[] = [
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
          <input
            type="number"
            min="0"
            value={inventory}
            onChange={(e) => updateRoute(row.id as number, 'inventory', parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        );
      }
    },
    {
      key: 'netRequisitioned',
      header: 'Net Required',
      sortable: true,
      render: (value) => (value as number)?.toLocaleString() || '0'
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
        if (!row.isBlueprintEditable) {
          return <span className="text-gray-400">{me}</span>;
        }
        return (
          <input
            type="number"
            min="0"
            max="10"
            value={me}
            onChange={(e) => updateRoute(row.id as number, 'me', parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        );
      }
    },
    {
      key: 'te',
      header: 'TE',
      sortable: true,
      render: (value, row) => {
        const te = value as number;
        if (!row.isBlueprintEditable) {
          return <span className="text-gray-400">{te}</span>;
        }
        return (
          <input
            type="number"
            min="0"
            max="20"
            step="2"
            value={te}
            onChange={(e) => updateRoute(row.id as number, 'te', parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        );
      }
    },
  ];

  // Bill of Materials columns
  const materialColumns: Column<EditableMaterialItem>[] = [
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
          <input
            type="number"
            min="0"
            value={inventory}
            onChange={(e) => updateMaterial(row.id as number, 'inventory', parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        );
      }
    },
    {
      key: 'netRequisitioned',
      header: 'Net Required',
      sortable: true,
      width: 'w-20',
      render: (value) => (value as number)?.toLocaleString() || '0'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Save/Cancel buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Bulk Edit Mode
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Edit multiple blueprints and inventory items at once
            {hasChanges && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                Changes pending
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <XMarkIcon className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <CheckIcon className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Production Routing Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Production Routing
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Edit ME/TE values and inventory quantities for blueprints
          </p>
        </div>
        <DataTable
          data={editableRoutes}
          columns={routeColumns}
          emptyMessage="No production routes found."
          className="w-full"
        />
      </div>

      {/* Bill of Materials Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bill of Materials
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Edit inventory quantities for materials
          </p>
        </div>
        <DataTable
          data={editableMaterials}
          columns={materialColumns}
          emptyMessage="No bill of materials found."
          className="w-full"
        />
      </div>
    </div>
  );
} 