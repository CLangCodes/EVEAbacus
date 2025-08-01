'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/services/api';
import type { ManufBatch, OrderDTO } from '@/types/manufacturing';
import type { Order } from '@/types/orders';
import { PlusIcon, TrashIcon } from '@/components/Icons';
import { useOrderCookies, type EditableOrderDTO } from '@/hooks/useOrderCookies';
import { useInventoryStorage } from '@/hooks/useInventoryStorage';
import { useCustomBlueprintStorage } from '@/hooks/useCustomBlueprintStorage';
import { OrderFormDTO } from '@/components/manufCalc/OrderFormDTO';
import { OrdersDataGrid } from '@/components/manufCalc/OrdersDataGrid';
import ManufacturingResults from '@/components/manufCalc/ManufacturingResults';
import Toast from '@/components/Toast';
import InventoryEditInline from '@/components/InventoryEditInline';
import CustomBlueprintEditInline from '@/components/CustomBlueprintEditInline';
import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

export default function ManufacturingCalculator() {
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [manufBatch, setManufBatch] = useState<ManufBatch | null>(null);
  const [calculating, setCalculating] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });
  const [editInventoryModal, setEditInventoryModal] = useState<{
    isOpen: boolean;
    typeId: number;
    currentQuantity: number;
    itemName?: string;
  }>({
    isOpen: false,
    typeId: 0,
    currentQuantity: 0
  });

  const [editBlueprintModal, setEditBlueprintModal] = useState<{
    isOpen: boolean;
    blueprintTypeId: number;
    currentME: number;
    currentTE: number;
    blueprintName?: string;
  }>({
    isOpen: false,
    blueprintTypeId: 0,
    currentME: 0,
    currentTE: 0
  });

  // Storage keys
  const STATION_STORAGE_KEY = 'manufacturing-selected-stations';
  const STATION_COOKIE_KEY = 'eve_abacus_stations_backup';

  // Available stations - will be loaded from API
  const [availableStations, setAvailableStations] = useState<string[]>([]);
  
  // Ref to track if preferences have been loaded
  const preferencesLoadedRef = useRef(false);

  // Load saved station preferences immediately on mount
  useEffect(() => {
    // Try to load selected stations from localStorage first
    const savedStations = localStorage.getItem(STATION_STORAGE_KEY);
    
    if (savedStations) {
      const parsedStations = JSON.parse(savedStations);
      setSelectedStations(parsedStations);
      preferencesLoadedRef.current = true;
    } else {
      // Fallback to cookies
      const cookieData = getCookie(STATION_COOKIE_KEY);
      
      if (cookieData) {
        const parsedStations = JSON.parse(cookieData);
        setSelectedStations(parsedStations);
        // Restore to localStorage
        localStorage.setItem(STATION_STORAGE_KEY, cookieData);
        preferencesLoadedRef.current = true;
      }
    }
  }, []);

  // Load available stations from API
  useEffect(() => {
    const loadStations = async () => {
      try {
        // Load full station names from API
        const stations = await apiService.getMarketHubs();
        setAvailableStations(stations);
        
        // Only set default stations if no preferences were loaded earlier
        if (!preferencesLoadedRef.current) {
          setSelectedStations(stations);
        }
      } catch (error) {
        console.error('Error loading market hubs:', error);
        // Fallback to default stations with full names
        const defaultStations = [
          'Jita IV - Moon 4 - Caldari Navy Assembly Plant',
          'Amarr VIII (Oris) - Emperor Family Academy', 
          'Dodixie IX - Moon 20 - Federation Navy Assembly Plant',
          'Rens VI - Moon 8 - Brutor Tribe Treasury',
          'Hek VIII - Moon 12 - Boundless Creation Factory'
        ];
        setAvailableStations(defaultStations);
        
        // Only set default stations if no preferences were loaded earlier
        if (!preferencesLoadedRef.current) {
          setSelectedStations(defaultStations);
        }
      }
    };

    loadStations();
  }, []); // No dependencies to avoid infinite loop

  // Save selected stations to localStorage and cookies whenever they change
  useEffect(() => {
    if (selectedStations.length > 0) {
      const stationsJson = JSON.stringify(selectedStations);
      localStorage.setItem(STATION_STORAGE_KEY, stationsJson);
      
      // Also save to cookies as backup (expires in 30 days)
      setCookie(STATION_COOKIE_KEY, stationsJson, { expires: 30 });
    } else {
      localStorage.removeItem(STATION_STORAGE_KEY);
      removeCookie(STATION_COOKIE_KEY);
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
    clearAllOrders
  } = useOrderCookies();

  // Use inventory storage hook
  const { inventory, addInventoryItem, clearInventory, updateInventoryQuantities } = useInventoryStorage();

  // Use custom blueprint storage hook
  const { customBlueprints, addCustomBlueprint, addCustomBlueprints, clearCustomBlueprints } = useCustomBlueprintStorage();

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
          stationIds: stations,
          inventory: inventory,
          customBlueprints: customBlueprints
        };

        console.log('Sending manufacturing request:', {
          orderDTOs: request.orderDTOs,
          stationIds: request.stationIds,
          stationCount: request.stationIds.length
        });

        const result = await apiService.getManufacturingBatch(request);
        console.log('Received manufacturing result:', result);
        
        // Debug the received data
        if (result) {
          console.log('Debug - ManufBatch details:', {
            hasBillOfMaterials: !!result.billOfMaterials,
            billOfMaterialsCount: result.billOfMaterials?.length || 0,
            hasSupplyPlan: !!result.supplyPlan,
            supplyPlanProcurementPlans: result.supplyPlan?.procurementPlans?.length || 0,
            hasMarketProfile: !!result.marketProfile,
            marketProfileMaterialCost: result.marketProfile?.materialCost || 0,
            marketProfileRevenueSell: result.marketProfile?.revenueSellOrder || 0,
            marketProfileRevenueBuy: result.marketProfile?.revenueBuyOrder || 0,
            billOfMaterialsDetails: result.billOfMaterials?.map(bom => ({
              name: bom.name,
              requisitioned: bom.requisitioned,
              hasMarketStats: !!bom.marketStats,
              marketStatsCount: bom.marketStats?.length || 0,
              lowestSellPrice: bom.lowestSellPrice || 0
            }))
          });
        }
        
        // Preserve frontend's custom blueprints - don't let backend overwrite them
        if (result) {
          const resultWithPreservedCustomBlueprints: ManufBatch = {
            ...result,
            customBlueprints: customBlueprints // Use frontend's custom blueprints, not backend's
          };
          
          console.log('Setting ManufBatch with preserved custom blueprints:', {
            frontendCustomBlueprintsCount: customBlueprints.length,
            backendCustomBlueprintsCount: result.customBlueprints?.length || 0,
            preservedCustomBlueprints: customBlueprints
          });
          
          setManufBatch(resultWithPreservedCustomBlueprints);
        } else {
          setManufBatch(null);
        }
      } catch (error) {
        console.error('Error calculating manufacturing batch:', error);
        // Don't show alert for debounced calls, just log the error
      } finally {
        setCalculating(false);
      }
    }, 1000); // Wait 1 second after user stops making changes
  }, [inventory, customBlueprints]);





  const handleEditInventory = useCallback((typeId: number, currentQuantity: number, itemName?: string) => {
    setEditInventoryModal({
      isOpen: true,
      typeId,
      currentQuantity,
      itemName
    });
  }, []);

  const handleSaveInventory = useCallback((quantity: number) => {
    const { typeId } = editInventoryModal;
    addInventoryItem({ typeId, quantity });
    // Trigger recalculation after updating inventory
    debouncedCalculation(orders, selectedStations);
    
    // Show success toast
    setToast({
      message: `Updated inventory for Type ID ${typeId} to ${quantity.toLocaleString()}`,
      type: 'success',
      isVisible: true
    });
    
    setEditInventoryModal({ isOpen: false, typeId: 0, currentQuantity: 0 });
  }, [editInventoryModal, addInventoryItem, orders, selectedStations, debouncedCalculation]);

  const handleClearInventory = useCallback(() => {
    clearInventory();
    // Trigger recalculation after clearing inventory
    debouncedCalculation(orders, selectedStations);
    
    // Show success toast
    setToast({
      message: 'All inventory cleared successfully',
      type: 'success',
      isVisible: true
    });
  }, [clearInventory, orders, selectedStations, debouncedCalculation]);

  const handleEditBlueprint = useCallback((blueprintTypeId: number, currentME: number, currentTE: number, blueprintName?: string) => {
    setEditBlueprintModal({
      isOpen: true,
      blueprintTypeId,
      currentME,
      currentTE,
      blueprintName
    });
  }, []);

  const handleSaveBlueprint = useCallback((materialEfficiency: number, timeEfficiency: number) => {
    const { blueprintTypeId } = editBlueprintModal;
    addCustomBlueprint({ blueprintTypeId, materialEfficiency, timeEfficiency });
    // Trigger recalculation after updating custom blueprint
    debouncedCalculation(orders, selectedStations);
    
    // Show success toast
    setToast({
      message: `Updated blueprint ${blueprintTypeId} to ME ${materialEfficiency}/TE ${timeEfficiency}`,
      type: 'success',
      isVisible: true
    });
    
    setEditBlueprintModal({ isOpen: false, blueprintTypeId: 0, currentME: 0, currentTE: 0 });
  }, [editBlueprintModal, addCustomBlueprint, orders, selectedStations, debouncedCalculation]);

  const handleClearCustomBlueprints = useCallback(() => {
    clearCustomBlueprints();
    // Trigger recalculation after clearing custom blueprints
    debouncedCalculation(orders, selectedStations);
    
    // Show success toast
    setToast({
      message: 'All custom blueprints cleared successfully',
      type: 'success',
      isVisible: true
    });
  }, [clearCustomBlueprints, orders, selectedStations, debouncedCalculation]);

  const handleBulkEditSave = useCallback((changes: {
    blueprints: Array<{
      blueprintTypeId: number;
      materialEfficiency: number;
      timeEfficiency: number;
    }>;
    inventory: Array<{
      typeId: number;
      quantity: number;
    }>;
  }) => {
    console.log('BulkEditSave - Received changes:', changes);
    
    // Process blueprint changes
    addCustomBlueprints(changes.blueprints);

    // Process inventory changes
    updateInventoryQuantities(changes.inventory);

    // Trigger recalculation after all changes
    debouncedCalculation(orders, selectedStations);
    
    // Show success toast
    const blueprintCount = changes.blueprints.length;
    const inventoryCount = changes.inventory.length;
    let message = '';
    
    if (blueprintCount > 0 && inventoryCount > 0) {
      message = `Updated ${blueprintCount} blueprint(s) and ${inventoryCount} inventory item(s)`;
    } else if (blueprintCount > 0) {
      message = `Updated ${blueprintCount} blueprint(s)`;
    } else if (inventoryCount > 0) {
      message = `Updated ${inventoryCount} inventory item(s)`;
    } else {
      message = 'No changes were made';
    }
    
    setToast({
      message,
      type: 'success',
      isVisible: true
    });
  }, [addCustomBlueprints, updateInventoryQuantities, orders, selectedStations, debouncedCalculation]);

  // Trigger calculation when orders, stations, or inventory change
  useEffect(() => {
    console.log('useEffect triggered - orders or stations changed:', {
      ordersCount: orders.length,
      stationsCount: selectedStations.length,
      orders: orders.map(o => ({ name: o.blueprintName, copies: o.copies, runs: o.runs })),
      stations: selectedStations
    });
    debouncedCalculation(orders, selectedStations);
  }, [orders, selectedStations, debouncedCalculation]);





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
        <div className="space-y-6">
          {/* Main Container - Orders, Market Hubs, and Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              {editingOrder ? (
                <OrderFormDTO
                  editingOrder={editingOrder}
                  onUpdate={updateEditingOrder}
                  onSave={saveEditingOrder}
                  onCancel={cancelEditing}
                  isValidating={isValidating}
                />
              ) : (
                <div className="space-y-6">
                  {/* Orders/Inventory and Market Hubs Row */}
                  <div className="flex gap-6 overflow-x-auto">
                    {/* Orders/Inventory Section - 80% width */}
                    <div className="flex-1">
                      {/* Tab Navigation */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Orders ({orders.length})
                        </h3>
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
                            Clear Orders
                          </button>
                          <button
                            onClick={handleClearInventory}
                            className="inline-flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            disabled={inventory.length === 0}
                            title="Clear all inventory"
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Clear Inventory
                          </button>
                          <button
                            onClick={handleClearCustomBlueprints}
                            className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            disabled={customBlueprints.length === 0}
                            title="Clear all custom blueprints"
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Clear Blueprints
                          </button>
                        </div>
                      </div>

                      {/* Orders Content */}
                      <div className="overflow-x-auto">
                        <OrdersDataGrid
                          orders={orders}
                          onEdit={startEditingOrder}
                          onDelete={deleteOrder}
                          editingOrderId={(editingOrder as EditableOrderDTO | null)?.id}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Market Hubs Section - 25% width */}
                    <div className="w-1/4 min-w-48 flex-shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Market Hubs
                        </h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedStations(availableStations)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            All
                          </button>
                          <button
                            onClick={() => setSelectedStations([])}
                            className="text-xs text-gray-600 hover:text-gray-700"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {availableStations.map((station) => {
                          const shortName = station.split(' ')[0]; // Extract first word (e.g., "Jita", "Amarr")
                          return (
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
                                                          <div className="ml-2 flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 break-words">
                                {shortName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 break-words" title={station}>
                                {station}
                              </div>
                            </div>
                            </label>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedStations.length} of {availableStations.length} stations selected
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manufacturing Results Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Manufacturing Results
                    </h2>
                    <ManufacturingResults 
                      manufBatch={manufBatch || undefined} 
                      loading={calculating} 
                      onEditInventory={handleEditInventory} 
                      onEditBlueprint={handleEditBlueprint}
                      onBulkEditSave={handleBulkEditSave}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Debug Info - Moved to bottom as a separate card */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
                {manufBatch && (
                  <>
                    <div>BOM Count: {manufBatch.billOfMaterials?.length || 0}</div>
                    <div>Supply Plan: {manufBatch.supplyPlan?.procurementPlans?.length || 0} plans</div>
                    <div>Material Cost: {manufBatch.marketProfile?.materialCost || 0} Ƶ</div>
                    <div>Revenue Sell: {manufBatch.marketProfile?.revenueSellOrder || 0} Ƶ</div>
                    <div>Revenue Buy: {manufBatch.marketProfile?.revenueBuyOrder || 0} Ƶ</div>
                  </>
                )}
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
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Inventory Edit Modal */}
      <InventoryEditInline
        isOpen={editInventoryModal.isOpen}
        onClose={() => setEditInventoryModal({ isOpen: false, typeId: 0, currentQuantity: 0 })}
        onSave={handleSaveInventory}
        typeId={editInventoryModal.typeId}
        currentQuantity={editInventoryModal.currentQuantity}
        itemName={editInventoryModal.itemName}
      />

      {/* Custom Blueprint Edit Modal */}
      <CustomBlueprintEditInline
        isOpen={editBlueprintModal.isOpen}
        blueprintTypeId={editBlueprintModal.blueprintTypeId}
        currentME={editBlueprintModal.currentME}
        currentTE={editBlueprintModal.currentTE}
        blueprintName={editBlueprintModal.blueprintName}
        onSave={handleSaveBlueprint}
        onCancel={() => setEditBlueprintModal({ isOpen: false, blueprintTypeId: 0, currentME: 0, currentTE: 0 })}
      />
    </div>
  );
} 