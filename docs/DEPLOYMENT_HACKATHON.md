# 🚀 Deployment Guide

## Live Demo

**Production URL**: https://kairos-frontend-v969.vercel.app/

## Deploy Your Own

### Option 1: Vercel (Recommended)

1. **Fork the repository** on GitHub

2. **Go to Vercel**: https://vercel.com/new

3. **Import your fork**

4. **Configure settings**:
   - Framework: Next.js
   - Root Directory: `packages/frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Add environment variables**:
```env
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=0x7E7d7D50353213c96aa1b6697c3e6407B4Df38AF
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234
NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
NEXT_PUBLIC_CHAIN_ID=1287
```

6. **Deploy!** ✅

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd packages/frontend
vercel --prod
```

### Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd packages/frontend
netlify deploy --prod
```

## Smart Contracts (Already Deployed)

Contracts are live on Moonbase Alpha:

- **IntentRegistry**: `0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB`
- **IntentRouter**: `0x7E7d7D50353213c96aa1b6697c3e6407B4Df38AF`
- **XCMBridge**: `0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234`

Verify on [Moonscan](https://moonbase.moonscan.io/)

## Redeploy Contracts (Optional)

If you want to deploy your own contracts:

```bash
cd packages/contracts

# Setup environment
cp .env.example .env.moonbase

# Edit .env.moonbase with your private key
# NEVER use mainnet keys!

# Deploy
source .env.moonbase
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

## Run Solver Bot

```bash
cd packages/solver-bot

# Setup
cp .env.example .env
# Edit .env with your private key

# Run
npm run start:simple
```

## Hackathon Submission

### Required Information

**Project Name**: Kairos

**Category**: Track 2 - PVM Smart Contracts

**GitHub**: https://github.com/Venkat5599/kairos

**Live Demo**: https://kairos-frontend-v969.vercel.app/

**Contracts**: Moonbase Alpha
- IntentRegistry: `0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB`
- IntentRouter: `0x7E7d7D50353213c96aa1b6697c3e6407B4Df38AF`
- XCMBridge: `0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234`

**Precompiles Used**:
- Xtokens: `0x0000000000000000000000000000000000000804`
- XCM Transactor: `0x0000000000000000000000000000000000000806`

**Description**:
```
Kairos makes Polkadot's cross-chain capabilities accessible through 
natural language. Users describe what they want ("Send 1 DOT to Polkadot"), 
and solver bots execute it automatically using real Moonbeam XCM precompiles.

Key Features:
- Natural language interface
- Real XCM precompile integration (2 precompiles)
- Remote staking and governance on Polkadot
- 100+ comprehensive tests
- Production-ready code
```

## Troubleshooting

**Build fails on Vercel**
- Check Root Directory is set to `packages/frontend`
- Verify all environment variables are added
- Check build logs for specific errors

**404 error after deployment**
- Ensure Root Directory is `packages/frontend`
- Redeploy from Vercel dashboard

**Contracts not working**
- Verify you're on Moonbase Alpha (Chain ID: 1287)
- Check contract addresses are correct
- Ensure you have DEV tokens for gas

## Support

- GitHub Issues: https://github.com/Venkat5599/kairos/issues
- Vercel Docs: https://vercel.com/docs
- Moonbeam Docs: https://docs.moonbeam.network/
