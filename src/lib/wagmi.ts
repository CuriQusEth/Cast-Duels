import { createConfig, http } from 'wagmi';
import { QueryClient } from '@tanstack/react-query';
import { baseDenim } from './denim';

// Base Mainnet (Denim) - Canonical 200ms Block Architecture
export const config = createConfig({
  chains: [baseDenim],
  transports: {
    [baseDenim.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 200,
    }),
  },
  // Configured for Denim's 200ms canonical blocks
  pollingInterval: 200,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000,
      staleTime: 500,
    },
  },
});
