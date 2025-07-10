'use client';

import React, { useState, useEffect } from 'react';
import Orders from '@/components/manufCalc/Orders';
import StationSelection from '@/components/manufCalc/StationSelection';
import ManufacturingResults from '@/components/manufCalc/ManufacturingResults';
import { apiService } from '@/services/api';
import type { ManufBatch, OrderDTO } from '@/types/manufacturing';
import type { Order } from '@/types/orders';

type TabType = 'orders' | 'results';

export default function ManufacturingCalculator() {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [manufBatch, setManufBatch] = useState<ManufBatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStations, setSelectedStations] = useState<string[]>([]);

  const tabs = [
    { id: 'orders', name: 'Orders', icon: '📋' },
    { id: 'results', name: 'Results', icon: '📊' },
  ];

  // Load orders from cookies/localStorage on component mount
  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('manufacturing-orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          setOrders(parsedOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('manufacturing-orders', JSON.stringify(orders));
    } else {
      localStorage.removeItem('manufacturing-orders');
    }
  }, [orders]);

  const handleCalculate = async () => {
    if (orders.length === 0) {
      alert('Please add some orders first.');
      return;
    }

    if (selectedStations.length === 0) {
      alert('Please select at least one market hub.');
      return;
    }

    setLoading(true);
    try {
      // Convert Order objects to OrderDTO objects for the .NET backend
      const orderDTOs: OrderDTO[] = orders.map(order => ({
        blueprintName: order.blueprintName,
        activityId: order.activityId,
        copies: order.copies,
        runs: order.runs,
        me: order.me,
        te: order.te
      }));
      
      const request = {
        orderDTOs: orderDTOs,
        stationIds: selectedStations // Use the selected stations
      };

      console.log('Sending manufacturing request:', {
        orderDTOs: request.orderDTOs,
        stationIds: request.stationIds,
        stationCount: request.stationIds.length
      });

      const result = await apiService.getManufacturingBatch(request);
      setManufBatch(result);
      setActiveTab('results');
    } catch (error) {
      console.error('Error calculating manufacturing batch:', error);
      alert('Error calculating manufacturing batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrdersChange = (newOrders: Order[]) => {
    setOrders(newOrders);
  };

  const handleStationsChange = (newStations: string[]) => {
    setSelectedStations(newStations);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-8">
            <Orders orders={orders} onOrdersChange={handleOrdersChange} />
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <StationSelection 
                selectedStations={selectedStations} 
                onStationsChange={handleStationsChange} 
              />
            </div>
            
            <div className="flex justify-center pt-4">
              <button
                onClick={handleCalculate}
                disabled={loading || orders.length === 0 || selectedStations.length === 0}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? 'Calculating...' : 'Calculate Manufacturing Batch'}
              </button>
            </div>
          </div>
        );
      case 'results':
        return <ManufacturingResults manufBatch={manufBatch || undefined} loading={loading} />;
      default:
        return <Orders orders={orders} onOrdersChange={handleOrdersChange} />;
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
                Manufacturing Calculator
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                EVE Online Industry Planning Tool
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 