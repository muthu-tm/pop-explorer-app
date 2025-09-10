'use client';
import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '@/services/api';
import { BlockNumber } from '@/types';

export const useBlockNumber = () => {
  const [blockNumber, setBlockNumber] = useState<BlockNumber>({
    block_number: 0,
    status: 'unknown',
    message_count: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlockNumber = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ApiService.getBlockNumber();
      setBlockNumber(data);
    } catch (err: any) {
      console.error('Error fetching block number:', err);
      setError(err.message || 'Failed to fetch block number');
      // Keep the previous block number on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchBlockNumber();

    // Get refresh interval from environment variable
    const refreshInterval = parseInt(process.env.BLOCK_CYCLE || '30') * 1000;

    // Set up auto-refresh
    const interval = setInterval(fetchBlockNumber, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [fetchBlockNumber]);

  return {
    blockNumber,
    isLoading,
    error,
    refresh: fetchBlockNumber
  };
};
