// components/tables/BlockStatusTable.tsx
import React from 'react';
import { BlockStatus } from '@/types';
import { StatusBadge } from '@/components/ui';

interface BlockStatusTableProps {
  blockStatus: BlockStatus[];
  onViewBlock: (blockNumber: number) => void;
}

const BlockStatusTable: React.FC<BlockStatusTableProps> = ({ blockStatus, onViewBlock }) => {
  if (blockStatus.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {`No block status found. Click "Refresh" to fetch data.`}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full  divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Block Number
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {blockStatus.map((status, index) => (
            <tr key={`${status.block_number}-${index}`}>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                {status.block_number}
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                <StatusBadge status={status.status} />
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                <button
                  onClick={() => onViewBlock(status.block_number)}
                  className="cursor-pointer text-[#00ca65] hover:text-[#04954c] transition-colors"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default BlockStatusTable;
