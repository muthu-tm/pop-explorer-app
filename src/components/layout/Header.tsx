'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBlockNumber } from '@/hooks/useBlockNumber';

interface HeaderProps {
  currentBlock?: number | null;
  tipBlock?: number | null;
}

export default function Header({ currentBlock, tipBlock }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const router = useRouter();
  const { blockNumber, isLoading: blockLoading } = useBlockNumber();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setSearchError(null);
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
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('No results found. Please try a different search term.');
        
        // Fallback to direct navigation
        if (searchQuery.startsWith('utxo:')) {
          router.push(`/utxo/${searchQuery}`);
          setSearchQuery('');
        } else if (searchQuery.startsWith('wots:')) {
          router.push(`/key/${searchQuery}`);
          setSearchQuery('');
        } else if (/^\d+$/.test(searchQuery)) {
          router.push(`/block/${searchQuery}`);
          setSearchQuery('');
        }
      }
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          {/* <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/qproof_logo.png" 
                alt="QProof Logo" 
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                QProof Explorer
              </h1>
            </div>
          </div> */}

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchError) setSearchError(null);
                }}
                placeholder="Search by UTXO ID, Pubkey, or Block Number..."
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CA65] focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            {searchError && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-red-50 border border-red-200 rounded-lg p-2 z-10">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700">{searchError}</span>
                </div>
              </div>
            )}
          </div>

          {/* Current Block Banner */}
          <div className="flex items-center space-x-4">
            {(currentBlock || blockNumber) && (
              <div className="text-right">
                <div className="text-sm text-black-800">Processing Block :</div>
                <div className="text-lg font-semibold text-gray-900">
                  {blockLoading ? '...' : (currentBlock || blockNumber?.block_number)?.toLocaleString()}
                  {/* {tipBlock && (
                    <span className="text-sm text-gray-500 ml-1">
                      (tip: {tipBlock.toLocaleString()})
                    </span>
                  )} */}
                </div>
              </div>
            )}

            {/* Menu */}
            {/* <div className="hidden md:block">
              <nav className="flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-[#00CA65] px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-[#00CA65] px-3 py-2 text-sm font-medium transition-colors">
                  About
                </Link>
              </nav>
            </div> */}

            {/* Mobile menu button */}
            {/* <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-[#00CA65] focus:outline-none focus:text-[#00CA65]"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div> */}
          </div>
        </div>

        {/* Mobile menu */}
        {/* {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="text-gray-600 hover:text-[#00CA65] block px-3 py-2 text-base font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-[#00CA65] block px-3 py-2 text-base font-medium">
                About
              </Link>
            </div>
          </div>
        )} */}
      </div>
    </header>
  );
}