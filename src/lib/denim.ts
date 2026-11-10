import { defineChain } from 'viem';
import { base as viemBase } from 'viem/chains';
import { useState, useEffect } from 'react';
import { useBlockNumber } from 'wagmi';

/**
 * Base Mainnet with Denim Upgrade Specifications
 * Activated on Base Mainnet on November 5, 2026 at 18:00 UTC.
 * Replaced Flashblocks with a complete canonical block every 200ms.
 */
export const baseDenim = defineChain({
  ...viemBase,
  id: 8453,
  name: 'Base Mainnet (Denim)',
  network: 'base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
      webSocket: ['wss://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
  // Denim specifications: 200ms native block time
  blockTime: 200,
  testnet: false,
});

export interface DenimNetworkStatus {
  network: string;
  chainId: number;
  blockTimeMs: number;
  isDenimActive: boolean;
  flashblocksRetired: boolean;
  blockNumber?: bigint;
  lastUpdated: number;
}

/**
 * Hook to track Denim 200ms block updates via canonical `eth_blockNumber`
 * without any deprecated Flashblocks or "pending" tag polling.
 */
export function useDenimStatus(): DenimNetworkStatus {
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: baseDenim.id,
    query: {
      refetchInterval: 200, // Denim produces a canonical block every 200ms
    },
  });

  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    if (blockNumber) {
      setLastUpdated(Date.now());
    }
  }, [blockNumber]);

  return {
    network: 'Base Mainnet (Denim)',
    chainId: 8453,
    blockTimeMs: 200,
    isDenimActive: true,
    flashblocksRetired: true,
    blockNumber,
    lastUpdated,
  };
}

/**
 * Denim transaction validation helper:
 * Asserts that transactions never use `flashblock_index` predicates.
 * Denim only permits standard canonical `block_number` bounds.
 */
export function assertDenimTransactionSafety(options?: {
  blockNumberBound?: bigint;
  flashblockIndex?: number;
}) {
  if (options?.flashblockIndex !== undefined) {
    throw new Error(
      'flashblock_index predicates are not supported after Denim: blocks are built every 200ms without flashblocks'
    );
  }
  return true;
}
