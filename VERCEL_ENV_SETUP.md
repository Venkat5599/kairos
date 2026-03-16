# 🚀 Vercel Environment Variables Setup

## Issue
The Vercel deployment doesn't have the Polkadot Hub TestNet environment variables set, so it's still using old/missing configuration.

## Solution
Add environment variables in Vercel dashboard.

---

## 📝 Step-by-Step Guide

### 1. Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click on your `kairos` project
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar

### 2. Add These Environment Variables

**Copy and paste these one by one:**

#### Contract Addresses:
```
Name: NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS
Value: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
```

```
Name: NEXT_PUBLIC_INTENT_ROUTER_ADDRESS
Value: 0xEd3d29D7f2b3eC3708f52fa009d2E77Fb0DfAaD6
```

```
Name: NEXT_PUBLIC_XCM_BRIDGE_ADDRESS
Value: 0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88
```

#### Network Configuration:
```
Name: NEXT_PUBLIC_RPC_URL
Value: https://eth-rpc-testnet.polkadot.io
```

```
Name: NEXT_PUBLIC_CHAIN_ID
Value: 420420417
```

```
Name: NEXT_PUBLIC_NETWORK_NAME
Value: Polkadot Hub TestNet
```

#### Block Explorer:
```
Name: NEXT_PUBLIC_EXPLORER_URL
Value: https://blockscout-testnet.polkadot.io
```

#### Optional (can leave empty):
```
Name: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
Value: (leave empty or add your WalletConnect project ID)
```

```
Name: NEXT_PUBLIC_SOLVER_ADDRESS
Value: 0x1E0048D83ba01D823dc852cfabeb94fC76B089B7
```

```
Name: NEXT_PUBLIC_API_URL
Value: (leave empty)
```

### 3. Select Environment
For each variable, select:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Redeploy
After adding all variables:
1. Go to "Deployments" tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Wait 2-3 minutes for deployment to complete

---

## 🎯 Quick Copy-Paste Format

If Vercel supports bulk import, use this format:

```env
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=0xEd3d29D7f2b3eC3708f52fa009d2E77Fb0DfAaD6
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88
NEXT_PUBLIC_RPC_URL=https://eth-rpc-testnet.polkadot.io
NEXT_PUBLIC_CHAIN_ID=420420417
NEXT_PUBLIC_NETWORK_NAME=Polkadot Hub TestNet
NEXT_PUBLIC_EXPLORER_URL=https://blockscout-testnet.polkadot.io
NEXT_PUBLIC_SOLVER_ADDRESS=0x1E0048D83ba01D823dc852cfabeb94fC76B089B7
```

---

## ✅ Verification

After redeployment, check:

1. **Open your Vercel URL**
2. **Open browser console** (F12)
3. **Run this:**
   ```javascript
   console.log(process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS);
   ```
4. **Should show**: `0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2`

If it shows `undefined`, the environment variables aren't set correctly.

---

## 🐛 Troubleshooting

### Variables Not Working?

1. **Check spelling**: Must be EXACTLY as shown (case-sensitive)
2. **Check prefix**: Must start with `NEXT_PUBLIC_`
3. **Redeploy**: Changes only apply after redeployment
4. **Clear cache**: Try hard refresh (Ctrl+Shift+R)

### Still Not Working?

1. Go to Vercel dashboard
2. Click "Deployments"
3. Click latest deployment
4. Click "View Function Logs"
5. Check for errors

---

## 📸 Screenshot Guide

### Step 1: Settings
![Vercel Settings](https://vercel.com/docs/environment-variables)

### Step 2: Add Variable
1. Click "Add New"
2. Enter Name (e.g., `NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS`)
3. Enter Value (e.g., `0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2`)
4. Select all environments (Production, Preview, Development)
5. Click "Save"

### Step 3: Repeat
Add all 9 variables following the same process.

### Step 4: Redeploy
1. Go to "Deployments" tab
2. Find latest deployment
3. Click "..." menu
4. Click "Redeploy"
5. Wait for completion

---

## 🎯 Expected Result

After setup:
- ✅ Vercel site connects to Polkadot Hub TestNet
- ✅ Contract addresses are correct
- ✅ Execute button works
- ✅ Intents are created successfully
- ✅ Solver bot picks them up

---

## 📝 Alternative: Use Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS production
# Enter: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2

vercel env add NEXT_PUBLIC_INTENT_ROUTER_ADDRESS production
# Enter: 0xEd3d29D7f2b3eC3708f52fa009d2E77Fb0DfAaD6

vercel env add NEXT_PUBLIC_XCM_BRIDGE_ADDRESS production
# Enter: 0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88

vercel env add NEXT_PUBLIC_RPC_URL production
# Enter: https://eth-rpc-testnet.polkadot.io

vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 420420417

vercel env add NEXT_PUBLIC_NETWORK_NAME production
# Enter: Polkadot Hub TestNet

vercel env add NEXT_PUBLIC_EXPLORER_URL production
# Enter: https://blockscout-testnet.polkadot.io

# Redeploy
vercel --prod
```

---

## ⏱️ Time Required

- Adding variables: 5 minutes
- Redeployment: 2-3 minutes
- **Total**: ~8 minutes

---

## 🎉 After Setup

Your Vercel deployment will:
- ✅ Connect to Polkadot Hub TestNet
- ✅ Use correct contract addresses
- ✅ Work exactly like local version
- ✅ Be ready for hackathon submission

---

**Need help?** Check Vercel docs: https://vercel.com/docs/environment-variables
