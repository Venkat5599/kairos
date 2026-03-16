# Quick Migration Checklist - Polkadot Hub TestNet

## ✅ Pre-Migration

- [ ] Get PAS tokens from https://faucet.polkadot.io/
- [ ] Verify balance: `cast balance <YOUR_ADDRESS> --rpc-url https://eth-rpc-testnet.polkadot.io/`
- [ ] Backup current contract addresses (Moonbase Alpha)

## ✅ Deploy Contracts

```bash
cd packages/contracts
cp .env.polkadot-hub .env
forge clean
forge build
forge script script/DeployPolkadotHub.s.sol:DeployPolkadotHub \
  --rpc-url https://eth-rpc-testnet.polkadot.io/ \
  --broadcast \
  --legacy
```

**Save these addresses:**
- IntentRegistry: `________________`
- IntentRouter: `________________`
- XCMBridge: `________________`

## ✅ Update Frontend

File: `packages/frontend/.env.local`

```env
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=<NEW_ADDRESS>
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=<NEW_ADDRESS>
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=<NEW_ADDRESS>
NEXT_PUBLIC_RPC_URL=https://eth-rpc-testnet.polkadot.io/
NEXT_PUBLIC_CHAIN_ID=420420417
NEXT_PUBLIC_NETWORK_NAME=Polkadot Hub TestNet
NEXT_PUBLIC_EXPLORER_URL=https://blockscout-testnet.polkadot.io/
```

## ✅ Update Solver Bot

File: `packages/solver-bot/.env`

```env
RPC_URL=https://eth-rpc-testnet.polkadot.io/
CHAIN_ID=420420417
INTENT_REGISTRY_ADDRESS=<NEW_ADDRESS>
INTENT_ROUTER_ADDRESS=<NEW_ADDRESS>
XCM_BRIDGE_ADDRESS=<NEW_ADDRESS>
```

## ✅ Update Vercel

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Update all `NEXT_PUBLIC_*` variables with new values
3. Redeploy

## ✅ Test Everything

- [ ] Frontend connects to Chain ID 420420417
- [ ] Can create intent
- [ ] Solver bot registers
- [ ] Solver bot executes intent
- [ ] Explorer shows transactions: https://blockscout-testnet.polkadot.io/

## ✅ Update Documentation

- [ ] Update README.md with new addresses
- [ ] Update contract addresses in docs
- [ ] Verify all links point to Polkadot Hub TestNet

## Network Quick Reference

| Old (Moonbase) | New (Polkadot Hub) |
|----------------|-------------------|
| Chain ID: 1287 | Chain ID: 420420417 |
| Currency: DEV | Currency: PAS |
| https://rpc.api.moonbase.moonbeam.network | https://eth-rpc-testnet.polkadot.io/ |
| https://moonbase.moonscan.io | https://blockscout-testnet.polkadot.io/ |
| Xtokens: 0x...0804 | XCM: 0x...0a0000 |

## One-Line Commands

```bash
# Check balance
cast balance 0x6cc55F248DB629A8578722A5F1E10871F3Ae165B --rpc-url https://eth-rpc-testnet.polkadot.io/

# Check chain ID
cast chain-id --rpc-url https://eth-rpc-testnet.polkadot.io/

# Check contract
cast code <CONTRACT_ADDRESS> --rpc-url https://eth-rpc-testnet.polkadot.io/

# Test frontend locally
cd packages/frontend && npm run dev

# Test solver bot locally
cd packages/solver-bot && npm run start:simple
```

## Deployment Time Estimate

- Contracts: 5 minutes
- Frontend update: 2 minutes
- Solver bot update: 2 minutes
- Vercel redeploy: 3 minutes
- Testing: 10 minutes

**Total: ~25 minutes**

## Success = All Green ✅

When everything works:
- ✅ Chain ID shows 420420417
- ✅ Network name shows "Polkadot Hub TestNet"
- ✅ Intents can be created
- ✅ Solver bot executes intents
- ✅ Transactions visible on explorer
- ✅ Ready for hackathon submission!
