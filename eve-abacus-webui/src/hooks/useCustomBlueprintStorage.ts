'use client';

import { useState, useEffect } from 'react';
import { CustomBlueprint } from '@/types/manufacturing';
import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

const STORAGE_KEY = 'eve_abacus_custom_blueprints';
const COOKIE_KEY = 'eve_abacus_custom_blueprints_backup';

export function useCustomBlueprintStorage() {
  const [customBlueprints, setCustomBlueprints] = useState<CustomBlueprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load custom blueprints from storage on mount
  useEffect(() => {
    loadCustomBlueprints();
  }, []);

  const loadCustomBlueprints = () => {
    try {
      // Try to load from sessionStorage first
      const sessionData = sessionStorage.getItem(STORAGE_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        setCustomBlueprints(parsed);
        setIsLoading(false);
        return;
      }

      // Fallback to cookies
      const cookieData = getCookie(COOKIE_KEY);
      if (cookieData) {
        const parsed = JSON.parse(cookieData);
        setCustomBlueprints(parsed);
        // Also save to sessionStorage for future use
        sessionStorage.setItem(STORAGE_KEY, cookieData);
      }
    } catch (error) {
      console.error('Error loading custom blueprints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomBlueprints = (newCustomBlueprints: CustomBlueprint[]) => {
    try {
      const jsonData = JSON.stringify(newCustomBlueprints);
      sessionStorage.setItem(STORAGE_KEY, jsonData);
      setCookie(COOKIE_KEY, jsonData, { expires: 365 }); // Save to cookies for 1 year
    } catch (error) {
      console.error('Error saving custom blueprints:', error);
    }
  };

  const addCustomBlueprint = (customBlueprint: CustomBlueprint) => {
    const newCustomBlueprints = [...customBlueprints];
    const existingIndex = newCustomBlueprints.findIndex(
      cb => cb.blueprintTypeId === customBlueprint.blueprintTypeId
    );

    if (existingIndex >= 0) {
      newCustomBlueprints[existingIndex] = customBlueprint;
    } else {
      newCustomBlueprints.push(customBlueprint);
    }

    setCustomBlueprints(newCustomBlueprints);
    saveCustomBlueprints(newCustomBlueprints);
  };

  const updateCustomBlueprint = (blueprintTypeId: number, materialEfficiency: number, timeEfficiency: number) => {
    const newCustomBlueprints = [...customBlueprints];
    const existingIndex = newCustomBlueprints.findIndex(
      cb => cb.blueprintTypeId === blueprintTypeId
    );

    if (existingIndex >= 0) {
      newCustomBlueprints[existingIndex] = {
        blueprintTypeId,
        materialEfficiency,
        timeEfficiency
      };
    } else {
      newCustomBlueprints.push({
        blueprintTypeId,
        materialEfficiency,
        timeEfficiency
      });
    }

    setCustomBlueprints(newCustomBlueprints);
    saveCustomBlueprints(newCustomBlueprints);
  };

  const deleteCustomBlueprint = (blueprintTypeId: number) => {
    const newCustomBlueprints = customBlueprints.filter(
      cb => cb.blueprintTypeId !== blueprintTypeId
    );
    setCustomBlueprints(newCustomBlueprints);
    saveCustomBlueprints(newCustomBlueprints);
  };

  const clearCustomBlueprints = () => {
    setCustomBlueprints([]);
    sessionStorage.removeItem(STORAGE_KEY);
    removeCookie(COOKIE_KEY);
  };

  const getCustomBlueprint = (blueprintTypeId: number): CustomBlueprint | undefined => {
    return customBlueprints.find(cb => cb.blueprintTypeId === blueprintTypeId);
  };

  const getMaterialEfficiency = (blueprintTypeId: number): number => {
    const customBlueprint = customBlueprints.find(cb => cb.blueprintTypeId === blueprintTypeId);
    return customBlueprint?.materialEfficiency ?? 0;
  };

  const getTimeEfficiency = (blueprintTypeId: number): number => {
    const customBlueprint = customBlueprints.find(cb => cb.blueprintTypeId === blueprintTypeId);
    return customBlueprint?.timeEfficiency ?? 0;
  };

  return {
    customBlueprints,
    addCustomBlueprint,
    updateCustomBlueprint,
    deleteCustomBlueprint,
    clearCustomBlueprints,
    getCustomBlueprint,
    getMaterialEfficiency,
    getTimeEfficiency,
    isLoading,
  };
} 