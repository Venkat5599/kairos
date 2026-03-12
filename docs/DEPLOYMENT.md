# Kairos Deployment Guide

## Quick Start - Moonbase Alpha Testnet

The fastest way to get Kairos running is to deploy to Moonbase Alpha testnet.

See [QUICK_START.md](../QUICK_START.md) for a 5-minute deployment guide.

## Prerequisites

- Node.js 20+
- Foundry (for smart contracts)
- Git
- A wallet with testnet tokens

## Moonbase Alpha Deployment

### 1. Get Testnet Tokens

Visit https://faucet.moonbeam.network/ and request DEV tokens.

### 2. Deploy Smart Contracts

```bash
cd packages/contracts

# Check readiness
bash check-devnet-ready.sh

# Configure private key in .env.moonbase
nano .env.moonbase

# Deploy
bash deploy-moonbase.sh
```

### 3. Configure Frontend

Update `packages/frontend/.env.local` with deployed contract addresses:

```env
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
NEXT_PUBLIC_CHAIN_ID=1287
```

### 4. Start Frontend

```bash
cd packages/frontend
npm install
npm run dev
```

Visit http://localhost:3000

## Network Details

### Moonbase Alpha

| Property | Value |
|----------|-------|
| Network Name | Moonbase Alpha |
| RPC URL | https://rpc.api.moonbase.moonbeam.network |
| Chain ID | 1287 |
| Currency | DEV |
| Block Explorer | https://moonbase.moonscan.io |
| Faucet | https://faucet.moonbeam.network/ |

## Backend & Indexer (Optional)

The frontend can work standalone with direct RPC calls. For production, you'll want:

### Backend API

```bash
cd packages/backend

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start backend
npm run start:dev
```

### Solver Bot

```bash
cd packages/solver-bot
npm run start:dev
```

### Indexer

```bash
cd packages/indexer
npm run dev
```

## Production Deployment

### Frontend - Vercel

```bash
cd packages/frontend
vercel --prod
```

Set environment variables in Vercel dashboard.

### Backend - Docker

```bash
docker build -f docker/backend.Dockerfile -t kairos-backend .
docker run -d -p 3001:3001 --env-file .env kairos-backend
```

### Solver Bot - VPS

Deploy to any VPS with Node.js:

```bash
cd packages/solver-bot
npm run build
node dist/index.js
```

## Monitoring

### Contract Verification

Check your contracts on Moonscan:
https://moonbase.moonscan.io/address/YOUR_CONTRACT_ADDRESS

### Health Checks

```bash
# Check contract
cast code $INTENT_REGISTRY_ADDRESS --rpc-url https://rpc.api.moonbase.moonbeam.network

# Check pending intents
cast call $INTENT_REGISTRY_ADDRESS "getPendingIntentsCount()" --rpc-url https://rpc.api.moonbase.moonbeam.network
```

## Troubleshooting

### Contract Deployment Fails

- Check you have enough DEV tokens
- Verify private key is correct
- Try alternative RPC: https://moonbeam-alpha.api.onfinality.io/public

### Frontend Can't Connect

- Verify contract addresses in .env.local
- Check MetaMask is on Moonbase Alpha network
- Clear browser cache and reload

### Transactions Failing

- Check gas settings in MetaMask
- Verify contract addresses are correct
- Check Moonscan for error details

## Security Checklist

- [ ] Private keys stored securely (never in code)
- [ ] .env files added to .gitignore
- [ ] Environment variables configured
- [ ] HTTPS enabled for production
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

## Support

- Documentation: See `/docs` folder
- GitHub Issues: Report bugs and request features

## License

MIT
