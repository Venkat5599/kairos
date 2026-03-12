import { ChainConfig } from '../types/chain';

export const POLKADOT_HUB: ChainConfig = {
  chainId: 1000,
  name: 'Polkadot Hub',
  rpcUrl: process.env.POLKADOT_HUB_RPC_URL || 'https://polkadot-hub-rpc.example.com',
  explorerUrl: 'https://polkadot-hub.subscan.io',
  nativeCurrency: {
    name: 'DOT',
    symbol: 'DOT',
    decimals: 10,
  },
  isTestnet: false,
  parachainId: 1000,
};

export const ASSET_HUB: ChainConfig = {
  chainId: 1000,
  name: 'Asset Hub',
  rpcUrl: 'https://asset-hub-rpc.example.com',
  explorerUrl: 'https://assethub.subscan.io',
  nativeCurrency: {
    name: 'DOT',
    symbol: 'DOT',
    decimals: 10,
  },
  isTestnet: false,
  parachainId: 1000,
};

export const MOONBEAM: ChainConfig = {
  chainId: 2000,
  name: 'Moonbeam',
  rpcUrl: 'https://rpc.api.moonbeam.network',
  explorerUrl: 'https://moonbeam.moonscan.io',
  nativeCurrency: {
    name: 'GLMR',
    symbol: 'GLMR',
    decimals: 18,
  },
  isTestnet: false,
  parachainId: 2004,
};

export const SUPPORTED_CHAINS: ChainConfig[] = [
  POLKADOT_HUB,
  ASSET_HUB,
  MOONBEAM,
];

export const getChainById = (chainId: number): ChainConfig | undefined => {
  return SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId);
};

export const getChainByParachainId = (parachainId: number): ChainConfig | undefined => {
  return SUPPORTED_CHAINS.find((chain) => chain.parachainId === parachainId);
};
