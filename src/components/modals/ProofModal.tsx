'use client';

import { useState } from 'react';
import { MicroProof, ProofChain, Inclusion } from '@/types';

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  inclusion?: Inclusion | null;
  microProof?: MicroProof | null;
  proofChain?: ProofChain | null;
  onDownloadJSON: () => void;
  onCopyLink: () => void;
}

export default function ProofModal({
  isOpen,
  onClose,
  inclusion,
  microProof,
  proofChain,
  onDownloadJSON,
  onCopyLink
}: ProofModalProps) {
  const [activeTab, setActiveTab] = useState<'microproof' | 'proofchain'>('microproof');

  if (!isOpen) return null;

  return (
    <div className="qproof-modal-overlay" onClick={onClose}>
      <div className="qproof-modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Proof Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Subject */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Subject</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-mono text-sm">
              {inclusion?.type === 'utxo' ? `utxo:${inclusion.id}` : `wots:${inclusion?.id}`}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('microproof')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'microproof'
                ? 'bg-[#00CA65] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Microproof
          </button>
          {/* {proofChain && (
            <button
              onClick={() => setActiveTab('proofchain')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'proofchain'
                  ? 'bg-[#00CA65] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Proofchain
            </button>
          )} */}
        </div>

        {/* Microproof Tab */}
        {activeTab === 'microproof' && microProof && (
          <div className="space-y-6">
            {/* Block Header */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Block Header</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Block Number:</span>
                  <span className="font-mono">#{microProof.block_header.block_number.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-mono text-sm">{microProof.block_header.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-mono">
                    {new Date(microProof.block_header.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Subject Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Block Number:</span>
                  <span className="font-mono">#{microProof.subject.block_number.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thread ID:</span>
                  <span className="font-mono">{microProof.subject.thread_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leaf Index:</span>
                  <span className="font-mono">{microProof.subject.leaf_index}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hash:</span>
                  <span className="font-mono text-sm">{microProof.subject.hash}</span>
                </div>
              </div>
            </div>

            {/* Proof Chain */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Proof Chain</h3>
              <div className="space-y-4">
                {microProof.proof_chain?.map((layer, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Layer {layer.layer_index}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Merkle Index:</span>
                        <span className="font-mono">{layer.merkle_index}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Root:</span>
                        <span className="font-mono text-sm">{layer.root}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Merkle Path:</span>
                        <div className="mt-1 space-y-1">
                          {layer.merkle_path?.map((path, pathIndex) => (
                            <div key={pathIndex} className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 w-6">{pathIndex}:</span>
                              <span className="font-mono text-sm">{path}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">MSS Signature:</span>
                        <span className="font-mono text-sm">{layer.mss_signature}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification Status</h3>
              <div className="flex items-center space-x-2">
                {microProof.verification.valid ? (
                  <span className="text-green-600 text-xl">✅</span>
                ) : (
                  <span className="text-red-600 text-xl">❌</span>
                )}
                <span className={`font-medium ${
                  microProof.verification.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {microProof.verification.valid ? 'Verified' : 'Failed Verification'}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Proof Layers:</span>
                  <span className="font-mono">{microProof.proof_chain?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification Status:</span>
                  <span className={`font-mono ${
                    microProof.verification.valid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {microProof.verification.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proofchain Tab */}
        {/* {activeTab === 'proofchain' && proofChain && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Proofchain Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Proofchain ID:</span>
                  <span className="font-mono text-sm">{proofChain.proofchain_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hash:</span>
                  <span className="font-mono text-sm">{proofChain.hash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parent Hash:</span>
                  <span className="font-mono text-sm">{proofChain.parent_hash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-mono">
                    {new Date(proofChain.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proof Layers:</span>
                  <span className="font-mono">{proofChain.proof_chain.layer_proofs?.length || 0}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Proof Layers</h3>
              <div className="space-y-4">
                {proofChain.proof_chain.layer_proofs && proofChain.proof_chain.layer_proofs.length > 0 ? (
                  proofChain.proof_chain.layer_proofs.map((layer: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Layer {index}</h4>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(layer, null, 2)}</pre>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No proof layers available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )} */}

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onCopyLink}
            className="qproof-btn qproof-btn-secondary"
          >
            Copy Link
          </button>
          <button
            onClick={onDownloadJSON}
            className="qproof-btn qproof-btn-primary"
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}
