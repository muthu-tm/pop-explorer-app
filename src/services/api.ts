'use client';
import axios from 'axios';
import { Message, ProofChain, BlockStatus, ValidationResult, SearchFilters } from '@/types';

const API_URL = process.env.NEXT_APP_BACKEND_ENDPOINT || 'http://localhost:8000';

const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
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

  static async getProofChain(filters: SearchFilters): Promise<ProofChain> {
    if (!filters.blockNumber || !filters.threadID || !filters.leafIndex) {
      throw new Error('Block number, thread ID, and leaf index are all required');
    }

    const params = {
      block: filters.blockNumber,
      thread: filters.threadID,
      leaf: filters.leafIndex
    };
    
    const response = await ApiClient.get('/finalproof', { params });
    return response.data;
  }

  static async getBlockStatus(): Promise<BlockStatus[]> {
    const response = await ApiClient.get('/status');
    return Array.isArray(response.data) ? response.data : [];
  }

  static async validateProof(filters: SearchFilters): Promise<ValidationResult> {
    if (!filters.blockNumber) {
      throw new Error('Block number is required');
    }

    const params = {
      block: filters.blockNumber,
      thread: filters.threadID || '0',
      leaf: filters.leafIndex || '0'
    };

    const response = await ApiClient.get('/validate', { params });
    return response.data;
  }
}