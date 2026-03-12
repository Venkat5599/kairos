# IntentFlow Solver Bot

Autonomous bot that listens for intents and executes them automatically.

## Features

- Real-time intent monitoring via events
- Automatic route calculation
- Cross-chain execution via XCM
- Reward optimization
- Failure handling and retry logic

## Architecture

```
┌─────────────────┐
│ Intent Listener │  Monitors blockchain events
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Route Calculator│  Determines optimal execution path
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Executors     │  Direct / Swap / XCM / Complex
└─────────────────┘
```

## Setup

### Prerequisites
- Node.js 20+
- Solver private key with DOT for staking

### Installation
```bash
npm install
```

### Configuration

Create `.env` file:
```env
POLKADOT_HUB_RPC_URL=https://polkadot-hub-rpc.example.com
SOLVER_PRIVATE_KEY=your_private_key_here
INTENT_REGISTRY_ADDRESS=0x...
XCM_BRIDGE_ADDRESS=0x...
BACKEND_API_URL=http://localhost:3001
SOLVER_POLL_INTERVAL=5000
SOLVER_MIN_REWARD=0.01
SOLVER_GAS_LIMIT=500000
LOG_LEVEL=info
```

### Running

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## How It Works

1. **Registration**: Bot registers as solver with stake
2. **Listening**: Monitors IntentCreated events
3. **Route Calculation**: Determines optimal execution path
4. **Execution**: Claims and executes intent
5. **Completion**: Marks intent as completed and claims reward

## Route Types

- **Direct**: Simple transfers
- **Swap**: Token swaps via DEX
- **Cross-Chain**: XCM-based cross-chain operations
- **Complex**: Multi-step operations

## Reward System

- Base reward from intent creator
- Reputation bonus (1% per 100 reputation points)
- Gas cost reimbursement
- Slashing for failures

## Monitoring

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

## Safety

- Minimum reward threshold
- Gas limit protection
- Automatic failure handling
- Stake slashing for malicious behavior

## License

MIT
