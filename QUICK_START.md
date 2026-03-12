# Kairos - Quick Start Guide

Get Kairos running on Moonbase Alpha testnet in 5 minutes!

## 🎯 What You'll Do

1. Get testnet tokens (free)
2. Deploy smart contracts to Moonbase Alpha
3. Start the frontend
4. Test creating intents!

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A wallet (MetaMask recommended)

## 🚀 Step-by-Step Deployment

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd kairos
npm install
```

### Step 2: Check Readiness

```bash
cd packages/contracts
bash check-devnet-ready.sh
```

This will tell you what's missing (if anything).

### Step 3: Get Testnet Tokens

1. Visit https://faucet.moonbeam.network/
2. Connect your wallet
3. Click "Request DEV tokens"
4. Wait ~30 seconds

You'll receive 1 DEV token (enough for deployment).

### Step 4: Configure Private Key

```bash
cd packages/contracts
nano .env.moonbase
```

Replace `YOUR_PRIVATE_KEY_HERE` with your wallet's private key.

**How to get your private key:**
- MetaMask: Account menu → Account details → Export private key
- Or create new: `cast wallet new`

⚠️ **Never share this key or commit it to git!**

### Step 5: Deploy Contracts

```bash
bash deploy-moonbase.sh
```

This will:
- Deploy IntentRegistry, IntentRouter, and XCMBridge
- Show you the contract addresses
- Verify contracts on Moonscan

**Save the contract addresses!** You'll need them next.

### Step 6: Configure Frontend

```bash
cd ../frontend
nano .env.local
```

Update with your deployed addresses:

```env
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
NEXT_PUBLIC_CHAIN_ID=1287
```

### Step 7: Start Frontend

```bash
npm run dev
```

Visit http://localhost:3000

### Step 8: Connect Wallet

1. Click "Connect Wallet" in the UI
2. Add Moonbase Alpha network to MetaMask:
   - Network Name: **Moonbase Alpha**
   - RPC URL: **https://rpc.api.moonbase.moonbeam.network**
   - Chain ID: **1287**
   - Currency: **DEV**
   - Explorer: **https://moonbase.moonscan.io**

3. Switch to Moonbase Alpha network
4. Connect your wallet

### Step 9: Test It!

1. Enter an intent: "Send 0.1 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
2. Set reward: 0.01 DEV
3. Click "Submit Intent"
4. Confirm transaction in MetaMask
5. Watch your intent appear in the list!

## 🎉 Success!

You've deployed Kairos to Moonbase Alpha testnet!

## 📊 View Your Contracts

Visit Moonscan to see your deployed contracts:
https://moonbase.moonscan.io/address/YOUR_CONTRACT_ADDRESS

## 🐛 Troubleshooting

### "Insufficient funds"
- Get more DEV from the faucet
- Wait a few minutes and try again

### "Cannot connect to wallet"
- Make sure MetaMask is installed
- Check you're on Moonbase Alpha network
- Try refreshing the page

### "Transaction failed"
- Check you have enough DEV for gas
- Make sure contract addresses are correct in .env.local
- Check Moonscan for error details

### "Contracts not deploying"
- Run `forge build` to check for compilation errors
- Verify your private key is correct
- Check your DEV balance

## 📚 Next Steps

- Read [DEVNET_SETUP.md](./packages/contracts/DEVNET_SETUP.md) for advanced options
- Check [MOONBASE_DEPLOYMENT.md](./packages/contracts/MOONBASE_DEPLOYMENT.md) for details
- Explore [ARCHITECTURE.md](./docs/ARCHITECTURE.md) to understand the system
- Join our community and share your deployment!

## 💡 Tips

- Keep your Anvil terminal running if testing locally
- Use Moonscan to debug transactions
- Test with small amounts first
- Save your contract addresses somewhere safe

## 🆘 Need Help?

- Check the troubleshooting section above
- Read the full documentation in `/docs`
- Open an issue on GitHub
- Ask in our community chat

---

**Happy building! 🚀**
