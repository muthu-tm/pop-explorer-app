'use client';

import { useState } from 'react';
import { Inclusion } from '@/types';

interface LiveInclusionsTableProps {
  inclusions: Inclusion[];
  currentBlock: number;
  inclusionCount: number;
  estimatedFinalization?: string;
  onViewUTXO: (utxoId: string) => void;
  onViewKey: (pubkey: string) => void;
  onViewBlock: (blockNumber: number) => void;
}

export default function LiveInclusionsTable({
  inclusions,
  currentBlock,
  inclusionCount,
  estimatedFinalization,
  onViewUTXO,
  onViewKey,
  onViewBlock
}: LiveInclusionsTableProps) {
  const [sortBy, setSortBy] = useState<'type' | 'blockNumber' | 'status' | 'createdAt'>('blockNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: 'type' | 'blockNumber' | 'status' | 'createdAt') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedInclusions = [...inclusions].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'blockNumber':
        aValue = a.block_number;
        bValue = b.block_number;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'createdAt':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "qproof-badge";
    switch (status) {
      case 'finalized':
        return `${baseClasses} qproof-badge-finalized`;
      case 'pending':
        return `${baseClasses} qproof-badge-pending`;
      default:
        return `${baseClasses} qproof-badge-pending`;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "qproof-badge";
    switch (type) {
      case 'utxo':
        return `${baseClasses} qproof-badge-utxo`;
      case 'key':
        return `${baseClasses} qproof-badge-key`;
      default:
        return `${baseClasses}`;
    }
  };

  const handleItemClick = (inclusion: Inclusion) => {
    if (inclusion.type === 'utxo') {
      onViewUTXO(inclusion.id);
    } else {
      onViewKey(inclusion.id);
    }
  };

  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="qproof-card w-[330px] sm:w-auto mx-auto sm:mx-0  flex-1 flex flex-col">
        {/* Block Context Widget */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Current Block: #{currentBlock.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">
                {inclusionCount} inclusions so far
              </p>
            </div>
            {estimatedFinalization && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Estimated finalization</p>
                <p className="text-sm font-medium text-gray-900">{estimatedFinalization}</p>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="qproof-table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {sortBy === 'type' && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('blockNumber')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {sortBy === 'blockNumber' && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th>Since Block</th>
              <th 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortBy === 'status' && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created At</span>
                  {sortBy === 'createdAt' && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInclusions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No inclusions yet. Waiting for new data...
                </td>
              </tr>
            ) : (
              sortedInclusions.map((inclusion, index) => (
                <tr key={`${inclusion.type}-${inclusion.id}-${index}`} className="hover:bg-gray-50">
                  <td>
                    <span className={getTypeBadge(inclusion.type)}>
                      {inclusion.type}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleItemClick(inclusion)}
                      className="qproof-link font-mono text-sm"
                    >
                      {inclusion.type === 'utxo' 
                        ? `utxo:${inclusion.id.slice(0, 8)}...`
                        : `wots:${inclusion.id.slice(0, 8)}...`
                      }
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => onViewBlock(inclusion.block_number)}
                      className="qproof-link font-mono"
                    >
                      #{inclusion.block_number.toLocaleString()}
                    </button>
                  </td>
                  <td>
                    <span className={getStatusBadge(inclusion.status || 'pending')}>
                      {inclusion.status || 'pending'}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600">
                    {formatCreatedAt(inclusion.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

