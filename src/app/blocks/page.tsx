'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlockStatus } from '@/types';
import { ApiService } from '@/services/api';
import BlockStatusTable from '@/components/tables/BlockStatusTable';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function BlocksPage() {
  const [blockStatus, setBlockStatus] = useState<BlockStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const router = useRouter();

  const itemsPerPage = 50;

  const loadBlockStatus = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll simulate pagination by fetching all blocks and slicing
      // In a real implementation, the API would support pagination
      const allBlocks = await ApiService.getBlockStatus();
      const blockInfo = await ApiService.getBlockNumber();
      
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedBlocks = allBlocks.slice(startIndex, endIndex);
      
      setBlockStatus(paginatedBlocks);
      setTotalBlocks(blockInfo.block_number);
      setTotalPages(Math.ceil(blockInfo.block_number / itemsPerPage));
      setCurrentPage(page);
      
    } catch (err: any) {
      console.error('Error loading block status:', err);
      setError('Failed to load block status. Please try again.');
      setBlockStatus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockStatus(1);
  }, []);

  const handleViewBlock = (blockNumber: number) => {
    router.push(`/block/${blockNumber}`);
  };

  const handlePageChange = (page: number) => {
    loadBlockStatus(page);
  };

  const handleRefresh = () => {
    loadBlockStatus(currentPage);
  };

  if (loading && blockStatus.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blocks</h1>
              <p className="text-gray-600">
                View all blocks and their current status
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="qproof-btn qproof-btn-secondary flex items-center space-x-2"
            >
              <svg 
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="qproof-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Blocks</p>
                <p className="text-2xl font-semibold text-gray-900">{totalBlocks.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="qproof-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Finalized</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blockStatus.filter(b => b.status === 'finalized').length}
                </p>
              </div>
            </div>
          </div>

          <div className="qproof-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blockStatus.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Block Status Table */}
        <div className="qproof-card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Block Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {blockStatus.length} of {totalBlocks} blocks
            </p>
          </div>
          
          <BlockStatusTable 
            blockStatus={blockStatus}
            onViewBlock={handleViewBlock}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
    </div>
  );
}
