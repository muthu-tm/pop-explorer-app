'use client';  
import { useState, useCallback } from 'react';
import { 
  Message, 
  ProofChain, 
  BlockStatus, 
  ValidationResult, 
  SearchFilters, 
  TabId 
} from '@/types';
import { ApiService } from '@/services/api';

export const useApiData = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [proofChain, setProofChain] = useState<ProofChain | null>(null);
  const [blockStatus, setBlockStatus] = useState<BlockStatus[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async (
    filters: SearchFilters,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => {
    try {
      const data = await ApiService.getMessages(filters);
      setMessages(data);
      
      if (data.length > 0) {
        onSuccess?.(`Loaded ${data.length} messages successfully`);
      } else {
        onSuccess?.('No messages found for the specified search criteria');
      }
    } catch (error: any) {
      console.error('Error loading messages:', error);
      onError?.(`Failed to load messages: ${error.message}`);
      setMessages([]);
    }
  }, []);

  const loadProofChain = useCallback(async (
    filters: SearchFilters,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => {
    try {
      const data = await ApiService.getProofChain(filters);
      setProofChain(data);
      onSuccess?.('Proof chain loaded successfully');
    } catch (error: any) {
      console.error('Error loading proof chain:', error);
      onError?.(`Failed to load proof chain: ${error.message}`);
      setProofChain(null);
    }
  }, []);

  const loadBlockStatus = useCallback(async (
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => {
    try {
      const data = await ApiService.getBlockStatus();
      setBlockStatus(data);
      
      if (data.length > 0) {
        onSuccess?.(`Loaded ${data.length} block statuses successfully`);
      } else {
        onSuccess?.('No block statuses found');
      }
    } catch (error: any) {
      console.error('Error loading block status:', error);
      onError?.(`Failed to load block status: ${error.message}`);
      setBlockStatus([]);
    }
  }, []);

  const validateProof = useCallback(async (
    filters: SearchFilters,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => {
    try {
      const data = await ApiService.validateProof(filters);
      setValidationResult(data);
      onSuccess?.('Proof validation completed successfully');
    } catch (error: any) {
      console.error('Error validating proof:', error);
      onError?.(`Failed to validate proof: ${error.message}`);
      setValidationResult(null);
    }
  }, []);

  const searchData = useCallback(async (
    activeTab: TabId,
    filters: SearchFilters,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => {
    setLoading(true);
    
    try {
      switch (activeTab) {
        case 'messages':
          await loadMessages(filters, onSuccess, onError);
          break;
        case 'proofs':
          await loadProofChain(filters, onSuccess, onError);
          break;
        case 'status':
          await loadBlockStatus(onSuccess, onError);
          break;
        case 'validation':
          await validateProof(filters, onSuccess, onError);
          break;
      }
    } finally {
      setLoading(false);
    }
  }, [loadMessages, loadProofChain, loadBlockStatus, validateProof]);

  const refreshData = useCallback(async (
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => {
    setLoading(true);
    try {
      await loadBlockStatus(onSuccess, onError);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadBlockStatus]);

  return {
    // State
    messages,
    proofChain,
    blockStatus,
    validationResult,
    loading,
    
    // Actions
    loadMessages,
    loadProofChain,
    loadBlockStatus,
    validateProof,
    searchData,
    refreshData,
  };
};