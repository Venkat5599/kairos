import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Define Moonbase Alpha testnet
export const moonbaseAlpha = defineChain({
  id: 1287,
  name: 'Moonbase Alpha',
  nativeCurrency: {
    decimals: 18,
    name: 'DEV',
    symbol: 'DEV',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.api.moonbase.moonbeam.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Moonscan',
      url: 'https://moonbase.moonscan.io',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'Kairos',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'kairos-local-dev',
  chains: [moonbaseAlpha],
  transports: {
    [moonbaseAlpha.id]: http(),
  },
  ssr: true,
});
