'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete } from './Autocomplete';
import { MultiSelect } from './MultiSelect';
import { DataTable, Column } from './DataTable';
import { apiService, Planet, PIPlannerRequest, PaginatedResponse } from '../services/api';

export interface PICalcProps {
  className?: string;
}

export function PICalc({ className = "" }: PICalcProps) {
  const [focalSystemName, setFocalSystemName] = useState('');
  const [systemJumpRange, setSystemJumpRange] = useState(5);
  const [selectedPlanetTypes, setSelectedPlanetTypes] = useState<string[]>([]);
  const [selectedSecurityStatus, setSelectedSecurityStatus] = useState<string[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [systemNotFound, setSystemNotFound] = useState(false);
  const [planetTypes, setPlanetTypes] = useState<string[]>([]);
  const [validSolarSystems, setValidSolarSystems] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const jumpRangeOptions = [0, 1, 2, 3, 4, 5, 10];
  const securityStatusOptions = ['High Sec', 'Low Sec', 'Null Sec'];

  // API functions
  const searchSolarSystems = useCallback(async (query: string): Promise<string[]> => {
    try {
      const results = await apiService.searchSolarSystems(query);
      // Ensure results is always an array and store valid solar systems for validation
      const validResults = Array.isArray(results) ? results : [];
      setValidSolarSystems(validResults);
      return validResults;
    } catch (error) {
      console.error('Failed to search solar systems:', error);
      // Fallback to mock data if API fails
      const mockSystems = ['Jita', 'Dodixie', 'Amarr', 'Rens', 'Hek'];
      if (!query) {
        setValidSolarSystems(mockSystems);
        return mockSystems;
      }
      const filtered = mockSystems.filter(system => 
        system.toLowerCase().includes(query.toLowerCase())
      );
      setValidSolarSystems(filtered);
      return filtered;
    }
  }, []);

  const fetchPlanetTypes = useCallback(async (): Promise<string[]> => {
    try {
      const types = await apiService.getPlanetTypes();
      console.log('Planet types response:', types);
      
      // Ensure we always return an array
      if (Array.isArray(types)) {
        // Convert from "Planet (Type)" format to clean display names
        return types.map(type => type.replace('Planet (', '').replace(')', ''));
      } else {
        console.warn('Planet types response is not an array:', types);
        return ['Temperate', 'Ice', 'Gas', 'Oceanic', 'Lava', 'Barren', 'Storm', 'Plasma'];
      }
    } catch (error) {
      console.error('Failed to load planet types:', error);
      // Fallback to mock data if API fails
      return ['Temperate', 'Ice', 'Gas', 'Oceanic', 'Lava', 'Barren', 'Storm', 'Plasma'];
    }
  }, []);

  const fetchPlanets = useCallback(async (page: number = 1): Promise<PaginatedResponse<Planet>> => {
    // Only search if focal system name is a valid selection from the autocomplete
    if (!focalSystemName || !Array.isArray(validSolarSystems) || !validSolarSystems.includes(focalSystemName)) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: pageSize,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
      };
    }

    try {
      const request: PIPlannerRequest = {
        focalSystemName,
        range: systemJumpRange,
        securityStatus: selectedSecurityStatus.length > 0 
          ? selectedSecurityStatus 
          : ['High Sec', 'Low Sec', 'Null Sec'],
        planetTypes: selectedPlanetTypes.length > 0 
          ? selectedPlanetTypes
          : ['Temperate', 'Ice', 'Gas', 'Oceanic', 'Lava', 'Barren', 'Storm', 'Plasma'],
        pageNumber: page,
        pageSize: pageSize
      };
      
      console.log('PICalc - Sending request to API:', request);
      console.log('PICalc - focalSystemName:', focalSystemName);
      console.log('PICalc - selectedSecurityStatus:', selectedSecurityStatus);
      console.log('PICalc - selectedPlanetTypes:', selectedPlanetTypes);
      
      return await apiService.getPlanets(request);
    } catch (error) {
      console.error('Failed to load planets:', error);
      
      // Handle 404 errors - this means the system wasn't found
      if (error instanceof Error && error.message.includes('404')) {
        console.log('Solar system not found');
        throw new Error('SYSTEM_NOT_FOUND');
      }
      
      // For other errors, return empty result instead of mock data
      return {
        items: [],
        totalCount: 0,
        pageNumber: page,
        pageSize: pageSize,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      };
    }
  }, [focalSystemName, systemJumpRange, selectedPlanetTypes, selectedSecurityStatus, validSolarSystems, pageSize]);

  // Load planet types on component mount
  useEffect(() => {
    const loadPlanetTypes = async () => {
      try {
        const types = await fetchPlanetTypes();
        setPlanetTypes(types);
      } catch (error) {
        console.error('Failed to load planet types:', error);
      }
    };

    loadPlanetTypes();
  }, [fetchPlanetTypes]);

  // Fetch planets when filters change
  useEffect(() => {
    const loadPlanets = async () => {
      // Only search if focal system name is a valid selection from the autocomplete
      if (!focalSystemName || !Array.isArray(validSolarSystems) || !validSolarSystems.includes(focalSystemName)) {
        setPlanets([]);
        setNoResults(false);
        setSystemNotFound(false);
        setTotalCount(0);
        setTotalPages(1);
        setCurrentPage(1);
        return;
      }

      setLoading(true);
      setNoResults(false);
      setSystemNotFound(false);
      
      try {
        const planetData = await fetchPlanets(currentPage);
        setPlanets(planetData.items);
        setTotalCount(planetData.totalCount);
        setTotalPages(planetData.totalPages);
        setCurrentPage(planetData.pageNumber);
        setNoResults(planetData.totalCount === 0);
        setSystemNotFound(false);
      } catch (error) {
        console.error('Failed to load planets:', error);
        if (error instanceof Error && error.message === 'SYSTEM_NOT_FOUND') {
          setPlanets([]);
          setNoResults(false);
          setSystemNotFound(true);
          setTotalCount(0);
          setTotalPages(1);
          setCurrentPage(1);
        } else {
          setPlanets([]);
          setNoResults(false);
          setSystemNotFound(false);
          setTotalCount(0);
          setTotalPages(1);
          setCurrentPage(1);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPlanets();
  }, [focalSystemName, systemJumpRange, selectedPlanetTypes, selectedSecurityStatus, fetchPlanets, validSolarSystems, currentPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [focalSystemName, systemJumpRange, selectedPlanetTypes, selectedSecurityStatus, pageSize]);

  // Table columns configuration
  const columns: Column<Planet>[] = [
    {
      key: 'name',
      header: 'Planet',
      sortable: true
    },
    {
      key: 'solarSystem',
      header: 'Solar System',
      sortable: true
    },
    {
      key: 'constellation',
      header: 'Constellation',
      sortable: true
    },
    {
      key: 'region',
      header: 'Region',
      sortable: true
    },
    {
      key: 'planetType',
      header: 'Planet Type',
      sortable: true
    },
    {
      key: 'security',
      header: 'Security',
      sortable: true,
      render: (value) => typeof value === 'number' ? value.toFixed(2) : 'N/A'
    },
    {
      key: 'radius',
      header: 'Radius (km)',
      sortable: true,
      render: (value) => (typeof value === 'number' ? (value / 1000).toString() : 'N/A')
    },
    {
      key: 'minLinkPowerGrid',
      header: 'Min Link PG',
      sortable: true
    },
    {
      key: 'minLinkCPU',
      header: 'Min Link CPU',
      sortable: true
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">PI Planet Explorer</h3>
        <p className="text-gray-600">
          Find the perfect planet to start your infrastructure on in New Eden! 
          The smaller the planet is, the less CPU/PG you need for minimum length links. 
          Balance that against resource availability, and squeeze the most profit out!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Autocomplete
          value={focalSystemName}
          onChange={setFocalSystemName}
          onSelect={setFocalSystemName}
          onSearch={searchSolarSystems}
          label="Select Focal System"
          placeholder="e.g. Jita, Dodixie"
          className="min-w-[300px]"
        />

        <div className="flex items-end w-fit gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Range
            </label>
            <select
              value={systemJumpRange}
              onChange={(e) => setSystemJumpRange(Number(e.target.value))}
              className="w-20 px-3 py-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {jumpRangeOptions.map(option => (
                <option key={option} value={option} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">{option}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <div className="flex gap-4">
              <MultiSelect
                className="w-[200px]"
                options={planetTypes}
                selectedValues={selectedPlanetTypes}
                onChange={setSelectedPlanetTypes}
                label="Planet Type"
                placeholder="Select planet types..."
              />
              <MultiSelect
                className="w-[200px]"
                options={securityStatusOptions}
                selectedValues={selectedSecurityStatus}
                onChange={setSelectedSecurityStatus}
                label="Security Status"
                placeholder="Select security status..."
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Page Size Selector and Results Count */}
      {focalSystemName && Array.isArray(validSolarSystems) && validSolarSystems.includes(focalSystemName) && (
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Results per page
            </label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
              className="px-3 py-2 h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value={10} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">10</option>
              <option value={25} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">25</option>
              <option value={50} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">50</option>
              <option value={100} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">100</option>
            </select>
          </div>
          {totalCount > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total results: {totalCount}
            </div>
          )}
        </div>
      )}

      {focalSystemName && Array.isArray(validSolarSystems) && validSolarSystems.includes(focalSystemName) ? (
        <>
          {systemNotFound && !loading ? (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">
                Solar system &apos;{focalSystemName}&apos; not found. Please check the spelling and try again.
              </p>
            </div>
          ) : noResults && !loading ? (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">
                No planets found matching your criteria. Try adjusting your filters or selecting a different focal system.
              </p>
            </div>
          ) : (
            <DataTable
              data={planets}
              columns={columns}
              loading={loading}
              emptyMessage="The list is empty. Please adjust your filters, or enter a valid Focal Solar System"
              className="mt-6"
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              showPagination={true}
            />
          )}
        </>
      ) : focalSystemName && (!Array.isArray(validSolarSystems) || !validSolarSystems.includes(focalSystemName)) ? (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            Please select a valid solar system from the dropdown list.
          </p>
        </div>
      ) : null}
    </div>
  );
} 