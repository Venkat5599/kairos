# 🚀 Kairos - Intent-Based Execution for Polkadot

> **Making cross-chain execution as easy as sending a text message**

[![Polkadot Hub](https://img.shields.io/badge/Polkadot_Hub-TestNet-E6007A?style=for-the-badge)](https://blockscout-testnet.polkadot.io)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## 🎯 What is Kairos?

Kairos is an **intent-based execution platform** for the Polkadot ecosystem. Users express what they want in natural language (e.g., "send 1 PAS to 0x..."), and our automated solver network executes it efficiently across chains using XCM.

### The Problem
- Cross-chain operations on Polkadot are complex
- Users need to understand XCM, parachains, and technical details
- High barrier to entry for mainstream adoption

### The Solution
- **Natural language intents**: Type what you want, we handle the rest
- **Automated execution**: Solver network executes intents 24/7
- **Cross-chain ready**: Native XCM integration for Polkadot ecosystem

## ✨ Key Features

### 1. Natural Language Processing
```
User types: "send 1 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
Kairos: ✅ Intent created and executed automatically
```

### 2. AI-Powered Suggestions
- Autocomplete appears when typing 2+ characters
- Smart suggestions based on context
- Helps users write correct intents

### 3. Intent Templates Library
- 6 pre-built templates for common operations
- Simple transfers, cross-chain bridges, batch operations
- Filterable by category and difficulty
- One-click template insertion

### 4. XCM Bridge UI
- Visual cross-chain transfer interface
- 5 supported chains: Polkadot Hub, Polkadot Relay, Asset Hub, Astar, Moonbeam
- Chain selection with icons
- Swap chains functionality

### 5. Intent Marketplace
- Browse all pending intents
- Filter by type and sort by reward
- Solvers can claim and execute intents
- Earn rewards for successful execution

### 6. Automated Solver Network
- Bots monitor blockchain 24/7
- Automatic intent detection and execution
- Reputation system with staking
- Deployed on Railway for 24/7 uptime

### 7. Cross-Chain Ready
- Native XCM integration
- Support for multiple parachains
- Real cross-chain transfers
- Polkadot ecosystem native

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Frontend  │────▶│ Smart Contracts  │◀────│ Solver Bot  │
│  (Next.js)  │     │ (Polkadot Hub)   │     │  (Railway)  │
└─────────────┘     └──────────────────┘     └─────────────┘
      │                      │                       │
      │                      │                       │
      └──────────────────────┴───────────────────────┘
                    Blockchain Integration
```

## 📦 Deployed Contracts

**Network**: Polkadot Hub TestNet (Chain ID: 420420417)

- **IntentRegistry**: `0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2`
- **IntentRouter**: `0xEd3d29D7f2b3eC3708f52fa009d2E77Fb0DfAaD6`
- **XCMBridge**: `0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88`

**Block Explorer**: https://blockscout-testnet.polkadot.io

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or compatible wallet
- PAS tokens from [Polkadot Faucet](https://faucet.polkadot.io)

### Installation

```bash
# Clone repository
git clone https://github.com/Venkat5599/kairos.git
cd kairos

# Install dependencies
npm install

# Setup frontend
cd packages/frontend
npm install
cp .env.example .env.local
# Edit .env.local with your settings

# Start frontend
npm run dev
```

Visit http://localhost:3000

### Create Your First Intent

1. Connect your wallet (MetaMask)
2. Get PAS tokens from faucet
3. Type in the Intent Terminal:
   ```
   send 0.01 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   ```
4. Click "Execute Intent"
5. Watch the solver bot pick it up and execute!

## 🤖 Solver Bot Deployment

The solver bot is deployed on Railway and runs 24/7:

**Dashboard**: https://railway.com/project/77a014ca-68bc-486e-8b39-734adb48742d

### Deploy Your Own Solver

```bash
cd packages/solver-bot

# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway variables set SOLVER_PRIVATE_KEY=your_key
railway variables set RPC_URL=https://eth-rpc-testnet.polkadot.io
railway variables set INTENT_REGISTRY_ADDRESS=0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
railway up
```

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Wagmi v2 + RainbowKit
- ethers.js v6

### Smart Contracts
- Solidity 0.8.24
- Foundry
- OpenZeppelin
- XCM Precompiles

### Solver Bot
- Node.js 18
- TypeScript
- ethers.js v6
- Deployed on Railway

### Blockchain
- Polkadot Hub TestNet
- Chain ID: 420420417
- RPC: https://eth-rpc-testnet.polkadot.io
- Currency: PAS

## 📊 Project Structure

```
kairos/
├── packages/
│   ├── frontend/          # Next.js frontend
│   ├── contracts/         # Solidity smart contracts
│   ├── solver-bot/        # Automated solver bot
│   └── backend/           # Optional backend API
├── docs/                  # Documentation
└── README.md             # This file
```

## 🎯 Use Cases

### For Users
- **Simple Transfers**: Send tokens with natural language
- **Cross-Chain Bridges**: Transfer assets across parachains
- **Batch Operations**: Multiple transfers in one intent
- **DeFi Operations**: Swap, stake, provide liquidity

### For Solvers
- **Earn Rewards**: Execute intents and earn PAS tokens
- **Build Reputation**: Successful executions increase reputation
- **Automated Income**: Run bot 24/7 for passive income

### For Developers
- **Intent-Based dApps**: Build on top of Kairos
- **Cross-Chain Integration**: Easy XCM integration
- **Solver Network**: Leverage existing infrastructure

## 🏆 Hackathon Submission

**Track**: PVM Smart Contracts
**Network**: Polkadot Hub TestNet
**Status**: ✅ Production Ready

### What Makes This Special

1. **Innovation**: First intent-based execution platform for Polkadot
2. **User Experience**: Natural language > complex transactions
3. **Production Ready**: Fully deployed, not just a demo
4. **Technical Depth**: Smart contracts + AI + solver network + XCM
5. **Real Utility**: Solves actual UX problems in Web3
6. **Polkadot Native**: Built specifically for Polkadot ecosystem

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📧 Contact

- **GitHub**: https://github.com/Venkat5599/kairos
- **Issues**: https://github.com/Venkat5599/kairos/issues

## 🙏 Acknowledgments

- Polkadot team for the amazing XCM infrastructure
- Polkadot Hub TestNet for providing the testing environment
- Open source community for the tools and libraries

---

**Built with ❤️ for the Polkadot ecosystem**
