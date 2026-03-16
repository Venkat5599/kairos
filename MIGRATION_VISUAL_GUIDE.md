# 🎨 Visual Migration Guide - Polkadot Hub TestNet

## 🗺️ Migration Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     MIGRATION OVERVIEW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FROM: Moonbase Alpha          TO: Polkadot Hub TestNet       │
│  ├─ Chain ID: 1287             ├─ Chain ID: 420420417         │
│  ├─ Currency: DEV              ├─ Currency: PAS                │
│  ├─ XCM: Moonbeam precompiles  ├─ XCM: Native Polkadot        │
│  └─ Status: ❌ Wrong network   └─ Status: ✅ Required          │
│                                                                 │
│  Time Required: 30 minutes                                      │
│  Difficulty: Easy (all prep done)                              │
│  Risk: Low                                                      │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Step-by-Step Visual Flow

```
┌──────────────┐
│   STEP 1     │  Get PAS Tokens (5 min)
│   🪙 Faucet  │  https://faucet.polkadot.io/
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   STEP 2     │  Deploy Contracts (5 min)
│   📝 Deploy  │  forge script DeployPolkadotHub
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   STEP 3     │  Update Frontend (2 min)
│   🎨 Config  │  Edit .env.local
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   STEP 4     │  Update Solver Bot (2 min)
│   🤖 Config  │  Edit solver-bot/.env
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   STEP 5     │  Update Vercel (3 min)
│   ☁️  Deploy │  Update env vars + redeploy
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   STEP 6     │  Test Everything (10 min)
│   ✅ Verify  │  Test frontend + solver bot
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   DONE! 🎉   │  Ready for Hackathon
│   🏆 Submit  │  Submit your project
└──────────────┘
```

## 🔄 Configuration Changes

### Frontend Configuration

```diff
# packages/frontend/.env.local

- NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
+ NEXT_PUBLIC_RPC_URL=https://eth-rpc-testnet.polkadot.io/

- NEXT_PUBLIC_CHAIN_ID=1287
+ NEXT_PUBLIC_CHAIN_ID=420420417

- NEXT_PUBLIC_NETWORK_NAME=Moonbase Alpha
+ NEXT_PUBLIC_NETWORK_NAME=Polkadot Hub TestNet

- NEXT_PUBLIC_EXPLORER_URL=https://moonbase.moonscan.io
+ NEXT_PUBLIC_EXPLORER_URL=https://blockscout-testnet.polkadot.io/

# Update contract addresses after deployment
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=<NEW_ADDRESS>
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=<NEW_ADDRESS>
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=<NEW_ADDRESS>
```

### Solver Bot Configuration

```diff
# packages/solver-bot/.env

- RPC_URL=https://rpc.api.moonbase.moonbeam.network
+ RPC_URL=https://eth-rpc-testnet.polkadot.io/

- CHAIN_ID=1287
+ CHAIN_ID=420420417

# Update contract addresses after deployment
INTENT_REGISTRY_ADDRESS=<NEW_ADDRESS>
INTENT_ROUTER_ADDRESS=<NEW_ADDRESS>
XCM_BRIDGE_ADDRESS=<NEW_ADDRESS>
```

## 🎯 Quick Command Reference

### Get Tokens
```bash
# Visit faucet
https://faucet.polkadot.io/

# Check balance
cast balance 0x6cc55F248DB629A8578722A5F1E10871F3Ae165B \
  --rpc-url https://eth-rpc-testnet.polkadot.io/
```

### Deploy Contracts
```bash
cd packages/contracts
cp .env.polkadot-hub .env
forge clean && forge build
forge script script/DeployPolkadotHub.s.sol:DeployPolkadotHub \
  --rpc-url https://eth-rpc-testnet.polkadot.io/ \
  --broadcast --legacy
```

### Test Locally
```bash
# Terminal 1: Frontend
cd packages/frontend && npm run dev

# Terminal 2: Solver Bot
cd packages/solver-bot && npm run start:simple
```

### Deploy to Production
```bash
git add .
git commit -m "Migrate to Polkadot Hub TestNet"
git push origin main
```

## 📋 Verification Checklist

```
┌─────────────────────────────────────────────────────────────┐
│                   VERIFICATION CHECKLIST                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Contracts                                                  │
│  ☐ IntentRegistry deployed                                 │
│  ☐ IntentRouter deployed                                   │
│  ☐ XCMBridge deployed                                      │
│  ☐ Contracts verified on explorer                          │
│                                                             │
│  Frontend                                                   │
│  ☐ Shows Chain ID: 420420417                              │
│  ☐ Shows "Polkadot Hub TestNet"                           │
│  ☐ Wallet connects successfully                            │
│  ☐ Can create intents                                      │
│  ☐ Stats show real data                                    │
│                                                             │
│  Solver Bot                                                 │
│  ☐ Connects to correct network                             │
│  ☐ Registers as solver                                     │
│  ☐ Polls for intents                                       │
│  ☐ Executes intents successfully                           │
│  ☐ Claims rewards                                          │
│                                                             │
│  Deployment                                                 │
│  ☐ Vercel updated with new env vars                        │
│  ☐ Frontend redeployed                                     │
│  ☐ Solver bot deployed (Railway/Render)                    │
│  ☐ All documentation updated                               │
│                                                             │
│  Testing                                                    │
│  ☐ End-to-end test passed                                  │
│  ☐ XCM functionality works                                 │
│  ☐ Transactions visible on explorer                        │
│  ☐ No errors in console                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🌐 Network Comparison Table

```
╔═══════════════════╦═══════════════════════╦═══════════════════════════╗
║    Parameter      ║   Moonbase Alpha      ║   Polkadot Hub TestNet    ║
╠═══════════════════╬═══════════════════════╬═══════════════════════════╣
║ Chain ID          ║ 1287                  ║ 420420417                 ║
║ Currency          ║ DEV                   ║ PAS                       ║
║ RPC URL           ║ rpc.api.moonbase...   ║ eth-rpc-testnet.polka...  ║
║ Explorer          ║ moonbase.moonscan.io  ║ blockscout-testnet.pol... ║
║ Faucet            ║ faucet.moonbeam.net   ║ faucet.polkadot.io        ║
║ XCM Precompile    ║ 0x...0804 (Xtokens)   ║ 0x...0a0000 (Native)      ║
║ Hackathon Status  ║ ❌ Not accepted       ║ ✅ Required               ║
╚═══════════════════╩═══════════════════════╩═══════════════════════════╝
```

## 🔧 XCM Precompile Comparison

### Moonbase Alpha (Old)
```
┌─────────────────────────────────────────┐
│  Moonbeam's Xtokens Precompile         │
├─────────────────────────────────────────┤
│  Address: 0x...0804                     │
│  Interface: IXtokens                    │
│  Type: Moonbeam-specific                │
│                                         │
│  function transfer(                     │
│    address currencyAddress,             │
│    uint256 amount,                      │
│    bytes memory destination,            │
│    uint64 weight                        │
│  ) external;                            │
└─────────────────────────────────────────┘
```

### Polkadot Hub (New)
```
┌─────────────────────────────────────────┐
│  Polkadot's Native XCM Precompile      │
├─────────────────────────────────────────┤
│  Address: 0x...0a0000                   │
│  Interface: IXcm                        │
│  Type: Native Polkadot pallet_xcm       │
│                                         │
│  function execute(                      │
│    bytes calldata message,              │
│    Weight calldata weight               │
│  ) external;                            │
│                                         │
│  function weighMessage(                 │
│    bytes calldata message               │
│  ) external view returns (Weight);      │
└─────────────────────────────────────────┘
```

## 📈 Progress Tracker

```
Migration Progress: ████████████████████░░ 95%

✅ Research completed
✅ Smart contracts updated
✅ Deployment scripts ready
✅ Configuration files prepared
✅ Documentation written
⏳ Deployment pending (you need to do this)
⏳ Testing pending
⏳ Production deployment pending
```

## 🎯 Success Indicators

```
┌─────────────────────────────────────────────────────────┐
│  When you see these, migration is successful:          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✅ Frontend Header                                     │
│     "Polkadot Hub TestNet" | Chain ID: 420420417       │
│                                                         │
│  ✅ Browser Console                                     │
│     Connected to chain 420420417                        │
│                                                         │
│  ✅ Solver Bot Logs                                     │
│     Registered solver on Polkadot Hub TestNet          │
│                                                         │
│  ✅ Block Explorer                                      │
│     Transactions visible on blockscout-testnet...      │
│                                                         │
│  ✅ Intent Creation                                     │
│     Intent created successfully                         │
│                                                         │
│  ✅ Intent Execution                                    │
│     Solver executed intent, reward claimed             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🚨 Common Issues & Solutions

```
┌──────────────────────────────────────────────────────────────┐
│  Issue: "Insufficient PAS balance"                          │
│  Solution: Visit https://faucet.polkadot.io/                │
├──────────────────────────────────────────────────────────────┤
│  Issue: "Wrong network detected"                            │
│  Solution: Check CHAIN_ID=420420417 in .env                 │
├──────────────────────────────────────────────────────────────┤
│  Issue: "Contract deployment failed"                        │
│  Solution: Add --gas-limit 5000000 to forge command         │
├──────────────────────────────────────────────────────────────┤
│  Issue: "Frontend shows old network"                        │
│  Solution: Clear cache, update Vercel env vars, redeploy    │
├──────────────────────────────────────────────────────────────┤
│  Issue: "Solver bot connection error"                       │
│  Solution: Verify RPC URL and contract addresses in .env    │
└──────────────────────────────────────────────────────────────┘
```

## 📚 Documentation Map

```
Root Directory
├── SUMMARY_FOR_USER.md ⭐ START HERE
├── QUICK_MIGRATION_CHECKLIST.md ⭐ QUICK REFERENCE
├── DEPLOY_POLKADOT_HUB.md ⭐ DETAILED GUIDE
├── HACKATHON_READY.md (Submission checklist)
├── MIGRATION_VISUAL_GUIDE.md (This file)
│
docs/
├── MIGRATION_TO_POLKADOT_HUB.md (Technical details)
├── MIGRATION_STATUS.md (Current status)
└── NETWORK_COMPARISON.md (Network comparison)
```

## 🎓 Key Takeaways

```
┌─────────────────────────────────────────────────────────────┐
│  1. Polkadot Hub TestNet is REQUIRED for hackathon         │
│  2. Migration takes only 30 minutes                         │
│  3. All preparation work is DONE                            │
│  4. Just follow QUICK_MIGRATION_CHECKLIST.md                │
│  5. You'll be hackathon-ready in 2 hours                    │
└─────────────────────────────────────────────────────────────┘
```

## 🏁 Ready to Start?

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              👉 NEXT STEP: Get PAS Tokens                  │
│                                                             │
│         Visit: https://faucet.polkadot.io/                 │
│                                                             │
│         Then follow: QUICK_MIGRATION_CHECKLIST.md          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**Good luck! You've got this! 🚀🏆**
