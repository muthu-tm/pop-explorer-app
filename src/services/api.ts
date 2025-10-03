'use client';
import axios from 'axios';
import { 
  Message, 
  ProofChain, 
  BlockStatus, 
  ValidationResult, 
  SearchFilters, 
  BlockNumber,
  UTXO,
  Key,
  Block,
  Inclusion,
  MicroProof,
  SearchResult,
  SearchSuggestion,
  ProofInfo,
  SystemStats,
  BlockStats,
  UTXOStats,
  Vow,
  Input
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || 'http://localhost:8000';

const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging
ApiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
ApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  // Health check
  static async getHealth(): Promise<{ status: string }> {
    const response = await ApiClient.get('/health');
    return response.data;
  }

  // Search APIs
  static async search(query: string): Promise<SearchResult> {
    const response = await ApiClient.get('/search', { params: { q: query } });
    return response.data;
  }

  static async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    const response = await ApiClient.get('/search/suggestions', { params: { q: query } });
    return response.data.suggestions || [];
  }

  static async getRecentSearches(): Promise<SearchSuggestion[]> {
    const response = await ApiClient.get('/search/recent');
    return response.data.recent || [];
  }

  // Thread/Leaf Resolution APIs
  static async getUTXOProofInfo(utxoId: string): Promise<ProofInfo> {
    const response = await ApiClient.get(`/utxo-proof-info/${utxoId}`);
    return response.data;
  }

  static async getKeyProofInfo(pubkey: string): Promise<ProofInfo> {
    const response = await ApiClient.get(`/key-proof-info/${pubkey}`);
    return response.data;
  }

  // UTXO management
  static async getUTXO(utxoId: string): Promise<{
    utxo: UTXO;
    vows: Vow[] | null;
    inputs: Input[] | null;
  }> {
    const response = await ApiClient.get(`/utxo/${utxoId}`);
    return response.data;
  }

  static async getUTXOs(page = 1, limit = 50): Promise<{
    utxos: UTXO[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    const response = await ApiClient.get('/utxos', { 
      params: { page, limit } 
    });
    return response.data;
  }

  // Key management
  static async getKey(pubkey: string): Promise<{
    key: Key;
    utxos: UTXO[];
  }> {
    const response = await ApiClient.get(`/key/${pubkey}`);
    return response.data;
  }

  static async getKeys(page = 1, limit = 50): Promise<{
    keys: Key[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    const response = await ApiClient.get('/keys', { 
      params: { page, limit } 
    });
    return response.data;
  }

  // Block management
  static async getBlock(blockNumber: number): Promise<{
    block: Block;
    inclusions: Inclusion[];
  }> {
    const response = await ApiClient.get(`/block/${blockNumber}`);
    return response.data;
  }

  static async getBlocks(page = 1, limit = 50): Promise<{
    blocks: Block[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    const response = await ApiClient.get('/blocks', { 
      params: { page, limit } 
    });
    return response.data;
  }

  // Live streaming
  static async getCurrentBlockStatus(): Promise<{
    block_number: number;
    status: string;
    inclusion_count: number;
    timestamp: number;
  }> {
    const response = await ApiClient.get('/live/current-block');
    return response.data;
  }

  static async getLiveInclusions(): Promise<{
    block_number: number;
    inclusions: Inclusion[];
    timestamp: number;
  }> {
    const response = await ApiClient.get('/live/inclusions');
    return response.data;
  }

  // Real-time APIs (HTTP-based)
  static async getLiveInclusionsWS(): Promise<{
    block_number: number;
    inclusions: Inclusion[];
    timestamp: number;
    note: string;
  }> {
    const response = await ApiClient.get('/ws/live-inclusions');
    return response.data;
  }

  static async getBlockUpdatesWS(): Promise<{
    block_number: number;
    status: string;
    inclusion_count: number;
    timestamp: number;
    note: string;
  }> {
    const response = await ApiClient.get('/ws/block-updates');
    return response.data;
  }

  // Proof & verification
  static async getProof(block: string, thread: string, leaf: string): Promise<MicroProof> {
    const response = await ApiClient.get(`/proof/${block}/${thread}/${leaf}`);
    return response.data;
  }

  static async getProofchain(block: string, thread: string, leaf: string): Promise<ProofChain> {
    const response = await ApiClient.get(`/proofchain/${block}/${thread}/${leaf}`);
    return response.data;
  }

  // Analytics/Metrics APIs
  static async getSystemStats(): Promise<SystemStats> {
    const response = await ApiClient.get('/stats/overview');
    return response.data;
  }

  static async getBlockStats(): Promise<BlockStats> {
    const response = await ApiClient.get('/stats/blocks');
    return response.data;
  }

  static async getUTXOStats(): Promise<UTXOStats> {
    const response = await ApiClient.get('/stats/utxos');
    return response.data;
  }

  // Legacy APIs (for backward compatibility)
  static async getBlockStatus(blockNumber?: number): Promise<BlockStatus[]> {
    const params = blockNumber ? { block: blockNumber } : {};
    const response = await ApiClient.get('/status', { params });
    return Array.isArray(response.data) ? response.data : [];
  }

  static async getBlockNumber(): Promise<BlockNumber> {
    const response = await ApiClient.get('/block-number');
    return response.data;
  }

  static async getMessages(filters: SearchFilters): Promise<Message[]> {
    if (!filters.blockNumber) {
      throw new Error('Block number is required');
    }

    const params: any = { block: filters.blockNumber };
    
    if (filters.threadID) {
      params.thread = filters.threadID;
    }
    if (filters.leafIndex) {
      params.leaf = filters.leafIndex;
    }
    
    const response = await ApiClient.get('/messages', { params });
    return response.data.messages || [];
  }

  static async getFinalProof(block: string, thread: string, leaf: string): Promise<ProofChain> {
    const params = { block, thread, leaf };
    const response = await ApiClient.get('/finalproof', { params });
    return response.data;
  }

  static async validateProof(block: string, thread: string, leaf: string): Promise<ValidationResult> {
    const params = { block, thread, leaf };
    const response = await ApiClient.get('/validate', { params });
    return response.data;
  }
}