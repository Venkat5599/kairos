# 🤖 Solver Bot Deployment Guide

## Overview

The Kairos Solver Bot monitors pending intents and executes them automatically. This guide covers multiple deployment options.

---

## ⚠️ Security Warning

**NEVER commit your private key to Git!**

- Use environment variables
- Use encrypted secrets
- For production, use a hardware wallet or key management service

---

## Option 1: Railway (Easiest - Recommended)

Railway is perfect for Node.js bots with 24/7 uptime.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

### Step 3: Initialize Project

```bash
cd packages/solver-bot
railway init
```

### Step 4: Add Environment Variables

```bash
railway variables set PRIVATE_KEY=your_private_key_here
railway variables set RPC_URL=https://rpc.api.moonbase.moonbeam.network
railway variables set INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
railway variables set CHAIN_ID=1287
```

### Step 5: Deploy

```bash
railway up
```

### Step 6: Check Logs

```bash
railway logs
```

**Cost**: Free tier available (500 hours/month)

---

## Option 2: Render

Render is another great option for background workers.

### Step 1: Create `render.yaml`

Already created in the solver-bot directory.

### Step 2: Connect to Render

1. Go to https://render.com
2. Click "New +" → "Background Worker"
3. Connect your GitHub repository
4. Select `packages/solver-bot` as root directory

### Step 3: Configure

- **Name**: kairos-solver-bot
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm run start:simple`

### Step 4: Add Environment Variables

In Render dashboard:
```
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.api.moonbase.moonbeam.network
INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
CHAIN_ID=1287
```

### Step 5: Deploy

Click "Create Background Worker"

**Cost**: Free tier available

---

## Option 3: Heroku

### Step 1: Install Heroku CLI

```bash
npm install -g heroku
```

### Step 2: Login

```bash
heroku login
```

### Step 3: Create App

```bash
cd packages/solver-bot
heroku create kairos-solver-bot
```

### Step 4: Add Buildpack

```bash
heroku buildpacks:set heroku/nodejs
```

### Step 5: Set Environment Variables

```bash
heroku config:set PRIVATE_KEY=your_private_key_here
heroku config:set RPC_URL=https://rpc.api.moonbase.moonbeam.network
heroku config:set INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
heroku config:set CHAIN_ID=1287
```

### Step 6: Create Procfile

Already created in solver-bot directory.

### Step 7: Deploy

```bash
git add .
git commit -m "Deploy solver bot"
git push heroku main
```

### Step 8: Scale Worker

```bash
heroku ps:scale worker=1
```

### Step 9: Check Logs

```bash
heroku logs --tail
```

**Cost**: $7/month for basic dyno

---

## Option 4: AWS EC2 (Advanced)

For full control and production deployments.

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch Instance
3. Choose Ubuntu 22.04 LTS
4. Instance type: t2.micro (free tier)
5. Configure security group (no inbound needed)
6. Download key pair

### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### Step 4: Clone Repository

```bash
git clone https://github.com/Venkat5599/kairos.git
cd kairos/packages/solver-bot
npm install
```

### Step 5: Create Environment File

```bash
nano .env
```

Add:
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.api.moonbase.moonbeam.network
INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
CHAIN_ID=1287
```

Save with `Ctrl+X`, `Y`, `Enter`

### Step 6: Start with PM2

```bash
pm2 start npm --name "kairos-solver" -- run start:simple
pm2 save
pm2 startup
```

### Step 7: Monitor

```bash
pm2 logs kairos-solver
pm2 monit
```

**Cost**: Free tier for 12 months, then ~$10/month

---

## Option 5: DigitalOcean Droplet

Similar to AWS but simpler.

### Step 1: Create Droplet

1. Go to DigitalOcean
2. Create Droplet
3. Choose Ubuntu 22.04
4. Basic plan ($6/month)
5. Add SSH key

### Step 2: Connect

```bash
ssh root@your-droplet-ip
```

### Step 3: Setup (same as AWS)

Follow AWS steps 3-7 above.

**Cost**: $6/month

---

## Option 6: Docker (Any Platform)

### Step 1: Create Dockerfile

Already created in solver-bot directory.

### Step 2: Build Image

```bash
cd packages/solver-bot
docker build -t kairos-solver-bot .
```

### Step 3: Run Container

```bash
docker run -d \
  --name kairos-solver \
  --restart unless-stopped \
  -e PRIVATE_KEY=your_private_key_here \
  -e RPC_URL=https://rpc.api.moonbase.moonbeam.network \
  -e INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB \
  -e CHAIN_ID=1287 \
  kairos-solver-bot
```

### Step 4: Check Logs

```bash
docker logs -f kairos-solver
```

### Step 5: Deploy to Any Cloud

You can deploy this Docker image to:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- Fly.io
- Railway (supports Docker)

---

## Option 7: Local Machine (Development Only)

### For Testing

```bash
cd packages/solver-bot
npm install
cp .env.example .env
# Edit .env with your private key
npm run start:simple
```

**Not recommended for production** - your computer needs to stay on 24/7.

---

## 🔒 Security Best Practices

### 1. Use Encrypted Secrets

**Railway/Render/Heroku**: Use their built-in secret management

**AWS**: Use AWS Secrets Manager
```bash
# Store secret
aws secretsmanager create-secret \
  --name kairos-solver-key \
  --secret-string "your_private_key"

# Retrieve in code
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();
const secret = await secretsManager.getSecretValue({
  SecretId: 'kairos-solver-key'
}).promise();
```

### 2. Use Separate Wallet for Bot

- Don't use your main wallet
- Fund with only what's needed
- Monitor balance regularly

### 3. Set Spending Limits

Add to your bot code:
```typescript
const MAX_GAS_PRICE = parseUnits('100', 'gwei');
const MAX_DAILY_SPEND = parseEther('1'); // 1 DEV per day

if (gasPrice > MAX_GAS_PRICE) {
  console.log('Gas price too high, skipping');
  return;
}
```

### 4. Enable Monitoring

Add health checks:
```typescript
// Send heartbeat every 5 minutes
setInterval(() => {
  console.log('Bot alive:', new Date().toISOString());
  // Optional: Send to monitoring service
}, 5 * 60 * 1000);
```

### 5. Rotate Keys Regularly

- Change private key every 30 days
- Use different keys for testnet/mainnet
- Keep backup keys secure

---

## 📊 Monitoring & Alerts

### Option 1: UptimeRobot (Free)

1. Go to https://uptimerobot.com
2. Add HTTP(s) monitor
3. Set up email/SMS alerts

### Option 2: Better Stack (Formerly Logtail)

```bash
npm install @logtail/node

# In your bot code
import { Logtail } from '@logtail/node';
const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

logtail.info('Intent executed', { intentId, reward });
```

### Option 3: Sentry (Error Tracking)

```bash
npm install @sentry/node

# In your bot code
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN });

try {
  await executeIntent(intentId);
} catch (error) {
  Sentry.captureException(error);
}
```

---

## 🚀 Recommended Setup for Hackathon

**For Demo/Hackathon**: Use Railway (easiest, free)

```bash
# Quick deploy
cd packages/solver-bot
railway login
railway init
railway variables set PRIVATE_KEY=your_key
railway variables set RPC_URL=https://rpc.api.moonbase.moonbeam.network
railway variables set INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
railway up
```

**For Production**: Use AWS EC2 with PM2 (reliable, scalable)

---

## 🐛 Troubleshooting

### Bot Not Starting

```bash
# Check logs
railway logs  # Railway
heroku logs --tail  # Heroku
pm2 logs  # PM2
docker logs kairos-solver  # Docker
```

### Out of Gas

```bash
# Check balance
cast balance $SOLVER_ADDRESS --rpc-url $RPC_URL

# Fund from faucet
# Visit: https://faucet.moonbeam.network
```

### Bot Not Detecting Intents

```bash
# Test contract connection
cast call $INTENT_REGISTRY_ADDRESS \
  "getAllIntentIds()(bytes32[])" \
  --rpc-url $RPC_URL
```

### High Gas Costs

Add gas limit in bot:
```typescript
const tx = await contract.executeIntent(intentId, {
  gasLimit: 500000,  // Set max gas
  maxFeePerGas: parseUnits('100', 'gwei')  // Set max fee
});
```

---

## 📈 Scaling

### Multiple Solvers

Deploy multiple instances with different wallets:

```bash
# Instance 1
railway variables set PRIVATE_KEY=key1
railway up

# Instance 2 (new project)
railway init
railway variables set PRIVATE_KEY=key2
railway up
```

### Load Balancing

Use a coordinator service to distribute intents:

```typescript
// coordinator.ts
const solvers = [solver1, solver2, solver3];
const nextSolver = solvers[intentCount % solvers.length];
await nextSolver.execute(intent);
```

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid | Best For |
|----------|-----------|------|----------|
| **Railway** | 500 hrs/mo | $5/mo | Hackathon/Demo |
| **Render** | 750 hrs/mo | $7/mo | Small scale |
| **Heroku** | No | $7/mo | Simple deploy |
| **AWS EC2** | 12 months | $10/mo | Production |
| **DigitalOcean** | No | $6/mo | Production |
| **Fly.io** | Limited | $5/mo | Global deploy |

---

## ✅ Deployment Checklist

- [ ] Private key secured (not in Git)
- [ ] Environment variables set
- [ ] Sufficient DEV balance for gas
- [ ] Solver registered on-chain
- [ ] Bot deployed and running
- [ ] Logs accessible
- [ ] Monitoring/alerts configured
- [ ] Health checks working
- [ ] Backup plan in place

---

## 🎯 Quick Start (Railway - Recommended)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Navigate to solver bot
cd packages/solver-bot

# 3. Login
railway login

# 4. Initialize
railway init

# 5. Set variables
railway variables set PRIVATE_KEY=your_private_key_here
railway variables set RPC_URL=https://rpc.api.moonbase.moonbeam.network
railway variables set INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB

# 6. Deploy
railway up

# 7. Check logs
railway logs

# Done! Your bot is live 24/7 🚀
```

---

## 📞 Support

- GitHub Issues: https://github.com/Venkat5599/kairos/issues
- Documentation: See main README.md
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

---

**Your solver bot is now ready to earn rewards! 💰**
