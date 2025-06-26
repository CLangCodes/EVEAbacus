'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types/orders';
import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

const STORAGE_KEY = 'eve_abacus_orders';
const COOKIE_KEY = 'eve_abacus_orders_backup';

export function useOrderStorage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from storage on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      // Try session storage first
      const sessionData = sessionStorage.getItem(STORAGE_KEY);
      if (sessionData) {
        const parsedOrders = JSON.parse(sessionData);
        setOrders(parsedOrders);
        setIsLoading(false);
        return;
      }

      // Fallback to cookies
      const cookieData = getCookie(COOKIE_KEY);
      if (cookieData) {
        const parsedOrders = JSON.parse(cookieData);
        setOrders(parsedOrders);
        // Restore to session storage
        sessionStorage.setItem(STORAGE_KEY, cookieData);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrders = (newOrders: Order[]) => {
    try {
      const ordersJson = JSON.stringify(newOrders);
      sessionStorage.setItem(STORAGE_KEY, ordersJson);
      // Also save to cookies as backup (expires in 30 days)
      setCookie(COOKIE_KEY, ordersJson, { expires: 30 });
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const addOrder = (order: Order) => {
    const newOrders = [...orders, order];
    setOrders(newOrders);
    saveOrders(newOrders);
  };

  const updateOrder = (updatedOrder: Order) => {
    const newOrders = orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    );
    setOrders(newOrders);
    saveOrders(newOrders);
  };

  const deleteOrder = (orderId: string) => {
    const newOrders = orders.filter(order => order.id !== orderId);
    setOrders(newOrders);
    saveOrders(newOrders);
  };

  const clearOrders = () => {
    setOrders([]);
    sessionStorage.removeItem(STORAGE_KEY);
    removeCookie(COOKIE_KEY);
  };

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    clearOrders,
    isLoading,
  };
} 