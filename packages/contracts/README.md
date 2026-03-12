# Kairos Smart Contracts

Solidity smart contracts for the Kairos protocol, built with Foundry.

## Contracts

### IntentRegistry
Core contract for managing user intents. Handles intent creation, execution tracking, and solver coordination.

**Key Features**:
- Intent lifecycle management (Pending → Executing → Completed/Failed)
- Solver registration with staking mechanism
- Reward distribution with reputation bonuses
- Intent cancellation by creators

### IntentRouter
Routes intents to appropriate execution strategies based on intent type and complexity.

**Route Types**:
- Direct: Simple transfers
- Swap: Token swaps
- CrossChain: Cross-chain operations via XCM
- Complex: Multi-step operations

### XCMBridge
Handles cross-chain message passing using Polkadot's XCM protocol.

**Supported Chains**:
- Asset Hub (1000)
- Moonbeam (2000)
- Moonriver (2004)

## Development

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Install Dependencies
```bash
forge install
```

### Build
```bash
forge build
```

### Test
```bash
forge test -vvv
```

### Coverage
```bash
forge coverage
```

### Deploy to Moonbase Alpha

```bash
# 1. Check readiness
bash check-devnet-ready.sh

# 2. Get testnet tokens from https://faucet.moonbeam.network/

# 3. Configure your private key in .env.moonbase

# 4. Deploy
bash deploy-moonbase.sh
```

See [DEVNET_SETUP.md](./DEVNET_SETUP.md) for detailed instructions.

## Contract Addresses

After deployment, update `packages/frontend/.env.local` with:
- IntentRegistry address
- IntentRouter address
- XCMBridge address

## Architecture

```
┌─────────────────┐
│ IntentRegistry  │  Core intent management
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──────┐ ┌▼──────────┐
│IntentRouter│ │ XCMBridge │
└───────────┘ └───────────┘
```

## Events

### IntentRegistry
- `IntentCreated(bytes32 intentId, address creator, ...)`
- `IntentExecuting(bytes32 intentId, address solver)`
- `IntentCompleted(bytes32 intentId, address solver, bytes result)`
- `IntentFailed(bytes32 intentId, address solver, string reason)`
- `SolverRegistered(address solver, uint256 stake)`

### XCMBridge
- `XCMMessageSent(bytes32 messageId, uint32 destinationChain, ...)`
- `XCMMessageDelivered(bytes32 messageId, uint32 sourceChain)`

## Security

- Solver staking mechanism prevents malicious behavior
- Slashing for failed executions
- Intent deadline enforcement
- Reentrancy protection via Checks-Effects-Interactions pattern

## License

MIT
