'use client';
import React from 'react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading = false }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900"> Proof of Proof Explorer</h1>
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Live
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onRefresh} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;