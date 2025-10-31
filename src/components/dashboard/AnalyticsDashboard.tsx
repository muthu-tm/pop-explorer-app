'use client';

import React, { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { SystemStats, BlockStats, UTXOStats } from '@/types';

interface AnalyticsDashboardProps {
  className?: string;
}

export default function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [blockStats, setBlockStats] = useState<BlockStats | null>(null);
  const [utxoStats, setUtxoStats] = useState<UTXOStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [system, blocks, utxos] = await Promise.all([
          ApiService.getSystemStats(),
          ApiService.getBlockStats(),
          ApiService.getUTXOStats(),
        ]);

        setSystemStats(system);
        setBlockStats(blocks);
        setUtxoStats(utxos);
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className={`qproof-card ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00CA65] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`qproof-card ${className}`}>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Overview */}
      {systemStats && (
        <div className="qproof-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00CA65]">
                {systemStats.total_blocks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Blocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00CA65]">
                {systemStats.total_utxos.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total UTXOs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00CA65]">
                {systemStats.total_keys.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00CA65]">
                {systemStats.total_messages.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {systemStats.current_block.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Current Block</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">
                {systemStats.pending_blocks}
              </div>
              <div className="text-sm text-gray-600">Pending Blocks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {systemStats.finalized_blocks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Finalized Blocks</div>
            </div>
          </div>
        </div>
      )}

      {/* Block Statistics */}
      {blockStats && (
        <div className="qproof-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Block Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {blockStats.average_utxos_per_block.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg UTXOs per Block</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {blockStats.average_keys_per_block.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg Keys per Block</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {blockStats.average_messages_per_block.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg Messages per Block</div>
            </div>
          </div>
        </div>
      )}

      {/* UTXO Statistics */}
      {utxoStats && (
        <div className="qproof-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">UTXO Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-[#00CA65]">
                {utxoStats.utxos_with_vows.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">UTXOs with Vows</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {utxoStats.send_vows.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Send Vows</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {utxoStats.receive_vows.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Receive Vows</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {utxoStats.utxos_with_inputs.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">UTXOs with Inputs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
