// components/index.ts - Centralized component exports

// Layout Components
export { default as Header } from './layout/Header';
export { default as AlertSystem } from './layout/AlertSystem';
export { default as TabNavigation } from './layout/TabNavigation';

// Search Components
export { default as SearchFilters } from './search/SearchFilters';

// Tab Components
export { default as MessagesTab } from './tabs/MessagesTab';
export { default as ProofChainsTab } from './tabs/ProofChainsTab';
export { default as BlockStatusTab } from './tabs/BlockStatusTab';
export { default as ValidationTab } from './tabs/ValidationTab';

// Table Components
export { default as MessagesTable } from './tables/MessagesTable';
export { default as BlockStatusTable } from './tables/BlockStatusTable';
export { default as ProofChainDisplay } from './tables/ProofChainDisplay';
export { default as ValidationDisplay } from './tables/ValidationDisplay';

// UI Components
export * from './ui';
