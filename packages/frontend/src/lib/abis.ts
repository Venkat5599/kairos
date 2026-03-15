// Complete ABIs for Kairos contracts
export const INTENT_REGISTRY_ABI = [
  // Constructor
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  // Constants
  {
    type: 'function',
    name: 'MIN_STAKE',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'SLASH_AMOUNT',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  // Intent Management Functions
  {
    type: 'function',
    name: 'createIntent',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct IIntent.IntentParams',
        components: [
          { name: 'description', type: 'string', internalType: 'string' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
          { name: 'reward', type: 'uint256', internalType: 'uint256' },
          { name: 'deadline', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    outputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getIntent',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IIntent.Intent',
        components: [
          { name: 'id', type: 'bytes32', internalType: 'bytes32' },
          { name: 'creator', type: 'address', internalType: 'address' },
          { name: 'description', type: 'string', internalType: 'string' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
          { name: 'reward', type: 'uint256', internalType: 'uint256' },
          { name: 'deadline', type: 'uint256', internalType: 'uint256' },
          { name: 'status', type: 'uint8', internalType: 'enum IIntent.IntentStatus' },
          { name: 'solver', type: 'address', internalType: 'address' },
          { name: 'createdAt', type: 'uint256', internalType: 'uint256' },
          { name: 'executedAt', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllIntentIds',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32[]', internalType: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPendingIntentsCount',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllIntentIds',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32[]', internalType: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPendingIntentsCount',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'intents',
    inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [
      { name: 'id', type: 'bytes32', internalType: 'bytes32' },
      { name: 'creator', type: 'address', internalType: 'address' },
      { name: 'description', type: 'string', internalType: 'string' },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
      { name: 'reward', type: 'uint256', internalType: 'uint256' },
      { name: 'deadline', type: 'uint256', internalType: 'uint256' },
      { name: 'status', type: 'uint8', internalType: 'enum IIntent.IntentStatus' },
      { name: 'solver', type: 'address', internalType: 'address' },
      { name: 'createdAt', type: 'uint256', internalType: 'uint256' },
      { name: 'executedAt', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'executeIntent',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'completeIntent',
    inputs: [
      { name: 'intentId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'result', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'failIntent',
    inputs: [
      { name: 'intentId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'reason', type: 'string', internalType: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelIntent',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // Solver Functions
  {
    type: 'function',
    name: 'registerSolver',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'deregisterSolver',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimReward',
    inputs: [{ name: 'intentId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getSolverInfo',
    inputs: [{ name: 'solver', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct ISolver.SolverInfo',
        components: [
          { name: 'solverAddress', type: 'address', internalType: 'address' },
          { name: 'stake', type: 'uint256', internalType: 'uint256' },
          { name: 'reputation', type: 'uint256', internalType: 'uint256' },
          { name: 'totalExecuted', type: 'uint256', internalType: 'uint256' },
          { name: 'totalFailed', type: 'uint256', internalType: 'uint256' },
          { name: 'isActive', type: 'bool', internalType: 'bool' },
          { name: 'registeredAt', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  // Admin Functions
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  // Events
  {
    type: 'event',
    name: 'IntentCreated',
    inputs: [
      { name: 'intentId', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'creator', type: 'address', indexed: true, internalType: 'address' },
      { name: 'description', type: 'string', indexed: false, internalType: 'string' },
      { name: 'reward', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'deadline', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentExecuting',
    inputs: [
      { name: 'intentId', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'solver', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentCompleted',
    inputs: [
      { name: 'intentId', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'solver', type: 'address', indexed: true, internalType: 'address' },
      { name: 'result', type: 'bytes', indexed: false, internalType: 'bytes' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentFailed',
    inputs: [
      { name: 'intentId', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'solver', type: 'address', indexed: true, internalType: 'address' },
      { name: 'reason', type: 'string', indexed: false, internalType: 'string' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IntentCancelled',
    inputs: [
      { name: 'intentId', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'creator', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SolverRegistered',
    inputs: [
      { name: 'solver', type: 'address', indexed: true, internalType: 'address' },
      { name: 'stake', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SolverDeregistered',
    inputs: [
      { name: 'solver', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RewardClaimed',
    inputs: [
      { name: 'solver', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SolverSlashed',
    inputs: [
      { name: 'solver', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'reason', type: 'string', indexed: false, internalType: 'string' },
    ],
    anonymous: false,
  },
] as const;

// NameRegistry ABI (for when it's deployed)
export const NAME_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'registerName',
    inputs: [{ name: 'name', type: 'string', internalType: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'releaseName',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'resolve',
    inputs: [{ name: 'name', type: 'string', internalType: 'string' }],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isAvailable',
    inputs: [{ name: 'name', type: 'string', internalType: 'string' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nameToAddress',
    inputs: [{ name: '', type: 'string', internalType: 'string' }],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addressToName',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nameExists',
    inputs: [{ name: '', type: 'string', internalType: 'string' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'NameRegistered',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'name', type: 'string', indexed: false, internalType: 'string' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NameUpdated',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'oldName', type: 'string', indexed: false, internalType: 'string' },
      { name: 'newName', type: 'string', indexed: false, internalType: 'string' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NameReleased',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'name', type: 'string', indexed: false, internalType: 'string' },
    ],
    anonymous: false,
  },
] as const;
