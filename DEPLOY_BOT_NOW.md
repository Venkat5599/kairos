# 🚀 Deploy Your Solver Bot in 5 Minutes

## Option 1: Automated Script (Easiest)

### Windows (PowerShell):
```powershell
cd packages/solver-bot
.\deploy-railway.ps1
```

### Linux/Mac:
```bash
cd packages/solver-bot
chmod +x deploy-railway.sh
./deploy-railway.sh
```

The script will:
1. Install Railway CLI (if needed)
2. Login to Railway
3. Create a new project
4. Set all environment variables
5. Deploy your bot
6. Show you the dashboard link

---

## Option 2: Manual Railway Deployment (5 minutes)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login
```bash
railway login
```

### Step 3: Go to solver bot directory
```bash
cd packages/solver-bot
```

### Step 4: Initialize Railway project
```bash
railway init
```

### Step 5: Set environment variables

**IMPORTANT**: Replace `YOUR_PRIVATE_KEY_HERE` with your actual private key!

```bash
railway variables set SOLVER_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
railway variables set RPC_URL=https://eth-rpc-testnet.polkadot.io
railway variables set INTENT_REGISTRY_ADDRESS=0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
railway variables set XCM_BRIDGE_ADDRESS=0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88
railway variables set SOLVER_MIN_REWARD=0.001
railway variables set SOLVER_POLL_INTERVAL=10000
```

### Step 6: Deploy
```bash
railway up
```

### Step 7: View logs
```bash
railway logs
```

**Done!** Your bot is now running 24/7! 🎉

---

## Option 3: Railway Dashboard (No CLI)

### Step 1: Go to Railway
Visit: https://railway.app

### Step 2: Sign up / Login
Use GitHub to sign in

### Step 3: Create New Project
Click "New Project" → "Deploy from GitHub repo"

### Step 4: Connect Repository
Select your `kairos` repository

### Step 5: Configure
- Root Directory: `packages/solver-bot`
- Build Command: `npm install`
- Start Command: `npm run start:simple`

### Step 6: Add Environment Variables
In the Railway dashboard, add:

```
SOLVER_PRIVATE_KEY=your_private_key_here
RPC_URL=https://eth-rpc-testnet.polkadot.io
INTENT_REGISTRY_ADDRESS=0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
XCM_BRIDGE_ADDRESS=0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88
SOLVER_MIN_REWARD=0.001
SOLVER_POLL_INTERVAL=10000
```

### Step 7: Deploy
Click "Deploy"

**Done!** Your bot is live! 🎉

---

## ✅ Verify Deployment

### Check if bot is running:

```bash
railway logs --tail 50
```

### Look for these messages:
```
✅ Solver Address: 0x...
✅ Network: https://eth-rpc-testnet.polkadot.io/
✅ Contract: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
💰 Balance: X.XX DEV
✅ Already registered as solver
👂 Polling for new intents...
```

### If you see these, your bot is working! ✅

---

## 🎬 For Your Hackathon Demo

### Show judges your deployed bot:

1. **Open Railway Dashboard**
   - Go to https://railway.app/dashboard
   - Show your project is running

2. **Show Live Logs**
   ```bash
   railway logs
   ```
   - Show bot is actively monitoring
   - Show "Polling for new intents..." messages

3. **Create an Intent**
   - Go to your frontend
   - Create a new intent
   - Show bot picks it up in logs
   - Show bot executes it

4. **Show Uptime**
   - Railway dashboard shows how long bot has been running
   - Proves it's production-ready, not just local

---

## 💰 Cost

**Railway Pricing:**
- Free $5 credit (no credit card required)
- After credit: ~$2-3/month
- Includes: 512MB RAM, 1GB storage, unlimited bandwidth

**Perfect for hackathon demos!**

---

## 🐛 Troubleshooting

### Bot not starting?

**Check logs:**
```bash
railway logs
```

**Common issues:**
1. Missing `SOLVER_PRIVATE_KEY` - Add it in Railway dashboard
2. Invalid private key - Check format (should start with 0x)
3. Insufficient balance - Add PAS tokens to solver wallet

### Bot crashes?

**Restart:**
```bash
railway restart
```

### Need to update code?

**Redeploy:**
```bash
git push origin main
railway up
```

---

## 🎯 Quick Checklist

- [ ] Install Railway CLI
- [ ] Login to Railway
- [ ] Set environment variables (especially SOLVER_PRIVATE_KEY)
- [ ] Deploy bot
- [ ] Check logs (should see "Polling for new intents...")
- [ ] Test with a real intent
- [ ] Add Railway dashboard link to hackathon submission

---

## 🚀 Ready to Deploy?

**Choose your method:**

1. **Automated Script** (Easiest)
   ```bash
   cd packages/solver-bot
   ./deploy-railway.ps1  # Windows
   ./deploy-railway.sh   # Linux/Mac
   ```

2. **Manual CLI** (5 minutes)
   ```bash
   npm install -g @railway/cli
   railway login
   cd packages/solver-bot
   railway init
   railway variables set SOLVER_PRIVATE_KEY=YOUR_KEY
   railway up
   ```

3. **Dashboard** (No CLI needed)
   - Go to https://railway.app
   - Deploy from GitHub
   - Add environment variables
   - Click Deploy

---

**That's it!** Your solver bot is now running 24/7 in the cloud! 🎉

**Dashboard**: https://railway.app/dashboard
**Logs**: `railway logs`
**Restart**: `railway restart`

---

## 📝 Add to Hackathon Submission

**Deployed Solver Bot**: ✅ Running on Railway
**Dashboard**: [Your Railway project URL]
**Uptime**: [Show screenshot of Railway dashboard]
**Logs**: [Show screenshot of bot executing intents]

This proves your project is production-ready! 🏆
