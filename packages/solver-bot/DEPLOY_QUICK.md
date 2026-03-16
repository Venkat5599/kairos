# 🚀 Quick Deploy Solver Bot (5 Minutes)

## Option 1: Railway (Easiest - FREE)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Deploy
```bash
cd packages/solver-bot

# Login to Railway
railway login

# Create new project
railway init

# Set environment variables
railway variables set SOLVER_PRIVATE_KEY=your_private_key_here
railway variables set RPC_URL=https://rpc.api.moonbase.moonbeam.network
railway variables set INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
railway variables set XCM_BRIDGE_ADDRESS=0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234
railway variables set CHAIN_ID=1287

# Deploy!
railway up

# Check logs
railway logs
```

**Done! Your bot is live 24/7** 🎉

---

## Option 2: Render (Also FREE)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy solver bot"
git push
```

### Step 2: Deploy on Render
1. Go to https://render.com
2. Click "New +" → "Background Worker"
3. Connect your GitHub repo
4. Select `packages/solver-bot` as root directory
5. Set environment variables:
   ```
   SOLVER_PRIVATE_KEY=your_private_key_here
   RPC_URL=https://rpc.api.moonbase.moonbeam.network
   INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
   XCM_BRIDGE_ADDRESS=0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234
   CHAIN_ID=1287
   ```
6. Build Command: `npm install`
7. Start Command: `npm run start:simple`
8. Click "Create Background Worker"

**Done!** 🎉

---

## Option 3: Local (For Testing)

```bash
cd packages/solver-bot

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your private key
nano .env

# Run bot
npm run start:simple
```

---

## 🔒 Security Notes

1. **Never commit your private key to Git!**
2. Use a separate wallet for the bot (not your main wallet)
3. Fund with only what you need (1-2 DEV is enough)
4. Monitor the bot regularly

---

## 🐛 Troubleshooting

### Bot not starting?
```bash
# Check logs
railway logs  # Railway
# or check Render dashboard
```

### Out of gas?
Get more DEV from: https://faucet.moonbeam.network/

### Bot not detecting intents?
Make sure the contract addresses are correct in your environment variables.

---

## 📊 Monitoring

Check your bot is working:
```bash
# Railway
railway logs --tail

# Or check the blockchain
# Your solver address should show transactions
```

---

## 💰 Earning Rewards

Once deployed, your bot will:
1. Automatically detect new intents
2. Execute them (transfers, cross-chain, etc.)
3. Earn rewards (0.01-0.1 DEV per intent)

**Sit back and earn! 💰**

---

## 📞 Need Help?

- Check full deployment guide: `README_DEPLOYMENT.md`
- GitHub Issues: https://github.com/Venkat5599/kairos/issues
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
