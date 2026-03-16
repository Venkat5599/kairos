# 🤖 Solver Bot Deployment Guide

## 🎯 Deployment Options

You have 4 main options for deploying your solver bot:

1. **Railway** (Recommended - Easiest)
2. **Render** (Free tier available)
3. **Fly.io** (Good for 24/7 uptime)
4. **VPS** (DigitalOcean, AWS, etc.)

---

## 🚀 Option 1: Railway (RECOMMENDED)

**Why Railway?**
- ✅ Easiest setup (5 minutes)
- ✅ Free $5 credit (enough for testing)
- ✅ Automatic deployments from GitHub
- ✅ Built-in logging and monitoring
- ✅ No credit card required for trial

### Step 1: Install Railway CLI

```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Or use npm
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This will open your browser to authenticate.

### Step 3: Initialize Project

```bash
cd packages/solver-bot
railway init
```

Select "Create new project" and give it a name like "kairos-solver-bot"

### Step 4: Set Environment Variables

```bash
railway variables set SOLVER_PRIVATE_KEY=your_private_key_here
railway variables set RPC_URL=https://eth-rpc-testnet.polkadot.io
railway variables set INTENT_REGISTRY_ADDRESS=0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
railway variables set XCM_BRIDGE_ADDRESS=0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88
railway variables set SOLVER_MIN_REWARD=0.001
railway variables set SOLVER_POLL_INTERVAL=10000
```

### Step 5: Deploy

```bash
railway up
```

### Step 6: View Logs

```bash
railway logs
```

### Step 7: Keep it Running

Railway will automatically keep your bot running 24/7!

**Cost**: ~$2-3/month after free credit

---

## 🚀 Option 2: Render

**Why Render?**
- ✅ Free tier available
- ✅ Easy setup
- ✅ Good for demos

### Step 1: Create render.yaml

Already created at `packages/solver-bot/render.yaml`:

```yaml
services:
  - type: worker
    name: kairos-solver-bot
    env: node
    buildCommand: npm install
    startCommand: npm run start:simple
    envVars:
      - key: SOLVER_PRIVATE_KEY
        sync: false
      - key: RPC_URL
        value: https://eth-rpc-testnet.polkadot.io
      - key: INTENT_REGISTRY_ADDRESS
        value: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
      - key: XCM_BRIDGE_ADDRESS
        value: 0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88
```

### Step 2: Deploy to Render

1. Go to https://render.com
2. Sign up / Login
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Select `packages/solver-bot/render.yaml`
6. Add your `SOLVER_PRIVATE_KEY` in the dashboard
7. Click "Apply"

**Cost**: Free tier available (with limitations)

---

## 🚀 Option 3: Fly.io

**Why Fly.io?**
- ✅ Good free tier
- ✅ Fast deployment
- ✅ Global edge network

### Step 1: Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### Step 2: Login

```bash
fly auth login
```

### Step 3: Create fly.toml

```bash
cd packages/solver-bot
fly launch --no-deploy
```

### Step 4: Configure fly.toml

Edit the generated `fly.toml`:

```toml
app = "kairos-solver-bot"

[build]
  builder = "heroku/buildpacks:20"

[env]
  RPC_URL = "https://eth-rpc-testnet.polkadot.io"
  INTENT_REGISTRY_ADDRESS = "0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2"
  XCM_BRIDGE_ADDRESS = "0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88"

[[services]]
  internal_port = 8080
  protocol = "tcp"
```

### Step 5: Set Secrets

```bash
fly secrets set SOLVER_PRIVATE_KEY=your_private_key_here
```

### Step 6: Deploy

```bash
fly deploy
```

### Step 7: View Logs

```bash
fly logs
```

**Cost**: Free tier available

---

## 🚀 Option 4: VPS (DigitalOcean, AWS, etc.)

**Why VPS?**
- ✅ Full control
- ✅ Can run multiple bots
- ✅ Good for production

### Step 1: Create VPS

Create a Ubuntu 22.04 droplet on DigitalOcean ($6/month)

### Step 2: SSH into Server

```bash
ssh root@your_server_ip
```

### Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 4: Clone Repository

```bash
git clone https://github.com/Venkat5599/kairos.git
cd kairos/packages/solver-bot
npm install
```

### Step 5: Create .env File

```bash
nano .env
```

Add:
```env
SOLVER_PRIVATE_KEY=your_private_key_here
RPC_URL=https://eth-rpc-testnet.polkadot.io
INTENT_REGISTRY_ADDRESS=0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
XCM_BRIDGE_ADDRESS=0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88
SOLVER_MIN_REWARD=0.001
SOLVER_POLL_INTERVAL=10000
```

### Step 6: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### Step 7: Start Bot with PM2

```bash
pm2 start npm --name "kairos-solver" -- run start:simple
pm2 save
pm2 startup
```

### Step 8: View Logs

```bash
pm2 logs kairos-solver
```

### Step 9: Monitor

```bash
pm2 monit
```

**Cost**: $6-12/month

---

## 📊 Comparison Table

| Platform | Cost | Setup Time | Difficulty | Best For |
|----------|------|------------|------------|----------|
| Railway | $2-3/mo | 5 min | ⭐ Easy | Hackathon demos |
| Render | Free tier | 10 min | ⭐⭐ Medium | Testing |
| Fly.io | Free tier | 15 min | ⭐⭐ Medium | Production |
| VPS | $6+/mo | 30 min | ⭐⭐⭐ Hard | Full control |

---

## 🎯 Recommended for Hackathon

**Use Railway!** Here's why:

1. ✅ Fastest setup (5 minutes)
2. ✅ Free $5 credit (no credit card needed)
3. ✅ Automatic deployments
4. ✅ Easy to show judges it's running 24/7
5. ✅ Built-in logs and monitoring

---

## 🚀 Quick Railway Deployment (Copy-Paste)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Go to solver bot directory
cd packages/solver-bot

# 4. Initialize
railway init

# 5. Set environment variables
railway variables set SOLVER_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
railway variables set RPC_URL=https://eth-rpc-testnet.polkadot.io
railway variables set INTENT_REGISTRY_ADDRESS=0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
railway variables set XCM_BRIDGE_ADDRESS=0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88

# 6. Deploy
railway up

# 7. View logs
railway logs
```

**Done!** Your bot is now running 24/7 in the cloud! 🎉

---

## 🔒 Security Best Practices

### 1. Never Commit Private Keys

Already done - `.env` is in `.gitignore`

### 2. Use Environment Variables

Always set `SOLVER_PRIVATE_KEY` as an environment variable, never hardcode it.

### 3. Limit Funds in Solver Wallet

Only keep enough PAS for operations (e.g., 10-20 PAS). Don't use your main wallet.

### 4. Monitor Regularly

Check logs daily to ensure bot is running correctly.

### 5. Set Alerts

Most platforms (Railway, Render) can send email alerts if your bot crashes.

---

## 📊 Monitoring Your Bot

### Railway Dashboard

1. Go to https://railway.app/dashboard
2. Click your project
3. View metrics:
   - CPU usage
   - Memory usage
   - Network traffic
   - Logs

### Check if Bot is Working

```bash
# View recent logs
railway logs --tail 100

# Check for these messages:
# ✅ "Solver Address: 0x..."
# ✅ "Already registered as solver"
# ✅ "Polling for new intents..."
# ✅ "Found X intent(s), Y pending"
```

---

## 🐛 Troubleshooting

### Bot Not Starting

**Check logs**:
```bash
railway logs
```

**Common issues**:
- Missing environment variables
- Invalid private key
- Insufficient balance

### Bot Crashes

**Restart**:
```bash
railway restart
```

### Bot Not Executing Intents

**Check**:
1. Is bot registered? (Check logs for "Already registered")
2. Does bot have enough stake? (Need at least 0.1 PAS)
3. Are there pending intents? (Check frontend)
4. Is RPC URL correct?

---

## 💰 Cost Breakdown

### Railway (Recommended)
- Free $5 credit
- After credit: ~$2-3/month
- Includes: 512MB RAM, 1GB storage, unlimited bandwidth

### Render
- Free tier: Limited hours/month
- Paid: $7/month for always-on

### Fly.io
- Free tier: 3 shared VMs
- Paid: $1.94/month per VM

### VPS
- DigitalOcean: $6/month (1GB RAM)
- AWS Lightsail: $5/month (512MB RAM)
- Linode: $5/month (1GB RAM)

---

## 🎬 For Your Demo

**Show judges that your bot is deployed:**

1. Open Railway dashboard during demo
2. Show live logs
3. Show bot has been running for X hours/days
4. Show bot executing intents in real-time

This proves your project is production-ready, not just a local demo!

---

## ✅ Deployment Checklist

- [ ] Choose deployment platform (Railway recommended)
- [ ] Install CLI tool
- [ ] Set environment variables
- [ ] Deploy bot
- [ ] Verify bot is running (check logs)
- [ ] Test with a real intent
- [ ] Monitor for 24 hours
- [ ] Add deployment URL to hackathon submission

---

**Ready to deploy?** Start with Railway - it's the fastest! 🚀

```bash
npm install -g @railway/cli
railway login
cd packages/solver-bot
railway init
railway variables set SOLVER_PRIVATE_KEY=YOUR_KEY
railway up
```

That's it! Your bot is live! 🎉
