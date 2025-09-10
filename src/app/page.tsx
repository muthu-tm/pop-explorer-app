'use client';

// src/app/page.tsx
import { useState, useEffect } from 'react';
import { SearchFilters, Tab, TabId } from '@/types';
import { useAlerts } from '@/hooks/useAlerts';
import { useApiData } from '@/hooks/useApiData';

// Layout Components
import Header from '@/components/layout/Header';
import AlertSystem from '@/components/layout/AlertSystem';
import TabNavigation from '@/components/layout/TabNavigation';

// Feature Components
import SearchFiltersComponent from '../components/search/SearchFilters';
import MessagesTab from '@/components/tabs/MessagesTab';
import ProofChainsTab from '@/components/tabs/ProofChainsTab';
import BlockStatusTab from '@/components/tabs/BlockStatusTab';
import ValidationTab from '@/components/tabs/ValidationTab';

const TABS: Tab[] = [
  { id: 'messages', name: 'Messages' },
  { id: 'proofs', name: 'Proof Chains' },
  { id: 'status', name: 'Block Status' },
  { id: 'validation', name: 'Validation' }
];

export default function Dashboard() {
  // Local state
  const [activeTab, setActiveTab] = useState<TabId>('messages');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    blockNumber: '',
    threadID: '',
    leafIndex: ''
  });

  // Custom hooks
  const {
    errorAlert,
    successAlert,
    showError,
    showSuccess,
    clearError,
    clearSuccess,
    clearAlerts,
  } = useAlerts();

  const {
    messages,
    proofChain,
    blockStatus,
    validationResult,
    loading,
    loadMessages,
    loadProofChain,
    loadBlockStatus,
    validateProof,
    searchData,
    refreshData,
  } = useApiData();

  // Handlers
  const handleSearchFiltersChange = (newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  };

  const handleSearch = async () => {
    clearAlerts();
    await searchData(activeTab, searchFilters, showSuccess, showError);
  };

  const handleRefreshData = async () => {
    await refreshData(showSuccess, showError);
  };

  const handleViewBlock = (blockNumber: number) => {
    setSearchFilters(prev => ({ 
      ...prev, 
      blockNumber: blockNumber.toString(),
      threadID: '', 
      leafIndex: '' 
    }));
    setActiveTab('messages');
    
    // Load messages after state update
    setTimeout(() => {
      loadMessages(
        { blockNumber: blockNumber.toString(), threadID: '', leafIndex: '' },
        showSuccess,
        showError
      );
    }, 0);
  };

  const handleLoadMessages = async () => {
    await loadMessages(searchFilters, showSuccess, showError);
  };

  const handleLoadProofChain = async () => {
    await loadProofChain(searchFilters, showSuccess, showError);
  };

  const handleLoadBlockStatus = async () => {
    await loadBlockStatus(showSuccess, showError);
  };

  const handleValidateProof = async () => {
    await validateProof(searchFilters, showSuccess, showError);
  };

  // Effects
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'messages':
        return (
          <MessagesTab
            messages={messages}
            onLoadMessages={handleLoadMessages}
            isLoading={loading}
          />
        );
      case 'proofs':
        return (
          <ProofChainsTab
            proofChain={proofChain}
            onLoadProofChain={handleLoadProofChain}
            isLoading={loading}
          />
        );
      case 'status':
        return (
          <BlockStatusTab
            blockStatus={blockStatus}
            onLoadBlockStatus={handleLoadBlockStatus}
            onViewBlock={handleViewBlock}
            isLoading={loading}
          />
        );
      case 'validation':
        return (
          <ValidationTab
            validationResult={validationResult}
            onValidateProof={handleValidateProof}
            isLoading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <AlertSystem
        errorAlert={errorAlert}
        successAlert={successAlert}
        onClearError={clearError}
        onClearSuccess={clearSuccess}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <SearchFiltersComponent
          searchFilters={searchFilters}
          onFiltersChange={handleSearchFiltersChange}
        />

        <div className="bg-white shadow rounded-lg">
          <TabNavigation
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}