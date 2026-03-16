import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Define Polkadot Hub TestNet
export const polkadotHubTestnet = defineChain({
  id: 420420417,
  name: 'Polkadot Hub TestNet',
  nativeCurrency: {
    decimals: 18,
    name: 'PAS',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-rpc-testnet.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-testnet.polkadot.io',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'Kairos',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'kairos-local-dev',
  chains: [polkadotHubTestnet],
  transports: {
    [polkadotHubTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-rpc-testnet.polkadot.io'),
  },
  ssr: true,
});
