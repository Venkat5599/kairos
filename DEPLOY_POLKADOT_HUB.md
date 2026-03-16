# Deploy to Polkadot Hub TestNet - Step by Step Guide

This guide walks you through deploying Kairos to Polkadot Hub TestNet, the required network for the Polkadot Solidity Hackathon.

## Prerequisites

- [x] Foundry installed (`forge`, `cast`)
- [x] Node.js and npm installed
- [x] MetaMask or compatible wallet
- [x] Git repository cloned

## Step 1: Get PAS Testnet Tokens

1. Visit the Polkadot Faucet: https://faucet.polkadot.io/
2. Select "Polkadot Hub TestNet" from the network dropdown
3. Paste your wallet address (the one from `DEPLOYER_PRIVATE_KEY`)
4. Click "Get Some PASs" button
5. Wait for tokens to arrive (usually instant)

**Verify you received tokens:**
```bash
cast balance 0x6cc55F248DB629A8578722A5F1E10871F3Ae165B --rpc-url https://eth-rpc-testnet.polkadot.io/
```

## Step 2: Configure Environment

```bash
cd packages/contracts

# Copy Polkadot Hub config
cp .env.polkadot-hub .env

# Verify configuration
cat .env
```

Your `.env` should have:
- `RPC_URL=https://eth-rpc-testnet.polkadot.io/`
- `CHAIN_ID=420420417`
- `DEPLOYER_PRIVATE_KEY=0x...` (your private key)

## Step 3: Compile Contracts

```bash
# Clean previous builds
forge clean

# Compile contracts
forge build

# Verify compilation
forge build --sizes
```

Expected output: All contracts compile successfully, including `XCMBridgePolkadotHub.sol`

## Step 4: Deploy Contracts

```bash
# Deploy to Polkadot Hub TestNet
forge script script/DeployPolkadotHub.s.sol:DeployPolkadotHub \
  --rpc-url https://eth-rpc-testnet.polkadot.io/ \
  --broadcast \
  --legacy

# If you get gas estimation errors, add --gas-limit 5000000
```

**Save the deployed addresses!** You'll see output like:
```
IntentRegistry: 0x...
IntentRouter: 0x...
XCMBridge: 0x...
```

## Step 5: Verify Deployment

```bash
# Check IntentRegistry
cast call <INTENT_REGISTRY_ADDRESS> "owner()(address)" --rpc-url https://eth-rpc-testnet.polkadot.io/

# Check XCM precompile exists
cast code 0x00000000000000000000000000000000000a0000 --rpc-url https://eth-rpc-testnet.polkadot.io/

# Should return non-empty bytecode
```

## Step 6: Update Frontend Configuration

Edit `packages/frontend/.env.local`:

```env
# Polkadot Hub TestNet Configuration
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=<YOUR_INTENT_REGISTRY_ADDRESS>
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=<YOUR_INTENT_ROUTER_ADDRESS>
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=<YOUR_XCM_BRIDGE_ADDRESS>

NEXT_PUBLIC_RPC_URL=https://eth-rpc-testnet.polkadot.io/
NEXT_PUBLIC_CHAIN_ID=420420417
NEXT_PUBLIC_NETWORK_NAME=Polkadot Hub TestNet

NEXT_PUBLIC_EXPLORER_URL=https://blockscout-testnet.polkadot.io/
NEXT_PUBLIC_SOLVER_ADDRESS=0x6cc55F248DB629A8578722A5F1E10871F3Ae165B
```

## Step 7: Update Solver Bot Configuration

Edit `packages/solver-bot/.env`:

```env
# Network
RPC_URL=https://eth-rpc-testnet.polkadot.io/
CHAIN_ID=420420417

# Solver Wallet
SOLVER_PRIVATE_KEY=0x2e8ca714b56638e54705e0c39194e35bd98e82c8bccf8b61d1acbe02aba85a1d

# Deployed Contracts
INTENT_REGISTRY_ADDRESS=<YOUR_INTENT_REGISTRY_ADDRESS>
INTENT_ROUTER_ADDRESS=<YOUR_INTENT_ROUTER_ADDRESS>
XCM_BRIDGE_ADDRESS=<YOUR_XCM_BRIDGE_ADDRESS>

# Solver Settings
SOLVER_MIN_REWARD=0.001
SOLVER_POLL_INTERVAL=10000
SOLVER_STAKE_AMOUNT=1.0
```

## Step 8: Test Locally

```bash
# Test frontend
cd packages/frontend
npm run dev

# In another terminal, test solver bot
cd packages/solver-bot
npm run start:simple
```

**Test checklist:**
- [ ] Frontend connects to Polkadot Hub TestNet (Chain ID: 420420417)
- [ ] Can see network name "Polkadot Hub TestNet" in UI
- [ ] Solver bot registers successfully
- [ ] Can create test intent
- [ ] Solver bot picks up and executes intent

## Step 9: Deploy Frontend to Vercel

```bash
# Push changes to GitHub
git add .
git commit -m "Migrate to Polkadot Hub TestNet"
git push origin main
```

**Update Vercel Environment Variables:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update these variables:

```
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=<YOUR_ADDRESS>
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=<YOUR_ADDRESS>
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=<YOUR_ADDRESS>
NEXT_PUBLIC_RPC_URL=https://eth-rpc-testnet.polkadot.io/
NEXT_PUBLIC_CHAIN_ID=420420417
NEXT_PUBLIC_NETWORK_NAME=Polkadot Hub TestNet
NEXT_PUBLIC_EXPLORER_URL=https://blockscout-testnet.polkadot.io/
```

3. Redeploy: Deployments → Click "..." → Redeploy

## Step 10: Deploy Solver Bot

Choose one of these options:

### Option A: Railway (Recommended)

1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory: `packages/solver-bot`
5. Add environment variables from Step 7
6. Deploy!

### Option B: Render

1. Go to https://render.com/
2. New → Web Service
3. Connect your GitHub repo
4. Root directory: `packages/solver-bot`
5. Build command: `npm install && npm run build`
6. Start command: `npm run start:simple`
7. Add environment variables
8. Create Web Service

## Step 11: Verify Everything Works

### Check Contracts on Explorer

Visit: https://blockscout-testnet.polkadot.io/

Search for your contract addresses and verify:
- [ ] Contracts exist
- [ ] Transactions are visible
- [ ] Contract code is readable

### Check Frontend

Visit your Vercel URL:
- [ ] Shows "Polkadot Hub TestNet" in header
- [ ] Chain ID is 420420417
- [ ] Can connect wallet
- [ ] Can create intents
- [ ] Stats show real data

### Check Solver Bot

Check your deployment logs (Railway/Render):
- [ ] Bot starts without errors
- [ ] Registers as solver
- [ ] Polls for intents
- [ ] Executes intents successfully

## Step 12: Update Documentation

Update `README.md` with new network information:

```markdown
## Deployed on Polkadot Hub TestNet

- **Network**: Polkadot Hub TestNet
- **Chain ID**: 420420417
- **RPC**: https://eth-rpc-testnet.polkadot.io/
- **Explorer**: https://blockscout-testnet.polkadot.io/

### Contract Addresses

- IntentRegistry: `0x...`
- IntentRouter: `0x...`
- XCMBridge: `0x...`

### Live Demo

- Frontend: https://kairos-frontend-v969.vercel.app/
- Solver Bot: Running on Railway
```

## Troubleshooting

### "Insufficient PAS balance"
- Get more tokens from https://faucet.polkadot.io/
- Wait a few seconds and try again

### "Wrong network"
- Check `CHAIN_ID=420420417` in `.env`
- Verify RPC URL is correct

### "Contract deployment failed"
- Check gas limit: add `--gas-limit 5000000`
- Try `--legacy` flag for legacy transactions
- Check deployer has enough PAS

### "Frontend shows wrong network"
- Clear browser cache
- Check Vercel env vars are updated
- Redeploy Vercel

### "Solver bot can't connect"
- Verify RPC URL in solver bot `.env`
- Check contract addresses are correct
- Ensure solver wallet has PAS tokens

## Network Information

| Parameter | Value |
|-----------|-------|
| Network Name | Polkadot Hub TestNet |
| Chain ID | 420420417 |
| Currency | PAS (Paseo) |
| RPC URL | https://eth-rpc-testnet.polkadot.io/ |
| Alternative RPC | https://services.polkadothub-rpc.com/testnet/ |
| Explorer | https://blockscout-testnet.polkadot.io/ |
| Alternative Explorer | https://polkadot.testnet.routescan.io/ |
| Faucet | https://faucet.polkadot.io/ |
| XCM Precompile | 0x00000000000000000000000000000000000a0000 |

## Success Criteria

You've successfully migrated when:

- [x] All contracts deployed to Polkadot Hub TestNet
- [x] Frontend shows Chain ID 420420417
- [x] Can create and execute intents
- [x] Solver bot runs without errors
- [x] XCM functionality works (if tested)
- [x] All documentation updated
- [x] Ready for hackathon submission!

## Resources

- [Polkadot Hub Docs](https://docs.polkadot.com/reference/polkadot-hub/)
- [XCM Precompile Guide](https://docs.polkadot.com/smart-contracts/precompiles/xcm/)
- [Network Details](https://docs.polkadot.com/smart-contracts/connect/)
- [Hackathon Info](https://openguild.wtf/hackathon)

## Need Help?

- Polkadot Developer Support: https://t.me/substratedevs
- OpenGuild Discord: https://discord.com/invite/WWgzkDfPQF
- Hackathon Contact: zoey@openguild.wtf
