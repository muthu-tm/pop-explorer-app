'use client';
import { StatusType } from '@/types';

export const formatHash = (hash: string | string[]): string => {
  if (!hash) return 'N/A';
  
  if (typeof hash === 'string') {
    return hash.length > 16 ? hash.substring(0, 16) + '...' : hash;
  }
  
  return hash.length > 16 ? hash.slice(0, 16).join('') + '...' : hash.join('');
};

export const getLayerName = (layerIndex: number): string => {
  const names = ['Micro', 'Thread', 'Block'];
  return names[layerIndex] || `Layer ${layerIndex}`;
};

export const getStatusClass = (status: StatusType): string => {
  switch (status) {
    case 'finalized':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'skipped':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};