'use client';
import React from 'react';
import { ProofChain } from '@/types';
import { LoadingButton, EmptyState } from '@/components/ui';
import ProofChainDisplay from '../tables/ProofChainDisplay';

interface ProofChainsTabProps {
  proofChain: ProofChain | null;
  onLoadProofChain: () => void;
  isLoading: boolean;
}

const ProofChainsTab: React.FC<ProofChainsTabProps> = ({
  proofChain,
  onLoadProofChain,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Proof Chains</h3>
        <LoadingButton onClick={onLoadProofChain} isLoading={isLoading}>
          Load Proof Chain
        </LoadingButton>
      </div>
      
      {!proofChain ? (
        <EmptyState 
          message="No proof chain loaded. Use the search filters and click 'Load Proof Chain' to fetch data."
        />
      ) : (
        <ProofChainDisplay proofChain={proofChain} />
      )}
    </div>
  );
};

export default ProofChainsTab;