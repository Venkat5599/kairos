# 🚀 Quick Start Guide

Get Kairos running in 5 minutes!

## Prerequisites

- Node.js 18+
- MetaMask wallet
- Moonbase Alpha DEV tokens ([Get from faucet](https://faucet.moonbeam.network/))

## Option 1: Use Live Demo (Fastest)

1. Visit: https://kairos-frontend-v969.vercel.app/
2. Connect your MetaMask wallet
3. Switch to Moonbase Alpha network
4. Create an intent: "Send 0.01 DEV to 0x742d35Cc6634C053292a3b844Bc9e7595f0bEb"
5. Done! ✅

## Option 2: Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/Venkat5599/kairos.git
cd kairos
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cd packages/frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=0x7E7d7D50353213c96aa1b6697c3e6407B4Df38AF
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234
NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
NEXT_PUBLIC_CHAIN_ID=1287
```

### 4. Start Frontend

```bash
npm run dev
```

Open http://localhost:3000

### 5. (Optional) Run Solver Bot

```bash
cd packages/solver-bot
cp .env.example .env
```

Edit `.env` with your private key (testnet only!):
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.api.moonbase.moonbeam.network
INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
```

Start the bot:
```bash
npm run start:simple
```

## Usage Examples

### Simple Transfer
```
Send 0.01 DEV to 0x742d35Cc6634C053292a3b844Bc9e7595f0bEb
```

### Cross-Chain Transfer
```
Bridge 0.1 DEV to Polkadot 0x1234...
```

### Remote Staking
```
Stake 1 DOT on Polkadot
```

## Troubleshooting

**"Insufficient funds"**
- Get DEV tokens from https://faucet.moonbeam.network/

**"Wrong network"**
- Switch MetaMask to Moonbase Alpha (Chain ID: 1287)

**"Transaction failed"**
- Check you have enough DEV for gas fees
- Ensure reward amount is included in transaction

## Next Steps

- Read [Architecture](ARCHITECTURE.md) to understand how it works
- Check [Deployment Guide](DEPLOYMENT_HACKATHON.md) to deploy your own
- View contracts on [Moonscan](https://moonbase.moonscan.io/)

## Support

- GitHub: https://github.com/Venkat5599/kairos
- Issues: https://github.com/Venkat5599/kairos/issues
