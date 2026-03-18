export const INTENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS;
export const INTENT_ROUTER_ADDRESS = process.env.NEXT_PUBLIC_INTENT_ROUTER_ADDRESS;
export const XCM_BRIDGE_ADDRESS = process.env.NEXT_PUBLIC_XCM_BRIDGE_ADDRESS;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

// Token addresses
export const MOCK_USDC_ADDRESS = process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS;
export const MOCK_USDT_ADDRESS = process.env.NEXT_PUBLIC_MOCK_USDT_ADDRESS;

// Supported tokens for rewards
export const SUPPORTED_TOKENS = [
  {
    symbol: 'DEV',
    name: 'Native DEV',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    icon: '💎',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: MOCK_USDC_ADDRESS || '',
    decimals: 6,
    icon: '💵',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: MOCK_USDT_ADDRESS || '',
    decimals: 6,
    icon: '💵',
  },
] as const;

// Intent configuration
export const DEFAULT_DEADLINE_HOURS = 24;

// Status colors for UI
export const STATUS_COLORS = {
  Pending: 'blue',
  Executing: 'pink',
  Completed: 'green',
  Failed: 'red',
  Cancelled: 'gray',
} as const;

// Status progress percentages
export const STATUS_PROGRESS = {
  Pending: 0,
  Executing: 50,
  Completed: 100,
  Failed: 100,
  Cancelled: 0,
} as const;

