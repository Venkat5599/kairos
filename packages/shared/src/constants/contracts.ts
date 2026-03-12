export const CONTRACT_ADDRESSES = {
  INTENT_REGISTRY: process.env.INTENT_REGISTRY_ADDRESS || '',
  INTENT_ROUTER: process.env.INTENT_ROUTER_ADDRESS || '',
  XCM_BRIDGE: process.env.XCM_BRIDGE_ADDRESS || '',
};

export const MIN_SOLVER_STAKE = '1000000000000000000'; // 1 ETH in wei
export const MIN_INTENT_REWARD = '10000000000000000'; // 0.01 ETH in wei
export const MAX_INTENT_DEADLINE = 86400; // 24 hours in seconds
export const SOLVER_SLASH_AMOUNT = '100000000000000000'; // 0.1 ETH in wei
