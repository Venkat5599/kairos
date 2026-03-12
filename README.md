# Kairos ⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Moonbeam](https://img.shields.io/badge/Moonbeam-Testnet-purple)](https://moonbeam.network/)

> **Kairos** (Greek: "the perfect moment") - Cross-chain intent execution layer built on Polkadot

Kairos removes blockchain complexity by allowing users to submit high-level intents instead of complex transactions. The protocol automatically determines optimal execution paths using solver bots, cross-chain messaging (XCM), and intelligent routing.

## ✨ Features

- 🎯 **Intent-Based Execution** - Submit what you want, not how to do it
- 🌉 **Cross-Chain Support** - Seamless operations across Polkadot parachains
- 🤖 **Solver Network** - Decentralized bots compete to execute intents optimally
- ⚡ **XCM Integration** - Native cross-chain messaging via Polkadot XCM
- 🎨 **Cyberpunk UI** - Sleek, hacker-aesthetic interface
- 🔒 **Economic Security** - Staking and slashing mechanisms for solver accountability

## 🚀 Quick Start

### Deploy to Moonbase Alpha (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/Venkat5599/kairos.git
cd kairos

# 2. Install dependencies
npm install

# 3. Get testnet tokens
# Visit: https://faucet.moonbeam.network/

# 4. Deploy contracts
cd packages/contracts
bash check-devnet-ready.sh
bash deploy-moonbase.sh

# 5. Start frontend
cd ../frontend
npm run dev
```

📚 See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (Next.js + RainbowKit)                       │
└────────────────────────┬────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Intent Smart Contracts                       │
│              (Solidity on Moonbase Alpha)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ IntentRegistry│  │ IntentRouter │  │ XCMBridge    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Solver Bot Network                           │
│                  (TypeScript Workers)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Intent       │  │ Route        │  │ XCM          │         │
│  │ Listener     │  │ Calculator   │  │ Executor     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## 💡 Example Intents

```typescript
// Simple transfer
"Send 20 USDC to Alice"

// Cross-chain swap
"Swap DOT to USDC and send to Moonbeam"

// Yield optimization
"Move funds to chain with highest APY"
```

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity 0.8.24, Foundry, OpenZeppelin
- **Frontend**: Next.js 14, TailwindCSS, Wagmi, RainbowKit
- **Backend**: NestJS, Prisma, PostgreSQL
- **Solver Bots**: TypeScript, ethers.js, polkadot.js
- **Indexing**: Subsquid
- **Network**: Moonbase Alpha (Moonbeam Testnet)

## 📁 Project Structure

```
kairos/
├── packages/
│   ├── contracts/          # Solidity smart contracts
│   ├── backend/            # NestJS API server
│   ├── frontend/           # Next.js user interface
│   ├── solver-bot/         # Solver bot workers
│   └── indexer/            # Subsquid event indexer
├── docs/                   # Documentation
├── docker/                 # Docker configurations
└── scripts/                # Deployment scripts
```

## 🎯 How It Works

1. **User creates intent** - Submit high-level goal through UI
2. **Intent stored on-chain** - Recorded in IntentRegistry contract
3. **Solvers compete** - Bots calculate optimal execution paths
4. **Best solver executes** - Winning solver performs the transaction
5. **Cross-chain if needed** - XCM messages sent to other chains
6. **Verification & reward** - Contract verifies execution, solver gets paid

## 🌐 Network Information

### Moonbase Alpha Testnet

| Property | Value |
|----------|-------|
| Network Name | Moonbase Alpha |
| RPC URL | https://rpc.api.moonbase.moonbeam.network |
| Chain ID | 1287 |
| Currency | DEV |
| Block Explorer | https://moonbase.moonscan.io |
| Faucet | https://faucet.moonbeam.network/ |

## 📖 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started in 5 minutes
- [Architecture](./docs/ARCHITECTURE.md) - System design and components
- [Smart Contracts](./docs/CONTRACTS.md) - Contract specifications
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [API Documentation](./docs/API.md) - Backend API reference
- [Devnet Setup](./packages/contracts/DEVNET_SETUP.md) - Testnet deployment

## 🎨 Design

Kairos features a cyberpunk-inspired interface with:
- Electric pink (#FF006E) primary color
- Dark, terminal-style aesthetics
- Glitch effects and scanlines
- Japanese color influences

See [KAIROS_CYBERPUNK_DESIGN.md](./KAIROS_CYBERPUNK_DESIGN.md) for design specifications.

## 🧪 Development

### Prerequisites

- Node.js 20+
- Foundry
- Git

### Setup

```bash
# Install dependencies
npm install

# Build contracts
cd packages/contracts
forge build

# Run tests
forge test

# Start frontend
cd ../frontend
npm run dev
```

### Testing

```bash
# Smart contract tests
cd packages/contracts
forge test -vvv

# Frontend tests
cd packages/frontend
npm test

# Backend tests
cd packages/backend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Polkadot ecosystem
- Powered by Moonbeam's EVM compatibility
- Inspired by intent-based architectures

## 🔗 Links

- [GitHub Repository](https://github.com/Venkat5599/kairos)
- [Moonbeam Documentation](https://docs.moonbeam.network/)
- [Polkadot Documentation](https://wiki.polkadot.network/)

---

**Built with ❤️ for the Polkadot ecosystem**
