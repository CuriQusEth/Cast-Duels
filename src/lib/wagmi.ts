import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'viem/chains';
import { QueryClient } from '@tanstack/react-query';

export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export const queryClient = new QueryClient();
