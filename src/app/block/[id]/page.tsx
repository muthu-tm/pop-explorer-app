'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Block, Inclusion, MicroProof, ProofChain } from '@/types';
import { ApiService } from '@/services/api';
import BlockInclusionsTable from '@/components/tables/BlockInclusionsTable';
import ProofModal from '@/components/modals/ProofModal';

export default function BlockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blockNumber = parseInt(params.id as string);

  const [block, setBlock] = useState<Block | null>(null);
  const [inclusions, setInclusions] = useState<Inclusion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedInclusion, setSelectedInclusion] = useState<Inclusion | null>(null);
  const [microProof, setMicroProof] = useState<MicroProof | null>(null);
  const [proofChain, setProofChain] = useState<ProofChain | null>(null);

  useEffect(() => {
    const loadBlock = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getBlock(blockNumber);
        setBlock(response.block);
        setInclusions(response.inclusions || []);
      } catch (error) {
        console.error('Error loading block:', error);
        setBlock(null);
        setInclusions([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlock();
  }, [blockNumber]);

  const handleViewUTXO = (utxoId: string) => {
    router.push(`/utxo/${utxoId}`);
  };

  const handleViewKey = (pubkey: string) => {
    router.push(`/key/${pubkey}`);
  };

  const handleViewProof = async (inclusion: Inclusion) => {
    setSelectedInclusion(inclusion);
    
    try {
      let proofInfo;
      
      // Get thread and leaf information based on inclusion type
      if (inclusion.type === 'utxo') {
        proofInfo = await ApiService.getUTXOProofInfo(inclusion.id);
      } else if (inclusion.type === 'key') {
        proofInfo = await ApiService.getKeyProofInfo(inclusion.id);
      } else {
        throw new Error('Unknown inclusion type');
      }
      
      // Load microproof data using resolved thread and leaf
      const proof = await ApiService.getProof(
        proofInfo.block_number.toString(),
        proofInfo.thread_id.toString(),
        proofInfo.leaf_index.toString()
      );
      setMicroProof(proof);
      
      // If finalized, also load proofchain
      if (inclusion.status === 'finalized') {
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
    } catch (err) {
      console.error('Error loading proof:', err);
    }
  };

  const handleCloseProofModal = () => {
    setIsProofModalOpen(false);
    setSelectedInclusion(null);
    setMicroProof(null);
    setProofChain(null);
  };

  const handleDownloadJSON = () => {
    const data = {
      inclusion: selectedInclusion,
      microProof,
      proofChain
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof-${selectedInclusion?.id}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${selectedInclusion?.type.toLowerCase()}/${selectedInclusion?.id}`;
    navigator.clipboard.writeText(url);
  };


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CA65] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading block details...</p>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Block Not Found</h1>
          <p className="text-gray-600 mb-6">The requested block could not be found.</p>
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
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Block #{block.block_number.toLocaleString()}
          </h1>
          <p className="text-gray-600">
            Block details and statistics
          </p>
        </div>

        {/* Summary Card */}
        <div className="qproof-card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Block Summary</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <span className={`qproof-badge ${
                  block.status === 'finalized' ? 'qproof-badge-finalized' : 
                  block.status === 'pending' ? 'qproof-badge-pending' : 'qproof-badge-reorged'
                }`}>
                  {block.status}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">UTXO Count</label>
              <div className="mt-1 text-2xl font-bold text-[#00CA65]">
                {block.utxo_count}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Key Count</label>
              <div className="mt-1 text-2xl font-bold text-[#00CA65]">
                {block.key_count}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Message Count</label>
              <div className="mt-1 text-2xl font-bold text-[#00CA65]">
                {block.message_count}
              </div>
            </div>
          </div>
        </div>

        {/* Block Inclusions */}
        <BlockInclusionsTable
          inclusions={inclusions}
          onViewUTXO={handleViewUTXO}
          onViewKey={handleViewKey}
          onViewProof={handleViewProof}
        />

        <ProofModal
          isOpen={isProofModalOpen}
          onClose={handleCloseProofModal}
          inclusion={selectedInclusion || undefined}
          microProof={microProof || undefined}
          proofChain={proofChain || undefined}
          onDownloadJSON={handleDownloadJSON}
          onCopyLink={handleCopyLink}
        />
    </div>
  );
}