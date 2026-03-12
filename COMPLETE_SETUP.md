# Kairos - Complete Production Setup

## 🎯 What You Have

A fully functional intent-based execution system:
- ✅ Smart contracts deployed on Moonbase Alpha
- ✅ Frontend with real blockchain data
- ✅ Working solver bot that executes intents automatically
- ✅ End-to-end workflow tested and verified

## 🚀 Quick Start (5 Minutes)

### 1. Start Frontend

```bash
cd packages/frontend
npm install
npm run dev
```

Visit: http://localhost:3000

### 2. Start Solver Bot

```bash
cd packages/solver-bot
npm install

# Edit .env and add your solver private key
nano .env

# Start the bot
npm run start:simple
```

### 3. Create an Intent

1. Open http://localhost:3000
2. Connect wallet (MetaMask on Moonbase Alpha)
3. Type: `Send 0.05 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
4. Set reward: `0.01 DEV`
5. Click EXECUTE

### 4. Watch It Work!

The solver bot will:
- Detect the new intent
- Parse the description
- Execute the transfer
- Claim the reward

All automatically! ✨

## 📋 Detailed Setup

### Prerequisites

- Node.js 18+
- MetaMask with Moonbase Alpha network
- At least 2 DEV tokens (get from https://faucet.moonbeam.network/)

### Wallet Setup

You need TWO wallets:

1. **User Wallet** - Creates intents, pays rewards
   - Your main MetaMask wallet
   - Needs ~1 DEV for testing

2. **Solver Wallet** - Executes intents, earns rewards
   - Separate wallet (create new or use different account)
   - Needs ~2 DEV (1 for stake, 1 for gas/execution)

### Environment Configuration

#### Frontend (.env.local)

Already configured with deployed contracts:

```env
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=0x607C43fa56df6fC436ed70e8e8860AeE07B74D25
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=0xedDC0735AC932459Bc7FeAD80d24e985c85e2425
NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
NEXT_PUBLIC_CHAIN_ID=1287
```

#### Solver Bot (.env)

Update with your solver private key:

```env
SOLVER_PRIVATE_KEY=0xyour_solver_private_key_here
INTENT_REGISTRY_ADDRESS=0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777
RPC_URL=https://rpc.api.moonbase.moonbeam.network
SOLVER_MIN_REWARD=0.001
```

## 🎬 Complete Workflow

### Step 1: User Creates Intent

**Frontend UI:**
```
Input: "Send 0.1 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
Reward: 0.01 DEV
Click: EXECUTE
```

**What Happens:**
- Transaction sent to IntentRegistry contract
- Intent stored on-chain with status "Pending"
- Event emitted: `IntentCreated`
- User pays: 0.1 DEV (transfer) + 0.01 DEV (reward) + gas

### Step 2: Solver Bot Detects Intent

**Bot Console:**
```
🔔 New Intent Detected!
   ID: 0x...
   Description: Send 0.1 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   Reward: 0.01 DEV
```

**What Happens:**
- Bot listens for `IntentCreated` events
- Receives intent details from blockchain
- Checks if reward is sufficient

### Step 3: Bot Parses Intent

**Bot Console:**
```
🎯 Processing Intent:
   Type: TRANSFER
   To: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   Amount: 0.1 DEV
```

**What Happens:**
- Regex parsing of description
- Extracts recipient address and amount
- Validates format

### Step 4: Bot Claims Intent

**Bot Console:**
```
📝 Step 1: Claiming intent...
✅ Intent claimed!
```

**What Happens:**
- Bot calls `executeIntent(intentId)`
- Intent status changes to "Executing"
- Bot is now assigned as the solver

### Step 5: Bot Executes Transfer

**Bot Console:**
```
💸 Step 2: Executing transfer...
✅ Transfer completed! Hash: 0x...
```

**What Happens:**
- Bot sends 0.1 DEV to recipient
- Real blockchain transaction
- Visible on Moonscan

### Step 6: Bot Completes Intent

**Bot Console:**
```
✅ Step 3: Marking as completed...
✅ Intent completed! Reward claimed: 0.01 DEV

🎉 SUCCESS! Intent fully executed.
```

**What Happens:**
- Bot calls `completeIntent(intentId, txHash)`
- Intent status changes to "Completed"
- Bot receives 0.01 DEV reward
- Bot reputation increases

### Step 7: UI Updates

**Frontend:**
- Stats update (Total +1, Completed +1)
- Intent appears in list with "Completed" status
- Progress bar shows 100%
- Success rate recalculated

## 📊 Monitoring

### Frontend Dashboard

Visit http://localhost:3000 to see:
- Total intents created
- Completed intents
- Success rate
- Active intents list
- Real-time updates every 10 seconds

### Solver Bot Logs

Watch the terminal where bot is running:
- New intent notifications
- Execution progress
- Success/failure messages
- Earned rewards

### Moonscan

View all transactions:
- **Contracts**: https://moonbase.moonscan.io/address/0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777
- **Your Wallet**: https://moonbase.moonscan.io/address/YOUR_ADDRESS
- **Solver Wallet**: https://moonbase.moonscan.io/address/SOLVER_ADDRESS

## 🧪 Testing Scenarios

### Test 1: Simple Transfer

```
Intent: "Send 0.05 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
Reward: 0.01 DEV
Expected: Bot executes automatically
```

### Test 2: Multiple Intents

```
Create 3 intents with different amounts
Expected: Bot processes them one by one
```

### Test 3: Low Reward

```
Intent: "Send 0.1 DEV to 0x..."
Reward: 0.0001 DEV (below minimum)
Expected: Bot skips it
```

### Test 4: Invalid Format

```
Intent: "Please send money to Alice"
Expected: Bot skips (can't parse)
```

## 🔧 Troubleshooting

### Frontend Issues

**Problem**: Stats showing 0
- **Check**: Is MetaMask connected?
- **Check**: Are you on Moonbase Alpha network?
- **Check**: Is RPC URL correct in .env.local?

**Problem**: Can't create intent
- **Check**: Do you have DEV tokens?
- **Check**: Is wallet connected?
- **Check**: Is transaction approved in MetaMask?

### Solver Bot Issues

**Problem**: Bot won't start
- **Check**: Is SOLVER_PRIVATE_KEY set in .env?
- **Check**: Does solver wallet have DEV tokens?
- **Check**: Run `npm install` first

**Problem**: Bot not executing intents
- **Check**: Is bot running? (should see "👂 Listening...")
- **Check**: Is reward above minimum (0.001 DEV)?
- **Check**: Is intent format correct?
- **Check**: Does solver have enough balance?

**Problem**: "Insufficient funds" error
- **Solution**: Add more DEV to solver wallet

**Problem**: "Nonce too high" error
- **Solution**: Wait a few minutes or reset MetaMask

## 📈 Production Deployment

### Frontend (Vercel)

```bash
cd packages/frontend
vercel --prod
```

Set environment variables in Vercel dashboard.

### Solver Bot (VPS)

```bash
# Using PM2
npm install -g pm2
pm2 start npm --name "kairos-solver" -- run start:simple
pm2 save
pm2 startup
```

### Monitoring (Optional)

Set up monitoring with:
- PM2 monitoring
- Sentry for error tracking
- Custom alerts for bot failures

## 🎯 Next Features

### Phase 1: Enhanced Parsing
- Support more intent formats
- Token swaps
- Multi-step operations

### Phase 2: Cross-Chain
- XCM integration
- Multi-chain routing
- Bridge support

### Phase 3: Advanced Features
- Intent batching
- Gas optimization
- MEV protection

## 📚 Documentation

- **Architecture**: `docs/ARCHITECTURE.md`
- **Contracts**: `docs/CONTRACTS.md`
- **API**: `docs/API.md`
- **Solver Bot**: `SOLVER_BOT_GUIDE.md`
- **Production**: `PRODUCTION_READY.md`

## 🔗 Links

- **Frontend**: http://localhost:3000
- **Contracts**: https://moonbase.moonscan.io/address/0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777
- **Faucet**: https://faucet.moonbeam.network/
- **GitHub**: https://github.com/Venkat5599/kairos

## ✅ Checklist

- [ ] Frontend running on localhost:3000
- [ ] Solver bot running and listening
- [ ] User wallet has DEV tokens
- [ ] Solver wallet has DEV tokens (2+)
- [ ] Solver registered in contract
- [ ] Created test intent
- [ ] Intent executed automatically
- [ ] Stats updated in UI
- [ ] Verified on Moonscan

## 🎉 Success Criteria

Your system is working when:
1. You create an intent in the UI
2. Solver bot detects it immediately
3. Bot executes the transfer automatically
4. Intent status changes to "Completed"
5. Stats update in real-time
6. Everything visible on Moonscan

---

**Congratulations! You have a fully functional intent-based execution system! 🚀**

Everything is real, everything works, nothing is simulated.
