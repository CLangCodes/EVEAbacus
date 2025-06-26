'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

interface StationSelectionProps {
  selectedStations: string[];
  onStationsChange: (stations: string[]) => void;
}

export default function StationSelection({ selectedStations, onStationsChange }: StationSelectionProps) {
  const [availableStations, setAvailableStations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize the callback to prevent unnecessary re-renders
  const memoizedOnStationsChange = useCallback(onStationsChange, [onStationsChange]);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        const stations = await apiService.getMarketHubs();
        setAvailableStations(stations);
        
        // If no stations are selected, default to all stations
        if (selectedStations.length === 0) {
          memoizedOnStationsChange(stations);
        }
      } catch (error) {
        console.error('Error loading market hubs:', error);
        // Fallback to default stations
        const defaultStations = [
          'Jita IV - Moon 4 - Caldari Navy Assembly Plant',
          'Amarr VIII (Oris) - Emperor Family Academy', 
          'Dodixie IX - Moon 20 - Federation Navy Assembly Plant',
          'Rens VI - Moon 8 - Brutor Tribe Treasury',
          'Hek VIII - Moon 12 - Boundless Creation Factory'
        ];
        setAvailableStations(defaultStations);
        if (selectedStations.length === 0) {
          memoizedOnStationsChange(defaultStations);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [selectedStations.length, memoizedOnStationsChange]);

  const handleStationToggle = (station: string) => {
    const newSelection = selectedStations.includes(station)
      ? selectedStations.filter(s => s !== station)
      : [...selectedStations, station];
    
    onStationsChange(newSelection);
  };

  const handleSelectAll = () => {
    onStationsChange(availableStations);
  };

  const handleSelectNone = () => {
    onStationsChange([]);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Market Hubs</h3>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading market hubs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Market Hubs</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Select All
          </button>
          <button
            onClick={handleSelectNone}
            className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Select None
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Select the market hubs to include in your manufacturing calculation. 
        The supply plan will show where to buy materials from these locations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableStations.map((station) => {
          const isSelected = selectedStations.includes(station);
          const shortName = station.split(' ')[0]; // Extract first word (e.g., "Jita", "Amarr")
          
          return (
            <label
              key={station}
              className={`
                flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleStationToggle(station)}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {shortName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={station}>
                  {station}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {selectedStations.length === 0 && (
        <div className="text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          ⚠️ No market hubs selected. Please select at least one market hub for the calculation.
        </div>
      )}
    </div>
  );
} 