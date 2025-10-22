'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UTXO, MicroProof, ProofChain, Vow, VowInput } from '@/types';
import { ApiService } from '@/services/api';
import ProofModal from '@/components/modals/ProofModal';

export default function UTXODetailPage() {
  const params = useParams();
  const router = useRouter();
  const utxoId = params.id as string;

  const [utxo, setUtxo] = useState<UTXO | null>(null);
  const [vows, setVows] = useState<Vow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [microProof, setMicroProof] = useState<MicroProof | null>(null);
  const [proofChain, setProofChain] = useState<ProofChain | null>(null);

  useEffect(() => {
    const loadUTXO = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getUTXO(utxoId);
        setUtxo(response.utxo);
        setVows(response.vows);
      } catch (error) {
        console.error('Error loading UTXO:', error);
        setUtxo(null);
        setVows(null);
      } finally {
        setLoading(false);
      }
    };

    loadUTXO();
  }, [utxoId]);

  const handleViewProof = async () => {
    if (!utxo) return;

    try {
      // Get thread and leaf information for this UTXO
      const proofInfo = await ApiService.getUTXOProofInfo(utxo.utxo_id);
      
      // Load microproof data using resolved thread and leaf
      const proof = await ApiService.getProof(
        proofInfo.block_number.toString(),
        proofInfo.thread_id.toString(),
        proofInfo.leaf_index.toString()
      );
      setMicroProof(proof);
      
      // If finalized, also load proofchain
      if (utxo.status === 'finalized') {
        const proofchain = await ApiService.getProofchain(
          proofInfo.block_number.toString(),
          proofInfo.thread_id.toString(),
          proofInfo.leaf_index.toString()
        );
        setProofChain(proofchain);
      } else {
        setProofChain(null);
      }
      
      setIsProofModalOpen(true);
    } catch (error) {
      console.error('Error loading proof:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCloseProofModal = () => {
    setIsProofModalOpen(false);
    setMicroProof(null);
    setProofChain(null);
  };

  const handleDownloadJSON = () => {
    if (!utxo) return;
    
    const data = {
      utxo,
      vows,
      microProof,
      proofChain
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utxo-${utxo.utxo_id}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/utxo/${utxoId}`;
    navigator.clipboard.writeText(url);
  };

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


  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CA65] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading UTXO details...</p>
        </div>
      </div>
    );
  }

  if (!utxo) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">UTXO Not Found</h1>
          <p className="text-gray-600 mb-6">The requested UTXO could not be found.</p>
          <button
            onClick={() => router.push('/')}
            className="qproof-btn qproof-btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Full-width header */}
      <div className="border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-lg font-bold text-gray-900 mb-2">
              <span className="hidden sm:inline">UTXO: {utxo.utxo_id}</span>
              <span className="sm:hidden">UTXO: {utxo.utxo_id.slice(0, 20)}...</span>
            </h1>
            <p className="text-gray-600">
              Transaction output details and provenance information
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Details Card */}
        <div className="qproof-card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">UTXO Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">UTXO ID</label>
                <div className="mt-1 font-mono text-sm">{utxo.utxo_id.slice(0, 25)}...</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Initial Key</label>
                <div className="mt-1">
                  <button
                    onClick={() => router.push(`/key/${utxo.initial_key}`)}
                    className="qproof-link font-mono text-sm underline hover:text-[#00A855]"
                  >
                    {utxo.initial_key.slice(0, 25)}...
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Next Key</label>
                <div className="mt-1">
                  <button
                    onClick={() => router.push(`/key/${utxo.next_key}`)}
                    className="qproof-link font-mono text-sm underline hover:text-[#00A855]"
                  >
                    {utxo.next_key.slice(0, 25)}...
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <span className={getStatusBadge(utxo.status)}>
                    {utxo.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Block Number</label>
                <div className="mt-1">
                  <button
                    onClick={() => router.push(`/block/${utxo.block_number}`)}
                    className="qproof-link font-mono"
                  >
                    #{utxo.block_number.toLocaleString()}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Created At</label>
                <div className="mt-1 font-mono text-sm">
                  {new Date(utxo.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vows Section */}
        <div className="qproof-card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vows</h2>
          
          {vows === null ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No vows data available</p>
            </div>
          ) : vows.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No vows found for this UTXO</p>
            </div>
          ) : (
            <div className="space-y-6">
              {vows.map((vow, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Vow Type</label>
                      <div className="mt-1">
                        <span className={`qproof-badge ${
                          vow.vow_type === 'send' ? 'qproof-badge-pending' : 'qproof-badge-finalized'
                        }`}>
                          {vow.vow_type}
                        </span>
                      </div>
                    </div>
                    
                    {vow.value !== undefined && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Value</label>
                        <div className="mt-1 font-mono text-sm">
                          {vow.value.toFixed(8)} BTC
                        </div>
                      </div>
                    )}
                    
                    {vow.receiver_pubkey && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Receiver Public Key</label>
                        <div className="mt-1">
                          <button
                            onClick={() => router.push(`/key/${vow.receiver_pubkey}`)}
                            className="qproof-link font-mono text-sm underline hover:text-[#00A855]"
                          >
                            {vow.receiver_pubkey.slice(0, 25)}...
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {vow.initial_block !== undefined && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Initial Block</label>
                        <div className="mt-1">
                          <button
                            onClick={() => router.push(`/block/${vow.initial_block}`)}
                            className="qproof-link font-mono"
                          >
                            #{vow.initial_block.toLocaleString()}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* {vow.vow_id !== undefined && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Vow ID</label>
                        <div className="mt-1 font-mono text-sm">
                          {vow.vow_id}
                        </div>
                      </div>
                    )} */}
                  </div>

                  {/* Inputs within this vow */}
                  {vow.inputs && vow.inputs.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Inputs</h4>
                      <div className="space-y-2">
                        {vow.inputs.map((input: VowInput, inputIndex: number) => (
                          <div key={inputIndex} className="bg-gray-50 rounded p-3">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium text-gray-600">UTXO ID</label>
                                <div className="mt-1">
                                  <button
                                    onClick={() => router.push(`/utxo/${input.utxo_id}`)}
                                    className="qproof-link font-mono text-xs underline hover:text-[#00A855]"
                                  >
                                    {input.utxo_id.slice(0, 20)}...
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-xs font-medium text-gray-600">Value</label>
                                <div className="mt-1 font-mono text-xs">
                                  {input.value.toFixed(8)} BTC
                                </div>
                              </div>

                              {/* <div>
                                <label className="text-xs font-medium text-gray-600">Created At</label>
                                <div className="mt-1 font-mono text-xs">
                                  {new Date(input.created_at).toLocaleString()}
                                </div>
                              </div> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Actions */}
        <div className="qproof-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleViewProof}
              className="qproof-btn qproof-btn-primary"
            >
              Show Full Proof
            </button>
            
            <button
              onClick={handleDownloadJSON}
              className="qproof-btn qproof-btn-secondary"
            >
              Download JSON
            </button>
            
            <button
              onClick={handleCopyLink}
              className="qproof-btn qproof-btn-secondary"
            >
              Copy Link
            </button>

            {/* {utxo.status === 'finalized' && (
              <button
                onClick={handleViewProof}
                className="qproof-btn qproof-btn-primary"
              >
                View Proofchain
              </button>
            )} */}
          </div>
        </div>

        <ProofModal
          isOpen={isProofModalOpen}
          onClose={handleCloseProofModal}
          inclusion={{
            type: 'utxo',
            id: utxo.utxo_id,
            block_number: utxo.block_number,
            created_at: utxo.created_at,
            status: utxo.status
          }}
          microProof={microProof}
          proofChain={proofChain}
          onDownloadJSON={handleDownloadJSON}
          onCopyLink={handleCopyLink}
        />
        </div>
      </div>
    </div>
  );
}
