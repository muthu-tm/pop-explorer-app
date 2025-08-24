'use client';  
import React, { use } from 'react';
import { ProofChain } from '@/types';
import { formatHash, getLayerName } from '@/utils/formatters';

interface ProofChainDisplayProps {
  proofChain: ProofChain;
}

const ProofChainDisplay: React.FC<ProofChainDisplayProps> = ({ proofChain }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Proof Chain Details</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Block:</span> {proofChain.block_number}
          </div>
          <div>
            <span className="font-medium">Thread:</span> {proofChain.thread_id}
          </div>
          <div>
            <span className="font-medium">Leaf:</span> {proofChain.leaf_index}
          </div>
        </div>
      </div>
      
      {proofChain.proof_chain.map((layer, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-2">
            Layer {layer.layer_index} ({getLayerName(layer.layer_index)})
          </h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Merkle Index:</span> {layer.merkle_index}
            </div>
            <div>
              <span className="font-medium">Root:</span> 
              <span className="font-mono text-gray-600 ml-1" title={layer.root}>
                {formatHash(layer.root)}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-medium text-sm">Merkle Path:</span>
            <div className="mt-1 space-y-1">
              {layer.merkle_path.map((hash, hashIndex) => (
                <div 
                  key={hashIndex} 
                  className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                  title={hash}
                >
                  {formatHash(hash)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProofChainDisplay;