# 🚀 Kairos - Intent-Based Execution for Polkadot

> **Making cross-chain execution as easy as sending a text message**

[![Polkadot Hub](https://img.shields.io/badge/Polkadot_Hub-TestNet-E6007A?style=for-the-badge)](https://blockscout-testnet.polkadot.io)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## 🎯 What is Kairos?

Kairos is an **intent-based execution platform** for the Polkadot ecosystem. Users express what they want in natural language (e.g., "send 1 PAS to 0x..."), and the system executes it directly through smart contracts.

### The Problem
- Cross-chain operations on Polkadot are complex
- Users need to understand XCM, parachains, and technical details
- High barrier to entry for mainstream adoption

### The Solution
- **Natural language intents**: Type what you want in plain English
- **Direct execution**: Smart contracts execute intents immediately
- **Cross-chain ready**: Native XCM integration for Polkadot ecosystem

## ✨ Key Features

### 1. Natural Language Processing
```
User types: "send 1 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
Kairos: ✅ Intent created and executed on-chain
```

### 2. Voice Input
- 🎤 Speak your intents instead of typing
- Automatic speech-to-text conversion
- Works in Chrome, Edge, and Safari
- Makes blockchain accessible to everyone

### 3. AI-Powered Suggestions
- Autocomplete appears when typing 2+ characters
- Smart suggestions based on context
- Helps users write correct intents

### 4. Intent Templates Library
- 6 pre-built templates for common operations
- Simple transfers, cross-chain bridges, batch operations
- Filterable by category and difficulty
- One-click template insertion

### 5. XCM Bridge UI
- Visual cross-chain transfer interface
- 5 supported chains: Polkadot Hub, Polkadot Relay, Asset Hub, Astar, Moonbeam
- Chain selection with icons
- Swap chains functionality

### 6. Intent Marketplace
- Browse community-created intent templates
- 6 sample templates with ratings and usage stats
- Filter by category (transfer, cross-chain, staking, DeFi, governance)
- Clone and customize templates

### 7. Direct Smart Contract Execution
- No bots or intermediaries needed
- Intents execute directly on-chain
- Users can execute their own intents instantly
- Optional: Register as a solver to execute others' intents and earn rewards

### 8. Cross-Chain Ready
- Native XCM integration
- Support for multiple parachains
- Real cross-chain transfers
- Polkadot ecosystem native

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────────┐
│   Frontend  │────▶│ Smart Contracts  │
│  (Next.js)  │     │ (Polkadot Hub)   │
└─────────────┘     └──────────────────┘
      │                      │
      └──────────────────────┘
         Direct Execution
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
5. Intent is created and ready to execute!
6. Click "Execute Now" to complete it instantly

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
│   └── backend/           # Optional backend API
├── docs/                  # Documentation
└── README.md             # This file
```

## 🎯 Use Cases

### For Users
- **Simple Transfers**: Send tokens with natural language or voice
- **Cross-Chain Bridges**: Transfer assets across parachains
- **Batch Operations**: Multiple transfers in one intent
- **DeFi Operations**: Swap, stake, provide liquidity
- **Instant Execution**: Execute intents directly without waiting

### For Solvers (Optional)
- **Earn Rewards**: Execute others' intents and earn PAS tokens
- **Build Reputation**: Successful executions increase reputation
- **Decentralized Network**: Anyone can become a solver

### For Developers
- **Intent-Based dApps**: Build on top of Kairos
- **Cross-Chain Integration**: Easy XCM integration
- **Smart Contract Templates**: Reusable intent patterns

## 🏆 Hackathon Submission

**Track**: PVM Smart Contracts
**Network**: Polkadot Hub TestNet
**Status**: ✅ Production Ready

### What Makes This Special

1. **Innovation**: First intent-based execution platform for Polkadot with voice input
2. **User Experience**: Natural language + voice > complex transactions
3. **Production Ready**: Fully deployed and functional
4. **Technical Depth**: Smart contracts + AI + voice recognition + XCM
5. **Real Utility**: Solves actual UX problems in Web3
6. **Polkadot Native**: Built specifically for Polkadot ecosystem
7. **No Intermediaries**: Direct smart contract execution

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
