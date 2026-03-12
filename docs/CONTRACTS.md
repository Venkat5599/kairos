# IntentFlow Smart Contracts

Comprehensive documentation for IntentFlow smart contracts.

## Overview

IntentFlow uses three core smart contracts deployed on Polkadot Hub (EVM compatible):

1. **IntentRegistry** - Core intent management
2. **IntentRouter** - Route calculation and optimization
3. **XCMBridge** - Cross-chain message passing

## Contract Addresses

### Testnet
- IntentRegistry: `TBD`
- IntentRouter: `TBD`
- XCMBridge: `TBD`

### Mainnet
- IntentRegistry: `TBD`
- IntentRouter: `TBD`
- XCMBridge: `TBD`

## IntentRegistry

### Purpose
Manages the complete lifecycle of intents, from creation to execution and completion.

### Key Features
- Intent creation with reward escrow
- Solver registration with staking
- Intent execution tracking
- Reward distribution
- Slashing mechanism for failures

### Data Structures

#### Intent
```solidity
struct Intent {
    bytes32 id;              // Unique identifier
    address creator;         // Intent creator
    string description;      // Human-readable description
    bytes data;             // Encoded execution data
    uint256 reward;         // Reward amount in wei
    uint256 deadline;       // Execution deadline (timestamp)
    IntentStatus status;    // Current status
    address solver;         // Assigned solver
    uint256 createdAt;      // Creation timestamp
    uint256 executedAt;     // Execution timestamp
}
```

#### IntentStatus
```solidity
enum IntentStatus {
    Pending,    // Waiting for solver
    Executing,  // Claimed by solver
    Completed,  // Successfully executed
    Failed,     // Execution failed
    Cancelled   // Cancelled by creator
}
```

#### SolverInfo
```solidity
struct SolverInfo {
    address solverAddress;
    uint256 stake;
    uint256 reputation;
    uint256 totalExecuted;
    uint256 totalFailed;
    bool isActive;
    uint256 registeredAt;
}
```

### Functions

#### createIntent
```solidity
function createIntent(IntentParams calldata params)
    external
    payable
    returns (bytes32 intentId)
```

Creates a new intent with reward escrow.

**Parameters:**
- `params.description` - Human-readable intent description
- `params.data` - Encoded execution data
- `params.reward` - Reward amount (must match msg.value)
- `params.deadline` - Execution deadline

**Returns:** Unique intent ID

**Events:** `IntentCreated`

**Requirements:**
- `msg.value >= params.reward`
- `params.deadline > block.timestamp`
- `description` not empty

#### executeIntent
```solidity
function executeIntent(bytes32 intentId) external
```

Claim an intent for execution (solver only).

**Parameters:**
- `intentId` - Intent to execute

**Events:** `IntentExecuting`

**Requirements:**
- Caller is active solver
- Intent status is Pending
- Intent not expired

#### completeIntent
```solidity
function completeIntent(bytes32 intentId, bytes calldata result) external
```

Mark intent as completed and claim reward.

**Parameters:**
- `intentId` - Intent identifier
- `result` - Execution result data

**Events:** `IntentCompleted`, `RewardClaimed`

**Requirements:**
- Caller is assigned solver
- Intent status is Executing

#### failIntent
```solidity
function failIntent(bytes32 intentId, string calldata reason) external
```

Mark intent as failed.

**Parameters:**
- `intentId` - Intent identifier
- `reason` - Failure reason

**Events:** `IntentFailed`, `SolverSlashed`

**Side Effects:**
- Solver stake reduced by SLASH_AMOUNT (0.1 ETH)

#### cancelIntent
```solidity
function cancelIntent(bytes32 intentId) external
```

Cancel a pending intent (creator only).

**Parameters:**
- `intentId` - Intent to cancel

**Events:** `IntentCancelled`

**Requirements:**
- Caller is intent creator
- Intent status is Pending

**Side Effects:**
- Reward refunded to creator

#### registerSolver
```solidity
function registerSolver(uint256 stake) external
```

Register as a solver.

**Parameters:**
- `stake` - Amount to stake (minimum 1 ETH)

**Events:** `SolverRegistered`

**Requirements:**
- Not already registered
- `stake >= MIN_STAKE`

#### deregisterSolver
```solidity
function deregisterSolver() external
```

Deregister as solver and withdraw stake.

**Events:** `SolverDeregistered`

**Side Effects:**
- Stake returned to solver

### Events

```solidity
event IntentCreated(
    bytes32 indexed intentId,
    address indexed creator,
    string description,
    uint256 reward,
    uint256 deadline
);

event IntentExecuting(
    bytes32 indexed intentId,
    address indexed solver
);

event IntentCompleted(
    bytes32 indexed intentId,
    address indexed solver,
    bytes result
);

event IntentFailed(
    bytes32 indexed intentId,
    address indexed solver,
    string reason
);

event SolverRegistered(
    address indexed solver,
    uint256 stake
);

event SolverSlashed(
    address indexed solver,
    uint256 amount,
    string reason
);
```

## IntentRouter

### Purpose
Calculates optimal execution routes for intents.

### Route Types

```solidity
enum RouteType {
    Direct,      // Simple transfer
    Swap,        // Token swap
    CrossChain,  // Cross-chain via XCM
    Complex      // Multi-step operation
}
```

### Functions

#### calculateRoute
```solidity
function calculateRoute(bytes32 intentId, bytes calldata intentData)
    external
    returns (Route memory route)
```

Calculate optimal route for intent execution.

**Returns:**
```solidity
struct Route {
    RouteType routeType;
    address[] path;
    uint256 estimatedGas;
    uint256 estimatedTime;
    bytes additionalData;
}
```

## XCMBridge

### Purpose
Handles cross-chain message passing using Polkadot's XCM protocol.

### Supported Chains

- Asset Hub (1000)
- Moonbeam (2000)
- Moonriver (2004)

### Functions

#### sendXCMMessage
```solidity
function sendXCMMessage(
    uint32 destinationChain,
    bytes calldata payload,
    uint256 gasLimit
) external payable returns (bytes32 messageId)
```

Send cross-chain message via XCM.

**Parameters:**
- `destinationChain` - Target parachain ID
- `payload` - Message payload
- `gasLimit` - Gas limit for execution

**Returns:** Unique message ID

**Events:** `XCMMessageSent`

**Requirements:**
- `msg.value >= BASE_FEE`
- Destination chain supported

#### confirmDelivery
```solidity
function confirmDelivery(bytes32 messageId, uint32 sourceChain) external
```

Confirm message delivery (relayer only).

**Events:** `XCMMessageDelivered`

### Events

```solidity
event XCMMessageSent(
    bytes32 indexed messageId,
    uint32 indexed destinationChain,
    bytes payload,
    uint256 fee
);

event XCMMessageDelivered(
    bytes32 indexed messageId,
    uint32 indexed sourceChain
);
```

## Security Considerations

### Reentrancy Protection
All state-changing functions follow Checks-Effects-Interactions pattern.

### Access Control
- Solver-only functions require active solver status
- Creator-only functions verify msg.sender

### Economic Security
- Minimum stake requirement (1 ETH)
- Slashing for failures (0.1 ETH)
- Deadline enforcement

### Input Validation
- All user inputs validated
- Address zero checks
- Amount checks

## Gas Optimization

- Use of `calldata` for read-only parameters
- Efficient storage patterns
- Minimal SLOAD operations
- Event indexing for off-chain queries

## Upgrade Strategy

Contracts are currently non-upgradeable. Future versions may implement:
- Proxy pattern (UUPS or Transparent)
- Governance-controlled upgrades
- Migration mechanisms

## Testing

### Unit Tests
```bash
forge test -vvv
```

### Coverage
```bash
forge coverage
```

### Gas Snapshots
```bash
forge snapshot
```

## Deployment

### Local (Anvil)
```bash
anvil &
forge script script/Deploy.s.sol --rpc-url localhost --broadcast
```

### Testnet
```bash
forge script script/Deploy.s.sol --rpc-url polkadot_hub --broadcast --verify
```

## Verification

### Verify on Explorer
```bash
forge verify-contract \
    --chain-id 1000 \
    --compiler-version v0.8.24 \
    CONTRACT_ADDRESS \
    src/IntentRegistry.sol:IntentRegistry
```

## Audits

- [ ] Internal review completed
- [ ] External audit pending
- [ ] Bug bounty program planned

## Known Limitations

1. **XCM Integration**: Simplified implementation, production requires full XCM precompile integration
2. **Route Calculation**: Basic heuristics, can be improved with off-chain computation
3. **Governance**: No on-chain governance yet

## Future Enhancements

1. **Intent Batching**: Execute multiple intents atomically
2. **Privacy**: Zero-knowledge intent execution
3. **MEV Protection**: Prevent front-running
4. **Advanced Routing**: AI-powered route optimization
5. **Multi-Chain**: Support more chains beyond Polkadot ecosystem

## Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Polkadot XCM](https://wiki.polkadot.network/docs/learn-xcm)

## License

MIT
