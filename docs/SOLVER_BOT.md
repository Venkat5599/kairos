# Kairos Solver Bot - Complete Guide

## What It Does

The solver bot automatically:
1. **Listens** for new intents on the blockchain
2. **Parses** the intent description (e.g., "Send 0.1 DEV to 0x...")
3. **Executes** the actual transaction
4. **Completes** the intent and claims the reward

## Setup

### Step 1: Get a Solver Wallet

You need a separate wallet for the solver (different from the one creating intents):

```bash
# Create a new wallet
cast wallet new

# Or use an existing one
# Export private key from MetaMask
```

### Step 2: Fund the Solver Wallet

The solver needs DEV tokens for:
- Registration stake (1 DEV)
- Gas fees for transactions
- Executing intent transfers

**Minimum recommended**: 2 DEV

Get testnet tokens:
- Visit: https://faucet.moonbeam.network/
- Enter your solver wallet address
- Request DEV tokens

### Step 3: Configure Environment

```bash
cd packages/solver-bot

# Edit .env file
nano .env
```

Replace `SOLVER_PRIVATE_KEY` with your solver's private key:

```env
SOLVER_PRIVATE_KEY=0xyour_solver_private_key_here
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Start the Bot

```bash
npm run start:simple
```

You should see:

```
🤖 Initializing Kairos Solver Bot...
✅ Solver Address: 0x...
✅ Network: https://rpc.api.moonbase.moonbeam.network
✅ Contract: 0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777
💰 Balance: 2.5 DEV
📝 Registering as solver...
✅ Successfully registered as solver!
👂 Listening for new intents...
```

## How to Test End-to-End

### Terminal 1: Start Solver Bot

```bash
cd packages/solver-bot
npm run start:simple
```

Leave this running!

### Terminal 2: Start Frontend

```bash
cd packages/frontend
npm run dev
```

### Terminal 3: Create an Intent

1. Open http://localhost:3000
2. Connect your wallet (the user wallet, not solver)
3. Type: `Send 0.05 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
4. Set reward: `0.01 DEV`
5. Click "EXECUTE"
6. Approve in MetaMask

### Watch the Magic! ✨

In the solver bot terminal, you'll see:

```
🔔 New Intent Detected!
   ID: 0x...
   Description: Send 0.05 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   Reward: 0.01 DEV

🎯 Processing Intent:
   Type: TRANSFER
   To: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   Amount: 0.05 DEV

📝 Step 1: Claiming intent...
✅ Intent claimed!

💸 Step 2: Executing transfer...
✅ Transfer completed! Hash: 0x...

✅ Step 3: Marking as completed...
✅ Intent completed! Reward claimed: 0.01 DEV

🎉 SUCCESS! Intent fully executed.
```

In the frontend, you'll see:
- Stats update (Completed +1)
- Intent status changes to "Completed"
- Progress bar fills to 100%

## Supported Intent Formats

The bot currently supports:

```
✅ "Send 0.1 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
✅ "Transfer 0.5 DEV to 0x9700e80cffFE423ACFE4D8206B3f88306D5410EF"
✅ "send 1 dev to 0x1234567890123456789012345678901234567890"
```

Format requirements:
- Must include amount (number with optional decimal)
- Must include "DEV" token
- Must include valid Ethereum address (0x... 40 characters)
- Case insensitive

## Troubleshooting

### Bot won't start

**Error**: "Insufficient balance"
- **Solution**: Fund solver wallet with at least 2 DEV

**Error**: "Registration failed"
- **Solution**: Check you have at least 1 DEV for stake

### Intent not executing

**Check 1**: Is the bot running?
```bash
# Should see "👂 Listening for new intents..."
```

**Check 2**: Is the reward high enough?
```bash
# Minimum reward is 0.001 DEV (configurable in .env)
```

**Check 3**: Is the intent format correct?
```bash
# Must match: "Send X DEV to 0x..."
```

**Check 4**: Does solver have enough balance?
```bash
# Solver needs balance to execute transfers
```

### Bot crashes

**Error**: "Nonce too high"
- **Solution**: Reset MetaMask account or wait a few minutes

**Error**: "Insufficient funds"
- **Solution**: Solver wallet needs more DEV

## Configuration Options

Edit `.env` to customize:

```env
# Minimum reward to accept (in DEV)
SOLVER_MIN_REWARD=0.001

# How often to check for new intents (milliseconds)
SOLVER_POLL_INTERVAL=10000

# Stake amount for registration (in DEV)
SOLVER_STAKE_AMOUNT=1.0
```

## Running in Production

### Option 1: PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start npm --name "kairos-solver" -- run start:simple

# View logs
pm2 logs kairos-solver

# Stop bot
pm2 stop kairos-solver

# Restart bot
pm2 restart kairos-solver
```

### Option 2: Docker

```bash
# Build image
docker build -t kairos-solver -f docker/solver.Dockerfile .

# Run container
docker run -d \
  --name kairos-solver \
  --env-file packages/solver-bot/.env \
  kairos-solver

# View logs
docker logs -f kairos-solver
```

### Option 3: Systemd Service

```bash
# Create service file
sudo nano /etc/systemd/system/kairos-solver.service
```

```ini
[Unit]
Description=Kairos Solver Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/kairos/packages/solver-bot
ExecStart=/usr/bin/npm run start:simple
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable kairos-solver
sudo systemctl start kairos-solver

# Check status
sudo systemctl status kairos-solver

# View logs
sudo journalctl -u kairos-solver -f
```

## Monitoring

### Check Solver Stats

```bash
cast call 0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777 \
  "getSolverInfo(address)" \
  YOUR_SOLVER_ADDRESS \
  --rpc-url https://rpc.api.moonbase.moonbeam.network
```

### Check Balance

```bash
cast balance YOUR_SOLVER_ADDRESS \
  --rpc-url https://rpc.api.moonbase.moonbeam.network
```

### View on Moonscan

Visit: https://moonbase.moonscan.io/address/YOUR_SOLVER_ADDRESS

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` file with real private keys
- Use separate wallet for solver (not your main wallet)
- This is testnet - don't use mainnet keys
- Monitor solver balance regularly
- Set reasonable `SOLVER_MIN_REWARD` to avoid unprofitable intents

## Next Steps

Once the bot is running:
1. Create intents through the UI
2. Watch them execute automatically
3. Monitor solver earnings
4. Adjust configuration as needed

---

**Your Kairos system is now fully operational! 🚀**
