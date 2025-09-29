'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Key, MicroProof, ProofChain } from '@/types';
import { ApiService } from '@/services/api';
import ProofModal from '@/components/modals/ProofModal';

export default function KeyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const keyId = params.id as string;

  const [key, setKey] = useState<Key | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [microProof, setMicroProof] = useState<MicroProof | null>(null);
  const [proofChain, setProofChain] = useState<ProofChain | null>(null);

  useEffect(() => {
    const loadKey = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getKey(keyId);
        setKey(response.key);
      } catch (error) {
        console.error('Error loading key:', error);
        setKey(null);
      } finally {
        setLoading(false);
      }
    };

    loadKey();
  }, [keyId]);

  const handleViewProof = async () => {
    if (!key) return;

    try {
      // Get thread and leaf information for this key
      const proofInfo = await ApiService.getKeyProofInfo(key.address);
      
      // Load microproof data using resolved thread and leaf
      const proof = await ApiService.getProof(
        proofInfo.block_number.toString(),
        proofInfo.thread_id.toString(),
        proofInfo.leaf_index.toString()
      );
      setMicroProof(proof);
      
      // If finalized, also load proofchain
      if (key.status === 'finalized') {
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
    if (!key) return;
    
    const data = {
      key,
      microProof,
      proofChain
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `key-${key.initial_key.slice(0, 8)}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/key/${keyId}`;
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
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CA65] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading key details...</p>
        </div>
      </div>
    );
  }

  if (!key) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Key Not Found</h1>
          <p className="text-gray-600 mb-6">The requested key could not be found.</p>
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
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Key: {key.initial_key}
          </h1>
          <p className="text-gray-600">
            Public key registration details and associated UTXOs
          </p>
        </div>

        {/* Summary Card */}
        <div className="qproof-card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Registration Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Included in Block</label>
                <div className="mt-1">
                    <button
                      onClick={() => router.push(`/block/${key.block_number}`)}
                      className="qproof-link font-mono"
                    >
                      #{key.block_number.toLocaleString()}
                    </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <span className={getStatusBadge(key.status)}>
                    {key.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Created At</label>
                <div className="mt-1 font-mono text-sm">
                  {new Date(key.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Next Key</label>
                <div className="mt-1">
                  <button
                    onClick={() => router.push(`/key/${key.next_key}`)}
                    className="qproof-link font-mono text-sm underline hover:text-[#00A855]"
                  >
                    {key.next_key.slice(0, 25)}...
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Associated UTXOs</label>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {key.utxos?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UTXOs Table */}
        <div className="qproof-card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Associated UTXOs</h2>
          
          {!key.utxos || key.utxos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No UTXOs associated with this key</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="qproof-table">
                <thead>
                  <tr>
                    <th>UTXO ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Since Block</th>
                    <th>Status</th>
                    <th>Claim Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {key.utxos && key.utxos.length > 0 ? (
                    key.utxos.map((utxo) => (
                    <tr key={utxo.utxo_id} className="hover:bg-gray-50">
                      <td>
                        <button
                          onClick={() => router.push(`/utxo/${utxo.utxo_id}`)}
                          className="qproof-link font-mono text-sm"
                        >
                          utxo:{utxo.utxo_id.slice(0, 8)}...
                        </button>
                      </td>
                      <td>
                        <span className="qproof-badge qproof-badge-utxo">
                          UTXO
                        </span>
                      </td>
                      <td className="font-mono">
                        N/A
                      </td>
                      <td>
                        <button
                          onClick={() => router.push(`/block/${utxo.block_number}`)}
                          className="qproof-link font-mono"
                        >
                          #{utxo.block_number.toLocaleString()}
                        </button>
                      </td>
                      <td>
                        <span className="qproof-badge qproof-badge-pending">
                          N/A
                        </span>
                      </td>
                      <td>
                        <span className="qproof-badge qproof-badge-pending">
                          N/A
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => router.push(`/utxo/${utxo.utxo_id}`)}
                          className="text-[#00CA65] hover:text-[#00A855] text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No UTXOs associated with this key
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

            {key.status === 'finalized' && (
              <button
                onClick={handleViewProof}
                className="qproof-btn qproof-btn-primary"
              >
                View Proofchain
              </button>
            )}
          </div>
        </div>

        <ProofModal
          isOpen={isProofModalOpen}
          onClose={handleCloseProofModal}
          inclusion={{
            type: 'key',
            id: key.initial_key,
            block_number: key.block_number,
            created_at: key.created_at,
            status: key.status
          }}
          microProof={microProof}
          proofChain={proofChain}
          onDownloadJSON={handleDownloadJSON}
          onCopyLink={handleCopyLink}
        />
    </div>
  );
}
