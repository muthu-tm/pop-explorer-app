
// QProof Explorer Types

// UI Types
export type TabId = 'home' | 'about' | 'dashboard' | 'messages' | 'proofs' | 'validation' | 'status';

export interface Tab {
  id: TabId;
  label: string;
  href: string;
}

// Core entities
export interface UTXO {
  utxo_id: string;
  initial_key: string;
  signature: string;
  message: string;
  block_number: number;
  next_key: string;
  created_at: string;
  status: 'pending' | 'finalized' | 'reorged';
}

export interface Key {
  address: string;
  signature: string;
  block_number: number;
  initial_key: string;
  next_key: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'finalized' | 'reorged';
  utxos: Array<{
    utxo_id: string;
    block_number: number;
    created_at: string;
  }> | null;
}

export interface Block {
  block_number: number;
  status: 'pending' | 'finalized' | 'skipped';
  utxo_count: number;
  key_count: number;
  message_count: number;
  timestamp?: number;
  hash?: string;
  root_hash?: string;
}

export interface Inclusion {
  type: 'utxo' | 'key';
  id: string; // UTXO ID or pubkey
  block_number: number;
  created_at: string;
  status?: 'pending' | 'finalized' | 'reorged';
}

// Proof related
export interface ProofLayer {
  layer_index: number;
  merkle_index: number;
  root: string;
  merkle_path: string[];
}

export interface ProofChain {
  proofchain_id: string;
  hash: string;
  parent_hash: string;
  timestamp: number;
  proof_chain: {
    layer_proofs?: any[];
  };
}

export interface MicroProof {
  subject: {
    block_number: number;
    thread_id: number;
    leaf_index: number;
    hash: string;
  };
  block_header: {
    block_number: number;
    status: string;
    created_at: number;
  };
  proof_chain?: Array<{
    layer_index: number;
    merkle_index: number;
    merkle_path?: string[];
    root: string;
    mss_signature: string;
  }>;
  verification: {
    valid: boolean;
  };
}

// UI State
export interface SearchFilters {
  query: string; // unified search for UTXO ID, pubkey, or block number
  blockNumber?: number; // for legacy compatibility
  threadID?: string; // for legacy compatibility
  leafIndex?: string; // for legacy compatibility
}

export interface AlertState {
  show: boolean;
  message: string;
  type: 'error' | 'success' | 'info';
}

export type StatusType = 'finalized' | 'pending' | 'reorged' | 'skipped';

// Legacy types for backward compatibility
export interface Message {
  block_number: number;
  thread_id: number;
  leaf_index: number;
  original: string;
  hash: string;
  microRoot: string;
}

export interface BlockStatus {
  block_number: number;
  status: StatusType;
}

export interface ValidationResult {
  valid: boolean;
  proof_layers: number;
  root: string;
  error_message?: string;
}

export interface BlockNumber {
  block_number: number;
  status: string;
  message_count: number;
}

// New API Response Types
export interface SearchResult {
  type: 'utxo' | 'key' | 'block';
  id: string;
  redirect_url: string;
  data: {
    block_number: number;
    status: string;
  };
}

export interface SearchSuggestion {
  type: 'utxo' | 'key' | 'block';
  id: string;
  text: string;
}

export interface ProofInfo {
  utxo_id?: string;
  key?: string;
  block_number: number;
  thread_id: number;
  leaf_index: number;
  status: 'pending' | 'finalized' | 'reorged';
  proof_url: string;
}

export interface SystemStats {
  total_blocks: number;
  total_utxos: number;
  total_keys: number;
  total_messages: number;
  current_block: number;
  pending_blocks: number;
  finalized_blocks: number;
}

export interface BlockStats {
  total_blocks: number;
  pending_blocks: number;
  finalized_blocks: number;
  average_utxos_per_block: number;
  average_keys_per_block: number;
  average_messages_per_block: number;
}

export interface UTXOStats {
  total_utxos: number;
  utxos_with_vows: number;
  send_vows: number;
  receive_vows: number;
  utxos_with_inputs: number;
}

// API Response wrappers
export interface UTXOResponse {
  utxo: UTXO;
  vows: Array<{
    vow_type: 'send' | 'receive';
    receiver_pubkey?: string;
    value?: number;
    initial_block?: number;
  }>;
  inputs: string[];
}

export interface KeyResponse {
  key: Key;
  utxos: UTXO[];
}

export interface BlockResponse {
  block: Block;
  inclusions: Inclusion[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}