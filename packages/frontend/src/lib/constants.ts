export const INTENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS;
export const INTENT_ROUTER_ADDRESS = process.env.NEXT_PUBLIC_INTENT_ROUTER_ADDRESS;
export const XCM_BRIDGE_ADDRESS = process.env.NEXT_PUBLIC_XCM_BRIDGE_ADDRESS;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

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

