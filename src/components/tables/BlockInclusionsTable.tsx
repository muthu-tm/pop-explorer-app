'use client';

import { useState } from 'react';
import { Inclusion } from '@/types';

interface BlockInclusionsTableProps {
  inclusions: Inclusion[];
  onViewUTXO: (utxoId: string) => void;
  onViewKey: (pubkey: string) => void;
  onViewProof: (inclusion: Inclusion) => void;
}

export default function BlockInclusionsTable({
  inclusions,
  onViewUTXO,
  onViewKey,
  onViewProof
}: BlockInclusionsTableProps) {
  const [sortBy, setSortBy] = useState<'type' | 'id' | 'status'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (column: 'type' | 'id' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedInclusions = [...inclusions].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'status':
        aValue = a.status || 'pending';
        bValue = b.status || 'pending';
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedInclusions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedInclusions = sortedInclusions.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const baseClasses = "qproof-badge";
    switch (status) {
      case 'finalized':
        return `${baseClasses} qproof-badge-finalized`;
      case 'pending':
        return `${baseClasses} qproof-badge-pending`;
      case 'reorged':
        return `${baseClasses} qproof-badge-reorged`;
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

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="qproof-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Block Inclusions</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00CA65] focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {sortBy === 'id' && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th>Created At</th>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInclusions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No inclusions found for this block.
                </td>
              </tr>
            ) : (
              paginatedInclusions.map((inclusion, index) => (
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
                        : `${inclusion.id.slice(0, 15)}...`
                      }
                    </button>
                  </td>
                  <td className="text-sm text-gray-600">
                    {new Date(inclusion.created_at).toLocaleString()}
                  </td>
                  <td>
                    <span className={getStatusBadge(inclusion.status || 'finalized')}>
                      {inclusion.status || 'finalized'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewProof(inclusion)}
                        className="text-gray-400 hover:text-[#00CA65] transition-colors"
                        title="View proof"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedInclusions.length)} of {sortedInclusions.length} inclusions
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === pageNum
                        ? 'bg-[#00CA65] text-white border-[#00CA65]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
