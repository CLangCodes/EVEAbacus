'use client';

import React from 'react';
import { DataTable, Column } from '../DataTable';
import type { ProductionRoute } from '@/types/manufacturing';

interface ProductionRoutingProps {
  productionRouting: ProductionRoute[];
}

interface RouteItem extends Record<string, unknown> {
  id: number;
  blueprintName: string;
  materialName: string;
  requisitioned: number;
  copies: number;
  runs: number;
  produced: number;
  me: number;
  te: number;
  producedPerRun: number;
  groupName?: string;
  categoryName?: string;
}

export default function ProductionRouting({ productionRouting }: ProductionRoutingProps) {
  // Ensure productionRouting is an array
  const routes = Array.isArray(productionRouting) ? productionRouting : [];

  // Transform ProductionRoute objects to table data
  const routeData: RouteItem[] = routes.map((route, index) => ({
    id: index + 1,
    blueprintName: route.blueprintName || 'N/A',
    materialName: route.materialName,
    requisitioned: route.requisitioned,
    copies: route.order.copies,
    runs: route.order.runs,
    produced: route.produced,
    me: route.order.me,
    te: route.order.te,
    producedPerRun: route.producedPerRun,
    groupName: route.materialMetaData?.group?.groupName,
    categoryName: route.materialMetaData?.group?.category?.categoryName
  }));

  const columns: Column<RouteItem>[] = [
    {
      key: 'blueprintName',
      header: 'Blueprint',
      sortable: true
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
      header: 'Qty',
      sortable: true,
      render: (value) => (value as number)?.toLocaleString() || '0'
    },
    {
      key: 'copies',
      header: 'Copies',
      sortable: true
    },
    {
      key: 'runs',
      header: 'Runs',
      sortable: true
    },
    {
      key: 'produced',
      header: 'Produced',
      sortable: true,
      render: (value) => (value as number)?.toLocaleString() || '0'
    },
    {
      key: 'producedPerRun',
      header: 'Per Run',
      sortable: true
    },
    {
      key: 'me',
      header: 'ME',
      sortable: true
    },
    {
      key: 'te',
      header: 'TE',
      sortable: true
    }
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
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Production Routing</h2>
        </div>
        
        <div className="p-6">
          <DataTable
            data={routeData}
            columns={columns}
            emptyMessage="No production routes found. Add some orders first."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
