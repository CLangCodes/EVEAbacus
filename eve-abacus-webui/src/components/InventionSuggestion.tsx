'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface InventionSuggestionProps {
  className?: string;
}

export default function InventionSuggestion({ className = '' }: InventionSuggestionProps) {
  const [inventionSkills, setInventionSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [pageSize] = useState(20);

  // Minimum skills required for invention suggestions
  const MIN_SKILLS_REQUIRED = 3;

  // Load invention skills on component mount
  useEffect(() => {
    const loadInventionSkills = async () => {
      try {
        const skills = await apiService.getInventionSkills();
        setInventionSkills(skills);
      } catch (err) {
        setError('Failed to load invention skills');
        console.error('Error loading invention skills:', err);
      }
    };

    loadInventionSkills();
  }, []);

  // Get invention suggestions when selected skills change
  useEffect(() => {
    const getSuggestions = async () => {
      if (selectedSkills.length >= MIN_SKILLS_REQUIRED) {
        setLoading(true);
        setError(null);
        
        try {
          console.log('Getting invention suggestions for skills:', selectedSkills);
          const results = await apiService.getInventionSuggestions(selectedSkills);
          console.log('Invention suggestions results:', results);
          setSuggestions(results);
          setCurrentPage(1); // Reset to first page when new results load
        } catch (err) {
          console.error('Error loading invention suggestions:', err);
          setError('Failed to load invention suggestions. Please try again.');
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setError(null);
      }
    };

    getSuggestions();
  }, [selectedSkills]);

  // Handle skill selection/deselection
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        // Allow selection of additional skills
        return [...prev, skill];
      }
    });
  };

  // Handle sorting
  const handleSort = (field: 'name') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort suggestions
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const aValue = a.toLowerCase();
    const bValue = b.toLowerCase();
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Paginate suggestions
  const totalPages = Math.ceil(sortedSuggestions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSuggestions = sortedSuggestions.slice(startIndex, endIndex);

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-xl font-semibold mb-2">Invention Suggestions</h3>
        <p className="text-gray-600 mb-4">
          Are you seeking new items to begin R&D on to sell in the market?
        </p>
        <p className="text-gray-600 mb-6">
          Select at least {MIN_SKILLS_REQUIRED} Invention Skills you have trained to level V to discover the best candidates for Blueprint Invention. More skills will provide more comprehensive results.
        </p>
      </div>

      {/* Skill Selection */}
      {inventionSkills.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Invention Skills ({selectedSkills.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {inventionSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          {selectedSkills.length > 0 && (
            <p className="text-sm text-gray-600">
              Selected: {selectedSkills.join(', ')} ({selectedSkills.length} skills)
            </p>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results Table */}
      {selectedSkills.length >= MIN_SKILLS_REQUIRED && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">
              Blueprint Suggestions ({suggestions.length} results)
            </h4>
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            )}
          </div>

          {suggestions.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <span>Blueprint Name</span>
                    {sortField === 'name' && (
                      <span className="text-blue-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {paginatedSuggestions.map((blueprint, index) => (
                  <div
                    key={`${blueprint}-${startIndex + index}`}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm text-gray-900">{blueprint}</div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(endIndex, suggestions.length)} of {suggestions.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`px-3 py-1 text-sm border rounded-md ${
                                currentPage === pageNum
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">
                No suitable blueprints found for the selected skill combination. Try selecting different skills.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions when not enough skills selected */}
      {selectedSkills.length > 0 && selectedSkills.length < MIN_SKILLS_REQUIRED && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800">
            Please select at least {MIN_SKILLS_REQUIRED} invention skills to see blueprint suggestions. 
            Currently selected: {selectedSkills.length} skills.
          </p>
        </div>
      )}
    </div>
  );
} 