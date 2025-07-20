'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/services/api';
import type { ManufBatch, OrderDTO } from '@/types/manufacturing';
import type { Order } from '@/types/orders';
import { PlusIcon, TrashIcon, FilterIcon, SortAscendingIcon } from '@/components/Icons';
import { useOrderCookies } from '@/hooks/useOrderCookies';
import { OrderFormDTO } from '@/components/manufCalc/OrderFormDTO';
import { OrderCardReadOnly } from '@/components/manufCalc/OrderCardReadOnly';
import ManufacturingResults from '@/components/manufCalc/ManufacturingResults';

export default function ManufacturingCalculatorUnified() {
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [manufBatch, setManufBatch] = useState<ManufBatch | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'blueprintName' | 'copies' | 'runs' | 'me' | 'te'>('blueprintName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Available stations
  const availableStations = ['Jita 4-4', 'Amarr VIII', 'Dodixie', 'Rens', 'Hek'];

  // Load selected stations from localStorage on mount
  useEffect(() => {
    const loadSelectedStations = () => {
      try {
        const savedStations = localStorage.getItem('manufacturing-selected-stations');
        if (savedStations) {
          const parsedStations = JSON.parse(savedStations);
          setSelectedStations(parsedStations);
        } else {
          // Default to all stations selected
          setSelectedStations(availableStations);
        }
      } catch (error) {
        console.error('Error loading selected stations:', error);
        // Fallback to all stations selected
        setSelectedStations(availableStations);
      }
    };

    loadSelectedStations();
  }, []);

  // Save selected stations to localStorage whenever they change
  useEffect(() => {
    if (selectedStations.length > 0) {
      localStorage.setItem('manufacturing-selected-stations', JSON.stringify(selectedStations));
    } else {
      localStorage.removeItem('manufacturing-selected-stations');
    }
  }, [selectedStations]);

  // Use the new order cookies hook
  const {
    orders,
    editingOrder,
    isValidating,
    startEditingOrder,
    startCreatingOrder,
    cancelEditing,
    updateEditingOrder,
    saveEditingOrder,
    deleteOrder,
    clearAllOrders,
    getValidOrders
  } = useOrderCookies();

  // Simplified debouncing implementation
  const calculationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCalculation = useCallback(async (orders: Order[], stations: string[]) => {
    console.log('debouncedCalculation called with:', { 
      ordersCount: orders.length, 
      stationsCount: stations.length,
      orders: orders.map(o => ({ name: o.blueprintName, copies: o.copies, runs: o.runs })),
      stations: stations
    });

    // Clear existing timeout
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }

    // Filter valid orders directly here
    const validOrders = orders.filter(order => order.blueprintName.trim() !== '');
    
    if (validOrders.length === 0 || stations.length === 0) {
      console.log('No valid orders or stations, clearing results');
      setManufBatch(null);
      return;
    }

    // Set a timeout for debouncing
    calculationTimeoutRef.current = setTimeout(async () => {
      console.log('Executing calculation with:', {
        validOrdersCount: validOrders.length,
        stations: stations
      });

      setCalculating(true);
      
      try {
        // Convert Order objects to OrderDTO objects for the .NET backend
        const orderDTOs: OrderDTO[] = validOrders.map(order => ({
          blueprintName: order.blueprintName,
          activityId: order.activityId,
          copies: order.copies,
          runs: order.runs,
          me: order.me,
          te: order.te
        }));
        
        const request = {
          orderDTOs: orderDTOs,
          stationIds: stations
        };

        console.log('Sending manufacturing request:', {
          orderDTOs: request.orderDTOs,
          stationIds: request.stationIds,
          stationCount: request.stationIds.length
        });

        const result = await apiService.getManufacturingBatch(request);
        console.log('Received manufacturing result:', result);
        setManufBatch(result);
      } catch (error) {
        console.error('Error calculating manufacturing batch:', error);
        // Don't show alert for debounced calls, just log the error
      } finally {
        setCalculating(false);
      }
    }, 1000); // Wait 1 second after user stops making changes
  }, []);

  // Trigger calculation when orders or stations change
  useEffect(() => {
    console.log('useEffect triggered - orders or stations changed:', {
      ordersCount: orders.length,
      stationsCount: selectedStations.length,
      orders: orders.map(o => ({ name: o.blueprintName, copies: o.copies, runs: o.runs })),
      stations: selectedStations
    });
    debouncedCalculation(orders, selectedStations);
  }, [orders, selectedStations, debouncedCalculation]);

  const filteredAndSortedOrders = orders
    .filter(order => 
      order.blueprintName.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  // Manual calculation trigger for testing
  const triggerCalculation = () => {
    const validOrders = orders.filter(order => order.blueprintName.trim() !== '');
    if (validOrders.length > 0 && selectedStations.length > 0) {
      debouncedCalculation(orders, selectedStations);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manufacturing Calculator (Unified)
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time EVE Online Industry Planning Tool
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${calculating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {calculating ? 'Calculating...' : 'Connected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Orders and Station Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Orders Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Manufacturing Orders
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={startCreatingOrder}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add Order
                    </button>
                    <button
                      onClick={clearAllOrders}
                      className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                      disabled={orders.length === 0}
                      title="Delete all orders"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search blueprints..."
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'blueprintName' | 'copies' | 'runs' | 'me' | 'te')}
                        className="px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="blueprintName">Name</option>
                        <option value="copies">Copies</option>
                        <option value="runs">Runs</option>
                        <option value="me">ME</option>
                        <option value="te">TE</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <SortAscendingIcon className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredAndSortedOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 dark:text-gray-500">
                        <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">No orders found</p>
                        <button
                          onClick={startCreatingOrder}
                          className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Add your first order
                        </button>
                      </div>
                    </div>
                  ) : (
                    filteredAndSortedOrders.map((order) => (
                      <OrderCardReadOnly
                        key={order.id}
                        order={order}
                        onEdit={startEditingOrder}
                        onDelete={deleteOrder}
                        isSelected={editingOrder?.id === order.id}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Station Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Market Hubs
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedStations(availableStations)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setSelectedStations([])}
                      className="text-xs text-gray-600 hover:text-gray-700"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {availableStations.map((station) => (
                    <label key={station} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStations.includes(station)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStations(prev => [...prev, station]);
                          } else {
                            setSelectedStations(prev => prev.filter(s => s !== station));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{station}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedStations.length} of {availableStations.length} stations selected
                  </p>
                </div>
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Debug Info
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Orders: {orders.length}</div>
                  <div>Valid Orders: {getValidOrders().length}</div>
                  <div>Selected Stations: {selectedStations.length}</div>
                  <div>Calculating: {calculating ? 'Yes' : 'No'}</div>
                  <div>Has Results: {manufBatch ? 'Yes' : 'No'}</div>
                  <div>Editing Order: {editingOrder ? 'Yes' : 'No'}</div>
                  {orders.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium">Order Details:</div>
                      {orders.map((order, index) => (
                        <div key={order.id} className="ml-2 text-xs">
                          {index + 1}. {order.blueprintName || '(empty)'} - {order.copies} copies, {order.runs} runs
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Manual Calculation Button */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={triggerCalculation}
                    disabled={orders.length === 0 || selectedStations.length === 0 || calculating}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {calculating ? 'Calculating...' : 'Manual Calculate'}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Force calculation (bypasses debouncing)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results or Edit Form */}
          <div className="lg:col-span-2">
            {editingOrder ? (
              <OrderFormDTO
                editingOrder={editingOrder}
                onUpdate={updateEditingOrder}
                onSave={saveEditingOrder}
                onCancel={cancelEditing}
                isValidating={isValidating}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Manufacturing Results
                  </h2>
                  <ManufacturingResults manufBatch={manufBatch || undefined} loading={calculating} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 