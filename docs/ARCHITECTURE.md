# 🏗️ Kairos Architecture

## System Overview

Kairos is an intent-based execution layer for Polkadot that uses natural language to trigger cross-chain operations via XCM.

```
User → Frontend → Smart Contracts → Solver Bot → XCM Precompiles → Polkadot
```

## Core Components

### 1. Smart Contracts (Moonbase Alpha)

**IntentRegistry** (`0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB`)
- Stores user intents
- Manages intent lifecycle (Pending → Executing → Completed)
- Handles solver registration and staking

**IntentRouter** (`0x7E7d7D50353213c96aa1b6697c3e6407B4Df38AF`)
- Routes intents to appropriate solvers
- Validates execution paths
- Manages rewards distribution

**XCMBridge** (`0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234`)
- Integrates with Moonbeam precompiles
- Executes cross-chain transfers via Xtokens (`0x...0804`)
- Enables remote staking/governance via XCM Transactor (`0x...0806`)

### 2. Frontend (Next.js)

- Natural language input terminal
- Real-time blockchain data display
- Wallet integration (MetaMask, WalletConnect)
- Live intent monitoring

### 3. Solver Bot (TypeScript)

- Monitors pending intents
- Parses natural language descriptions
- Executes blockchain transactions
- Claims rewards

### 4. XCM Integration

Uses real Moonbeam precompiles:
- **Xtokens** (`0x0000000000000000000000000000000000000804`) - Cross-chain token transfers
- **XCM Transactor** (`0x0000000000000000000000000000000000000806`) - Remote execution

## Data Flow

1. **User creates intent**: "Send 1 DOT to Polkadot"
2. **Frontend parses**: Extracts amount, destination, chain
3. **Contract stores**: Intent saved with reward
4. **Solver detects**: Bot polls for pending intents
5. **Solver executes**: Calls XCM precompile
6. **XCM transfers**: Tokens move cross-chain
7. **Solver claims**: Receives reward for execution

## Security

- ReentrancyGuard on all state-changing functions
- Solver staking (1 DEV minimum)
- Slashing for failed executions
- Pausable in emergencies
- Owner-only admin functions

## Tech Stack

- **Contracts**: Solidity 0.8.24, Foundry
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Moonbase Alpha (Testnet)
- **Wallet**: wagmi, viem, RainbowKit
- **Testing**: Forge (100+ tests)
