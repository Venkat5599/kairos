# 🎬 Kairos Demo Guide

## ✅ Pre-Demo Checklist

### Services Running:
- [x] Frontend: http://localhost:3000
- [x] Solver Bot: Running locally (Terminal 2)
- [x] Smart Contracts: Deployed on Polkadot Hub TestNet

### Before Starting Demo:

1. **Open Browser Tabs:**
   - Tab 1: http://localhost:3000 (Frontend)
   - Tab 2: Terminal with solver bot logs
   - Tab 3: https://blockscout-testnet.polkadot.io (Block Explorer)

2. **MetaMask Setup:**
   - Network: Polkadot Hub TestNet
   - Chain ID: 420420417
   - RPC: https://eth-rpc-testnet.polkadot.io
   - Balance: At least 0.1 PAS

3. **Add Network to MetaMask (if not added):**
   ```
   Network Name: Polkadot Hub TestNet
   RPC URL: https://eth-rpc-testnet.polkadot.io
   Chain ID: 420420417
   Currency: PAS
   Explorer: https://blockscout-testnet.polkadot.io
   ```

4. **Get PAS Tokens:**
   - Go to https://faucet.polkadot.io
   - Enter your address
   - Request tokens

---

## 🎯 Demo Script (5-10 minutes)

### 1. Introduction (30 seconds)

**Say:**
> "Kairos is an intent-based execution platform for Polkadot. Instead of complex transactions, users just type what they want in natural language, and our automated solver network makes it happen."

**Show:**
- Landing page with cyberpunk theme
- Point to "Polkadot Hub TestNet" badge

---

### 2. Show the Problem (30 seconds)

**Say:**
> "Cross-chain operations on Polkadot are powerful but complex. Users need to understand XCM, parachains, and technical details. Kairos makes it as easy as sending a text message."

---

### 3. Create an Intent (2 minutes)

**Do:**
1. Click "Connect Wallet" (top right)
2. Approve MetaMask connection
3. Show wallet is connected (displays address and balance)

**Say:**
> "Now I'll create an intent using natural language."

**Type in Intent Terminal:**
```
send 0.01 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Say:**
> "Notice the AI suggestions appearing as I type. This helps users write correct intents."

**Do:**
4. Click "Execute" button
5. Approve transaction in MetaMask

**Say:**
> "The intent is now created on the blockchain. Let's watch our solver bot pick it up."

---

### 4. Show Solver Bot Execution (1-2 minutes)

**Switch to Terminal Tab**

**Say:**
> "Here's our solver bot running 24/7. It's monitoring the blockchain for new intents."

**Point out in logs:**
- "🔔 Pending Intent Found!"
- "🎯 Processing Intent"
- "💸 Step 2: Executing transfer"
- "✅ Intent completed!"

**Say:**
> "The bot automatically detected the intent, parsed it, executed the transfer, and marked it as completed. All without any manual intervention."

---

### 5. Show Live Analytics (1 minute)

**Scroll to Analytics Dashboard**

**Say:**
> "All these metrics are fetched directly from the blockchain in real-time. No backend API needed."

**Point out:**
- Total Intents
- Success Rate
- Average Execution Time
- Active Solvers

---

### 6. Show Intent Templates (1 minute)

**Scroll to Templates Library**

**Say:**
> "For common operations, we have pre-built templates. Users can click and go."

**Do:**
1. Click "Simple Transfer" template
2. Show it auto-fills the terminal

**Say:**
> "Templates are filterable by category and difficulty level."

---

### 7. Show XCM Bridge (1 minute)

**Navigate to XCM Bridge page**

**Say:**
> "For cross-chain transfers, we have a visual interface. Users can select source and destination chains, enter amount and recipient, and create the intent."

**Show:**
- 5 supported chains
- Chain selection with icons
- Swap chains button

---

### 8. Show Intent Marketplace (1 minute)

**Navigate to Intent Marketplace**

**Say:**
> "Solvers can browse pending intents, filter by type, sort by reward, and claim them to earn PAS tokens."

**Show:**
- Pending intents list
- Filters and sorting
- Claim & Execute button

---

### 9. Show Block Explorer (30 seconds)

**Open Blockscout tab**

**Say:**
> "All transactions are verifiable on the Polkadot Hub TestNet block explorer."

**Do:**
1. Search for IntentRegistry contract: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
2. Show recent transactions

---

### 10. Wrap Up (30 seconds)

**Say:**
> "Kairos makes Polkadot's powerful XCM infrastructure accessible to everyone through:
> - Natural language intents
> - AI-powered suggestions
> - Automated solver network
> - Real-time analytics
> - Cross-chain ready
> 
> It's production-ready, fully deployed, and running 24/7 on Polkadot Hub TestNet."

---

## 🎯 Key Points to Emphasize

1. **Innovation**: First intent-based execution platform for Polkadot
2. **User Experience**: Natural language > complex transactions
3. **Production Ready**: Fully deployed, not just a demo
4. **Automated**: Solver network runs 24/7
5. **Cross-Chain**: Native XCM integration
6. **Real-Time**: Live analytics from blockchain
7. **Polkadot Native**: Built specifically for Polkadot ecosystem

---

## 🐛 If Something Goes Wrong

### Execute Button Doesn't Work:
1. Check MetaMask is connected
2. Check you're on Polkadot Hub TestNet
3. Check you have PAS tokens
4. Check browser console for errors

### Solver Bot Doesn't Pick Up Intent:
1. Check bot is running (Terminal 2)
2. Wait 10 seconds (polling interval)
3. Check intent was created (should see transaction hash)

### Transaction Fails:
1. Check you have enough PAS for gas + reward
2. Check network is correct
3. Try with smaller amount (0.001 PAS)

---

## 📊 Demo Checklist

Before demo:
- [ ] Frontend running on localhost:3000
- [ ] Solver bot running in terminal
- [ ] MetaMask connected to Polkadot Hub TestNet
- [ ] Have at least 0.1 PAS in wallet
- [ ] Browser tabs ready (frontend, terminal, explorer)
- [ ] Test create one intent to verify everything works

During demo:
- [ ] Show landing page
- [ ] Create intent with natural language
- [ ] Show solver bot logs
- [ ] Show live analytics
- [ ] Show templates
- [ ] Show XCM bridge
- [ ] Show marketplace
- [ ] Show block explorer

After demo:
- [ ] Answer questions
- [ ] Share GitHub repo: https://github.com/Venkat5599/kairos
- [ ] Share deployed contracts addresses

---

## 🎥 Recording Tips

If recording:
1. Use 1080p or higher resolution
2. Close unnecessary tabs/windows
3. Clear browser console before starting
4. Have good audio (use microphone)
5. Speak clearly and at moderate pace
6. Show URL in browser
7. Keep it under 10 minutes

---

## 📝 Quick Facts

**Project**: Kairos
**Network**: Polkadot Hub TestNet (Chain ID: 420420417)
**Contracts**:
- IntentRegistry: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
- IntentRouter: 0xEd3d29D7f2b3eC3708f52fa009d2E77Fb0DfAaD6
- XCMBridge: 0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88

**Tech Stack**: Solidity 0.8.24, Next.js 14, TypeScript, Wagmi, RainbowKit, ethers.js v6

**GitHub**: https://github.com/Venkat5599/kairos

---

**Good luck with your demo!** 🚀🏆
