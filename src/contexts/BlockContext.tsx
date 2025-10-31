'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BlockContextType {
  currentBlock: number | null;
  tipBlock: number | null;
  setCurrentBlock: (block: number | null) => void;
  setTipBlock: (block: number | null) => void;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

export function BlockProvider({ children }: { children: ReactNode }) {
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const [tipBlock, setTipBlock] = useState<number | null>(null);

  return (
    <BlockContext.Provider
      value={{
        currentBlock,
        tipBlock,
        setCurrentBlock,
        setTipBlock,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
}

export function useBlockContext() {
  const context = useContext(BlockContext);
  if (context === undefined) {
    throw new Error('useBlockContext must be used within a BlockProvider');
  }
  return context;
}
