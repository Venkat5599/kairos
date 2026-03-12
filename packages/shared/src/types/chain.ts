export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  parachainId?: number;
}

export interface XCMConfig {
  sourceChain: number;
  destinationChain: number;
  gasLimit: number;
  fee: string;
}
