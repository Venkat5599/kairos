export const INTENT_STATUS = {
  PENDING: 'PENDING',
  EXECUTING: 'EXECUTING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

export const STATUS_COLORS = {
  PENDING: 'blue',
  EXECUTING: 'pink',
  COMPLETED: 'green',
  FAILED: 'red',
  CANCELLED: 'gray',
} as const;

export const STATUS_PROGRESS = {
  PENDING: 25,
  EXECUTING: 50,
  COMPLETED: 100,
  FAILED: 0,
  CANCELLED: 0,
} as const;

export const POLLING_INTERVAL = 10000; // 10 seconds
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_REWARD = '0.01'; // ETH
export const DEFAULT_DEADLINE_HOURS = 24;
