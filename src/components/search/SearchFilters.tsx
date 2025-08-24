'use client';  
import React from 'react';
import { SearchFilters } from '@/types';

interface SearchFiltersProps {
  searchFilters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  searchFilters,
  onFiltersChange,
  onSearch,
  isLoading,
}) => {
  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    onFiltersChange({
      ...searchFilters,
      [field]: value,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Search & Filter</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Block Number
          </label>
          <input 
            value={searchFilters.blockNumber}
            onChange={(e) => handleInputChange('blockNumber', e.target.value)}
            type="number" 
            placeholder="Enter block number" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thread ID
          </label>
          <input 
            value={searchFilters.threadID}
            onChange={(e) => handleInputChange('threadID', e.target.value)}
            type="number" 
            placeholder="Enter thread ID" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leaf Index
          </label>
          <input 
            value={searchFilters.leafIndex}
            onChange={(e) => handleInputChange('leafIndex', e.target.value)}
            type="number" 
            placeholder="Enter leaf index" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* <div className="flex items-end">
          <button 
            onClick={onSearch} 
            disabled={isLoading} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SearchFiltersComponent;