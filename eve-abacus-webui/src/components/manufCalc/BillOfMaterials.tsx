'use client';

import React from 'react';

interface BillOfMaterialsProps {
  billOfMaterialsString: string[];
}

export default function BillOfMaterials({ billOfMaterialsString }: BillOfMaterialsProps) {
  // Ensure billOfMaterialsString is an array
  const materialsString = Array.isArray(billOfMaterialsString) ? billOfMaterialsString : [];

  const exportShoppingList = () => {
    if (materialsString.length > 0) {
      const exportText = materialsString.join('\n');
      navigator.clipboard.writeText(exportText);
    }
  };

  const downloadShoppingList = () => {
    if (materialsString.length > 0) {
      const exportText = materialsString.join('\n');
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

  if (!materialsString || materialsString.length === 0) {
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
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bill of Materials</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-2">
            {materialsString.map((material, index) => (
              <div key={index} className="text-sm text-gray-700 dark:text-gray-300 py-1">
                {material}
              </div>
            ))}
          </div>
        </div>
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
