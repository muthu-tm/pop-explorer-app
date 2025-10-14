'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inclusion, MicroProof, ProofChain } from '@/types';
import { ApiService } from '@/services/api';
import { useBlockContext } from '@/contexts/BlockContext';
import { useToast } from '@/contexts/ToastContext';

// Layout Components
import LiveInclusionsTable from '@/components/tables/LiveInclusionsTable';
import ProofModal from '@/components/modals/ProofModal';

export default function HomePage() {
  const router = useRouter();
  const { setCurrentBlock, setTipBlock } = useBlockContext();
  
  const [inclusions, setInclusions] = useState<Inclusion[]>([]);
  const [currentBlock, setCurrentBlockLocal] = useState<number>(0);
  const [inclusionCount, setInclusionCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [selectedInclusion, setSelectedInclusion] = useState<Inclusion | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [microProof, setMicroProof] = useState<MicroProof | null>(null);
  const [proofChain, setProofChain] = useState<ProofChain | null>(null);

  // Load initial data and set up live updates
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load current block status
        const blockStatus = await ApiService.getCurrentBlockStatus();
        setCurrentBlockLocal(blockStatus.block_number);
        setCurrentBlock(blockStatus.block_number);
        setTipBlock(blockStatus.block_number + 3);
        setInclusionCount(blockStatus.inclusion_count);
        
        // Load live inclusions
        const liveData = await ApiService.getLiveInclusions();
        setInclusions(liveData.inclusions);
        
      } catch (err) {
        console.error('Error loading data:', err);
        // setError('Failed to load live data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up live updates every 3 seconds
    const interval = setInterval(async () => {
      try {
        const liveData = await ApiService.getLiveInclusions();
        setInclusions(liveData.inclusions);
        
        const blockStatus = await ApiService.getCurrentBlockStatus();
        setCurrentBlockLocal(blockStatus.block_number);
        setCurrentBlock(blockStatus.block_number);
        setTipBlock(blockStatus.block_number + 3);
        setInclusionCount(blockStatus.inclusion_count);
      } catch (err) {
        console.error('Error updating live data:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [setCurrentBlock, setTipBlock]);

  const handleViewUTXO = (utxoId: string) => {
    router.push(`/utxo/${utxoId}`);
  };

  const handleViewKey = (pubkey: string) => {
    router.push(`/key/${pubkey}`);
  };

  const handleViewBlock = (blockNumber: number) => {
    router.push(`/block/${blockNumber}`);
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
      // setError('Failed to load proof data. Please try again.');
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

  const handleRefresh = async () => {
    try {
      setLoading(true);
      
      // Load current block status
      const blockStatus = await ApiService.getCurrentBlockStatus();
      setCurrentBlockLocal(blockStatus.block_number);
      setCurrentBlock(blockStatus.block_number);
      setTipBlock(blockStatus.block_number + 3);
      setInclusionCount(blockStatus.inclusion_count);
      
      // Load live inclusions
      const liveData = await ApiService.getLiveInclusions();
      setInclusions(liveData.inclusions);
      
    } catch (err) {
      console.error('Error refreshing data:', err);
      showToast('Failed to refresh data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const estimatedFinalization = currentBlock && inclusions ? 
    `${Math.max(0, 6 - (inclusions.filter(i => i.status === 'pending').length))} minutes` : 
    undefined;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CA65] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading live data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Full-width header */}
      <div className="border-gray-200">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Live Block Inclusions
              </h1>
              <p className="text-gray-600">
                Watch inclusions being added to the current block in real-time
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-[#00CA65] hover:text-white hover:border-[#00CA65] focus:outline-none focus:ring-2 focus:ring-[#00CA65] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg 
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-6 lg:px-8">
          <LiveInclusionsTable
            inclusions={inclusions || []}
            currentBlock={currentBlock}
            inclusionCount={inclusionCount}
            estimatedFinalization={estimatedFinalization}
            onViewUTXO={handleViewUTXO}
            onViewKey={handleViewKey}
            onViewBlock={handleViewBlock}
          />
        </div>
      </div>

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