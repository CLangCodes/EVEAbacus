import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import type { Order, OrderFormData } from '@/types/orders';
import type { BlueprintValidation } from '@/services/api';

export interface EditableOrderDTO extends OrderFormData {
  id?: string;
  isEditing: boolean;
  validation?: BlueprintValidation | null;
  errors: Record<string, string>;
}

export function useOrderCookies() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingOrder, setEditingOrder] = useState<EditableOrderDTO | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Load orders from cookies on mount
  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('manufacturing-orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          setOrders(parsedOrders);
        }
      } catch (error) {
        console.error('Error loading orders from cookies:', error);
      }
    };

    loadOrders();
  }, []);

  // Save orders to cookies whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('manufacturing-orders', JSON.stringify(orders));
    } else {
      localStorage.removeItem('manufacturing-orders');
    }
  }, [orders]);

  // Validate blueprint name and activity combination
  const validateBlueprint = useCallback(async (blueprintName: string, activityId: number): Promise<BlueprintValidation | null> => {
    if (!blueprintName.trim()) {
      return null;
    }

    setIsValidating(true);
    try {
      const validation = await apiService.validateBlueprint(blueprintName, activityId);
      return validation;
    } catch (error) {
      console.error('Blueprint validation error:', error);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Validate form data
  const validateFormData = useCallback(async (formData: OrderFormData): Promise<Record<string, string>> => {
    const errors: Record<string, string> = {};

    // Basic validation
    if (!formData.blueprintName.trim()) {
      errors.blueprintName = 'Blueprint name is required';
    }

    if (formData.copies < 1) {
      errors.copies = 'Copies must be at least 1';
    }

    if (formData.runs < 1) {
      errors.runs = 'Runs must be at least 1';
    }

    if (formData.me < 0 || formData.me > 10) {
      errors.me = 'ME must be between 0 and 10';
    }

    if (formData.te < 0 || formData.te > 20) {
      errors.te = 'TE must be between 0 and 20';
    }

    // Blueprint validation (only if no other errors)
    if (Object.keys(errors).length === 0 && formData.blueprintName.trim()) {
      const validation = await validateBlueprint(formData.blueprintName, formData.activityId);
      if (!validation) {
        errors.blueprintName = 'Invalid blueprint name or activity combination';
      }
    }

    return errors;
  }, [validateBlueprint]);

  // Start editing an existing order
  const startEditingOrder = useCallback((order: Order) => {
    const editingDTO: EditableOrderDTO = {
      id: order.id,
      blueprintName: order.blueprintName,
      activityId: order.activityId,
      copies: order.copies,
      runs: order.runs,
      me: order.me,
      te: order.te,
      isEditing: true,
      errors: {}
    };
    setEditingOrder(editingDTO);
  }, []);

  // Start creating a new order
  const startCreatingOrder = useCallback(() => {
    const newOrderDTO: EditableOrderDTO = {
      blueprintName: '',
      activityId: 1,
      copies: 1,
      runs: 1,
      me: 0,
      te: 0,
      isEditing: true,
      errors: {}
    };
    setEditingOrder(newOrderDTO);
  }, []);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingOrder(null);
  }, []);

  // Update editing order data
  const updateEditingOrder = useCallback((field: keyof EditableOrderDTO, value: string | number) => {
    if (!editingOrder) return;

    setEditingOrder(prev => {
      if (!prev) return null;
      
      const updated = { ...prev, [field]: value };
      
      // Clear error for this field when user starts typing
      if (updated.errors[field as keyof OrderFormData]) {
        const newErrors = { ...updated.errors };
        delete newErrors[field as keyof OrderFormData];
        updated.errors = newErrors;
      }
      
      return updated;
    });
  }, [editingOrder]);

  // Save the editing order (create or update)
  const saveEditingOrder = useCallback(async (): Promise<boolean> => {
    if (!editingOrder) return false;

    // Validate the form data
    const errors = await validateFormData(editingOrder);
    
    if (Object.keys(errors).length > 0) {
      setEditingOrder(prev => prev ? { ...prev, errors } : null);
      return false;
    }

    // Create the order object
    const orderData: Order = {
      id: editingOrder.id || Date.now().toString(),
      blueprintName: editingOrder.blueprintName,
      activityId: editingOrder.activityId,
      copies: editingOrder.copies,
      runs: editingOrder.runs,
      me: editingOrder.me,
      te: editingOrder.te,
      createdAt: editingOrder.id ? orders.find(o => o.id === editingOrder.id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update or add the order
    if (editingOrder.id) {
      // Update existing order
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id ? orderData : order
      ));
    } else {
      // Add new order
      setOrders(prev => [...prev, orderData]);
    }

    // Clear editing state
    setEditingOrder(null);
    return true;
  }, [editingOrder, validateFormData, orders]);

  // Delete an order
  const deleteOrder = useCallback((orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  }, []);

  // Clear all orders
  const clearAllOrders = useCallback(() => {
    if (orders.length === 0) return;
    if (confirm('Are you sure you want to delete ALL orders? This cannot be undone.')) {
      setOrders([]);
    }
  }, [orders.length]);

  // Get valid orders (for API calls)
  const getValidOrders = useCallback(() => {
    return orders.filter(order => order.blueprintName.trim() !== '');
  }, [orders]);

  return {
    // State
    orders,
    editingOrder,
    isValidating,
    
    // Actions
    startEditingOrder,
    startCreatingOrder,
    cancelEditing,
    updateEditingOrder,
    saveEditingOrder,
    deleteOrder,
    clearAllOrders,
    getValidOrders,
    
    // Validation
    validateFormData,
    validateBlueprint
  };
} 