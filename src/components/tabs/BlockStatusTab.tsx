'use client';
import React from 'react';
import { BlockStatus } from '@/types';
import { LoadingButton, EmptyState } from '@/components/ui';
import BlockStatusTable from '@/components/tables/BlockStatusTable';

interface BlockStatusTabProps {
  blockStatus: BlockStatus[];
  onLoadBlockStatus: () => void;
  onViewBlock: (blockNumber: number) => void;
  isLoading: boolean;
}

const BlockStatusTab: React.FC<BlockStatusTabProps> = ({
  blockStatus,
  onLoadBlockStatus,
  onViewBlock,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Block Status</h3>
        <LoadingButton onClick={onLoadBlockStatus} isLoading={isLoading}>
          Load Status
        </LoadingButton>
      </div>
      
      {blockStatus.length === 0 ? (
        <EmptyState 
          message="No block status found. Click 'Load Status' to fetch data."
        />
      ) : (
        <BlockStatusTable 
          blockStatus={blockStatus} 
          onViewBlock={onViewBlock} 
        />
      )}
    </div>
  );
};

export default BlockStatusTab;