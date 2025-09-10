'use client';
import React from 'react';
import { useBlockNumber } from '@/hooks/useBlockNumber';

interface HeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading = false }) => {
  const { blockNumber, isLoading: blockLoading } = useBlockNumber();
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
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">Block: </span>
              <span className="text-3xl font-bold text-gray-900">
                {blockLoading ? '...' : blockNumber.block_number}
              </span>
              {/* {blockNumber.status && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  blockNumber.status === 'finalized' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {blockNumber.status}
                </span>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;