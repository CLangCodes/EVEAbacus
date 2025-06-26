import { useState, useCallback } from 'react';
import { apiService, BlueprintValidation } from '@/services/api';

export function useBlueprintSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<BlueprintValidation | null>(null);

  const searchBlueprints = useCallback(async (searchTerm: string): Promise<string[]> => {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    setIsSearching(true);
    try {
      const results = await apiService.searchBlueprints(searchTerm);
      return results;
    } catch (error) {
      console.error('Blueprint search error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const validateBlueprint = useCallback(async (blueprintName: string, activityId: number): Promise<BlueprintValidation | null> => {
    if (!blueprintName.trim()) {
      setValidation(null);
      return null;
    }

    setIsValidating(true);
    try {
      const result = await apiService.validateBlueprint(blueprintName, activityId);
      setValidation(result);
      return result;
    } catch (error) {
      console.error('Blueprint validation error:', error);
      setValidation(null);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidation(null);
  }, []);

  return {
    searchBlueprints,
    validateBlueprint,
    clearValidation,
    isSearching,
    isValidating,
    validation,
  };
} 