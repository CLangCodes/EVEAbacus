'use client';

import { useState, useEffect } from 'react';
import { StockInventory } from '@/types/manufacturing';
import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

const STORAGE_KEY = 'eve_abacus_inventory';
const COOKIE_KEY = 'eve_abacus_inventory_backup';

export function useInventoryStorage() {
  const [inventory, setInventory] = useState<StockInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load inventory from storage on mount
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    try {
      // Try session storage first
      const sessionData = sessionStorage.getItem(STORAGE_KEY);
      if (sessionData) {
        const parsedInventory = JSON.parse(sessionData);
        setInventory(parsedInventory);
        setIsLoading(false);
        return;
      }

      // Fallback to cookies
      const cookieData = getCookie(COOKIE_KEY);
      if (cookieData) {
        const parsedInventory = JSON.parse(cookieData);
        setInventory(parsedInventory);
        // Restore to session storage
        sessionStorage.setItem(STORAGE_KEY, cookieData);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInventory = (newInventory: StockInventory[]) => {
    try {
      const inventoryJson = JSON.stringify(newInventory);
      sessionStorage.setItem(STORAGE_KEY, inventoryJson);
      // Also save to cookies as backup (expires in 30 days)
      setCookie(COOKIE_KEY, inventoryJson, { expires: 30 });
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const addInventoryItem = (inventoryItem: StockInventory) => {
    const newInventory = [...inventory];
    const existingIndex = newInventory.findIndex(item => item.typeId === inventoryItem.typeId);
    
    if (existingIndex >= 0) {
      newInventory[existingIndex] = inventoryItem;
    } else {
      newInventory.push(inventoryItem);
    }
    
    setInventory(newInventory);
    saveInventory(newInventory);
  };

  const updateInventoryQuantity = (typeId: number, quantity: number) => {
    const newInventory = [...inventory];
    const existingIndex = newInventory.findIndex(item => item.typeId === typeId);
    
    if (existingIndex >= 0) {
      if (quantity <= 0) {
        newInventory.splice(existingIndex, 1);
      } else {
        newInventory[existingIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      newInventory.push({ typeId, quantity });
    }
    
    setInventory(newInventory);
    saveInventory(newInventory);
  };

  const deleteInventoryItem = (typeId: number) => {
    const newInventory = inventory.filter(item => item.typeId !== typeId);
    setInventory(newInventory);
    saveInventory(newInventory);
  };

  const clearInventory = () => {
    setInventory([]);
    sessionStorage.removeItem(STORAGE_KEY);
    removeCookie(COOKIE_KEY);
  };

  const getInventoryQuantity = (typeId: number): number => {
    const item = inventory.find(item => item.typeId === typeId);
    return item?.quantity || 0;
  };

  return {
    inventory,
    addInventoryItem,
    updateInventoryQuantity,
    deleteInventoryItem,
    clearInventory,
    getInventoryQuantity,
    isLoading,
  };
} 