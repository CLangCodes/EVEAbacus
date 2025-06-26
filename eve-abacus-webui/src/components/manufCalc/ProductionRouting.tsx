'use client';

import React from 'react';

interface ProductionRoutingProps {
  productionRoutingString: string[];
}

export default function ProductionRouting({ productionRoutingString }: ProductionRoutingProps) {
  // Ensure productionRoutingString is an array
  const routingString = Array.isArray(productionRoutingString) ? productionRoutingString : [];

  if (!routingString || routingString.length === 0) {
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
          <div className="space-y-2">
            {routingString.map((route, index) => (
              <div key={index} className="text-sm text-gray-700 dark:text-gray-300 py-1">
                {route}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
