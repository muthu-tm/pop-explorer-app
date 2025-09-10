

export interface Message {
    block_number: number;
    thread_id: number;
    leaf_index: number;
    original: string;
    hash: string;
    microRoot: string;
  }
  
  export interface ProofLayer {
    layer_index: number;
    merkle_index: number;
    root: string;
    merkle_path: string[];
  }
  
  export interface ProofChain {
    block_number: number;
    thread_id: number;
    leaf_index: number;
    proof_chain: ProofLayer[];
  }
  
  export interface BlockStatus {
    block_number: number;
    status: string;
  }
  
  export interface ValidationResult {
    valid: boolean;
    proof_layers: number;
    root: string;
    error_message?: string;
  }
  
  export interface SearchFilters {
    blockNumber: string;
    threadID: string;
    leafIndex: string;
  }
  
  export type TabId = 'messages' | 'proofs' | 'status' | 'validation';
  
  export interface Tab {
    id: TabId;
    name: string;
  }
  
  export interface AlertState {
    show: boolean;
    message: string;
  }
  
  export type StatusType = 'finalized' | 'pending' | 'skipped' | string;

export interface BlockNumber {
  block_number: number;
  status: string;
  message_count: number;
}