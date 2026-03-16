# ⚠️ IMPORTANT: Set Your Private Key

You need to set your solver's private key as an environment variable in Railway.

## Option 1: Using Railway CLI (Recommended)

```bash
cd packages/solver-bot
railway variables set SOLVER_PRIVATE_KEY=YOUR_ACTUAL_PRIVATE_KEY_HERE
```

**Replace `YOUR_ACTUAL_PRIVATE_KEY_HERE` with your actual private key!**

## Option 2: Using Railway Dashboard

1. Go to https://railway.app/dashboard
2. Click on your "polkadot" project
3. Click on the "polkadot" service
4. Go to "Variables" tab
5. Click "New Variable"
6. Name: `SOLVER_PRIVATE_KEY`
7. Value: Your actual private key (starts with 0x)
8. Click "Add"

## After Setting the Private Key

Deploy again:

```bash
cd packages/solver-bot
railway up
```

## Verify Variables

Check all variables are set:

```bash
railway variables
```

You should see:
- ✅ RPC_URL
- ✅ INTENT_REGISTRY_ADDRESS
- ✅ XCM_BRIDGE_ADDRESS
- ✅ SOLVER_MIN_REWARD
- ✅ SOLVER_POLL_INTERVAL
- ✅ SOLVER_PRIVATE_KEY (your private key)

## Security Note

⚠️ **NEVER commit your private key to Git!**
⚠️ **Only set it as an environment variable in Railway**

---

Once you've set the private key, run:

```bash
railway up
```

Your bot will deploy successfully! 🚀
