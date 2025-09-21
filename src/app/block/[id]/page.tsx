'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Block } from '@/types';
import { ApiService } from '@/services/api';

export default function BlockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blockNumber = parseInt(params.id as string);

  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlock = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getBlock(blockNumber);
        setBlock(response.block);
      } catch (error) {
        console.error('Error loading block:', error);
        setBlock(null);
      } finally {
        setLoading(false);
      }
    };

    loadBlock();
  }, [blockNumber]);


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CA65] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading block details...</p>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Block Not Found</h1>
          <p className="text-gray-600 mb-6">The requested block could not be found.</p>
          <button
            onClick={() => router.push('/')}
            className="qproof-btn qproof-btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Block #{block.block_number.toLocaleString()}
          </h1>
          <p className="text-gray-600">
            Block details and statistics
          </p>
        </div>

        {/* Summary Card */}
        <div className="qproof-card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Block Summary</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <span className={`qproof-badge ${
                  block.status === 'finalized' ? 'qproof-badge-finalized' : 
                  block.status === 'pending' ? 'qproof-badge-pending' : 'qproof-badge-reorged'
                }`}>
                  {block.status}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">UTXO Count</label>
              <div className="mt-1 text-2xl font-bold text-[#00CA65]">
                {block.utxo_count}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Key Count</label>
              <div className="mt-1 text-2xl font-bold text-[#00CA65]">
                {block.key_count}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Message Count</label>
              <div className="mt-1 text-2xl font-bold text-[#00CA65]">
                {block.message_count}
              </div>
            </div>
          </div>
        </div>

        {/* Block Information */}
        <div className="qproof-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Block Information</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Block Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">UTXOs:</span>
                  <span className="ml-2 font-mono">{block.utxo_count}</span>
                </div>
                <div>
                  <span className="text-gray-600">Keys:</span>
                  <span className="ml-2 font-mono">{block.key_count}</span>
                </div>
                <div>
                  <span className="text-gray-600">Messages:</span>
                  <span className="ml-2 font-mono">{block.message_count}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 qproof-badge ${
                    block.status === 'finalized' ? 'qproof-badge-finalized' : 
                    block.status === 'pending' ? 'qproof-badge-pending' : 'qproof-badge-reorged'
                  }`}>
                    {block.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <p>Detailed inclusions for this block are not available in the current API.</p>
              <p className="text-sm mt-2">Use the live view on the home page to see current block inclusions.</p>
            </div>
          </div>
        </div>
    </div>
  );
}