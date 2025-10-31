'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlockNumber } from '@/hooks/useBlockNumber';
import { useToast } from '@/contexts/ToastContext';

interface HeaderProps {
  currentBlock?: number | null;
  tipBlock?: number | null;
}

export default function Header({ currentBlock, tipBlock }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { blockNumber, isLoading: blockLoading } = useBlockNumber();
  const { showToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        // Use universal search API
        const { ApiService } = await import('@/services/api');
        const result = await ApiService.search(searchQuery.trim());

        // Clear search query on successful result
        setSearchQuery('');

        // Navigate based on search result type
        if (result.type === 'utxo') {
          router.push(`/utxo/${result.id}`);
        } else if (result.type === 'key') {
          router.push(`/key/${result.id}`);
        } else if (result.type === 'block') {
          router.push(`/block/${result.id}`);
        } else {
          // Fallback to direct navigation based on query format
          if (searchQuery.startsWith('utxo:')) {
            router.push(`/utxo/${searchQuery}`);
          } else if (searchQuery.startsWith('wots:')) {
            router.push(`/key/${searchQuery}`);
          } else if (/^\d+$/.test(searchQuery)) {
            router.push(`/block/${searchQuery}`);
          } else {
            // Try to detect based on format
            if (searchQuery.length > 40) {
              router.push(`/key/${searchQuery}`);
            } else {
              router.push(`/utxo/${searchQuery}`);
            }
          }
        }
      } catch (error: any) {
        console.warn('Search error:', error);

        // Check if it's a 404 error from the search API
        if (error.response?.status === 404) {
          showToast('No results found. Try a different search term.', 'error');
        } else {
          showToast('Search failed. Please try again.', 'error');
        }

        // Fallback to direct navigation
        // if (searchQuery.startsWith('utxo:')) {
        //   router.push(`/utxo/${searchQuery}`);
        //   setSearchQuery('');
        // } else if (searchQuery.startsWith('wots:')) {
        //   router.push(`/key/${searchQuery}`);
        //   setSearchQuery('');
        // } else if (/^\d+$/.test(searchQuery)) {
        //   router.push(`/block/${searchQuery}`);
        //   setSearchQuery('');
        // }
      }
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:justify-between lg:items-center py-3 space-y-3 lg:space-y-0">
        {/* Search Bar */}
        <div className="flex-1 w-full md:max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by UTXO ID, Pubkey, or Block Number..."
              className="w-full px-4 py-2 pl-10 pr-10 text-sm lg:text-base text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CA65] focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-4 w-4 lg:h-5 lg:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </form>
        </div>

        {/* Current Block Banner */}
        <div className="flex items-center justify-center lg:justify-end">
          {(currentBlock || blockNumber) && (
            <div className="text-center lg:text-right">
              <div className="text-lg lg:text-xl font-bold text-gray-900">
                Block:{' '}
                <span className="text-lg lg:text-xl font-semibold text-gray-600">
                  {blockLoading
                    ? '...'
                    : (currentBlock || blockNumber?.block_number)?.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
