# 🌉 Cross-Chain Transfers with Kairos

## 🎯 What is Cross-Chain Transfer?

Kairos now supports **automatic cross-chain bridging**! You can send assets from Moonbeam to other chains like Ethereum, Polkadot, or other parachains - all with a simple natural language command.

## ✨ How It Works

1. **You create an intent**: "Bridge 10 DEV to Ethereum 0x..."
2. **Solver bot detects it**
3. **Bot uses XCM Bridge** to send cross-chain message
4. **Assets arrive on destination chain**
5. **You get confirmation** - all automatic!

## 📝 Supported Intent Formats

### Same-Chain Transfer (Moonbeam → Moonbeam)
```
Send 0.01 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Transfer 0.05 DEV to 0x1234567890123456789012345678901234567890
```

### Cross-Chain Transfer (Moonbeam → Other Chain)
```
Bridge 0.1 DEV to Ethereum 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Send 0.5 DEV from Moonbeam to Polkadot 0x1234567890123456789012345678901234567890
Bridge 1 DEV to Moonriver 0xYourAddress
Send 0.2 DEV from Moonbeam to Astar 0xYourAddress
```

## 🌐 Supported Chains

| Chain | Parachain ID | Status |
|-------|-------------|--------|
| Moonbeam | 2000 | ✅ Active |
| Moonriver | 2004 | ✅ Active |
| Polkadot Asset Hub | 1000 | ✅ Active |
| Astar | 2006 | ✅ Active |
| Ethereum | Via Bridge | 🔄 Coming Soon |

## 💰 Costs

### Same-Chain Transfer
- **Amount**: What you're sending (e.g., 0.1 DEV)
- **Reward**: Solver fee (e.g., 0.01 DEV)
- **Gas**: ~0.001 DEV
- **Total**: Amount + Reward + Gas

### Cross-Chain Transfer
- **Amount**: What you're sending (e.g., 0.1 DEV)
- **Reward**: Solver fee (e.g., 0.02 DEV)
- **Bridge Fee**: 0.01 DEV (XCM message cost)
- **Gas**: ~0.002 DEV
- **Total**: Amount + Reward + Bridge Fee + Gas

## 🚀 Example: Bridge to Ethereum

Let's say you want to send 1 DEV from Moonbeam to Ethereum:

### Step 1: Create Intent
```
Bridge 1 DEV to Ethereum 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```
- **Reward**: `0.05 DEV` (higher reward for cross-chain)

### Step 2: Approve Transaction
MetaMask will ask you to approve:
- **Sending**: 1 DEV
- **Reward**: 0.05 DEV
- **Bridge Fee**: 0.01 DEV
- **Gas**: ~0.002 DEV
- **Total**: ~1.062 DEV

### Step 3: Automatic Execution
The solver bot will:
1. ✅ Claim your intent
2. 🌉 Send XCM message to bridge
3. 📦 Bridge processes the transfer
4. ✅ Mark intent as completed
5. 💰 Claim the reward

### Step 4: Verify
- Check Moonbeam transaction: https://moonbase.moonscan.io/
- Check destination chain explorer
- Assets arrive in 2-5 minutes (depending on chain)

## 🎬 Complete Example

### Scenario: Send DEV to Polkadot

**Your wallet**: `0xYourMoonbeamAddress` (has 5 DEV)
**Friend's wallet**: `0xFriendPolkadotAddress` (will receive 0.5 DEV)

**In Kairos UI:**
```
Description: Bridge 0.5 DEV to Polkadot 0xFriendPolkadotAddress
Reward: 0.02 DEV
```

**What happens:**
1. You pay: 0.5 + 0.02 + 0.01 = 0.53 DEV (+ gas)
2. Solver bot claims intent
3. Bot sends XCM message via bridge
4. Bridge transfers 0.5 DEV to Polkadot
5. Friend receives 0.5 DEV on Polkadot
6. Solver earns 0.02 DEV reward

**Total cost to you**: ~0.532 DEV
**Friend receives**: 0.5 DEV on Polkadot

## 🔍 How to Track Cross-Chain Transfers

### On Moonbeam (Source)
1. Go to https://moonbase.moonscan.io/
2. Search for your transaction hash
3. Look for `XCMMessageSent` event

### On Destination Chain
1. Wait 2-5 minutes for bridging
2. Check destination chain explorer
3. Search for recipient address
4. Verify balance increased

### In Kairos UI
- Intent status shows "Completed"
- Transaction hash is displayed
- Click to view on Moonscan

## 💡 Tips for Cross-Chain Transfers

1. **Higher Rewards**: Cross-chain transfers are more complex, so offer higher rewards (5-10% of amount)

2. **Bridge Time**: Cross-chain transfers take 2-5 minutes, not instant like same-chain

3. **Minimum Amount**: Bridge at least 0.1 DEV to make fees worthwhile

4. **Verify Address**: Double-check recipient address is valid on destination chain

5. **Test First**: Try a small amount first (0.1 DEV) before larger transfers

## 🐛 Troubleshooting

### "Chain not supported"
- Check the supported chains list above
- Make sure you spelled the chain name correctly
- Use: ethereum, polkadot, moonriver, astar

### "Insufficient balance for bridge fee"
- You need: Amount + Reward + Bridge Fee (0.01) + Gas
- Get more DEV from faucet

### Transfer stuck "Executing"
- Cross-chain takes 2-5 minutes
- Check XCM message status on bridge
- If stuck >10 minutes, contact support

### Assets didn't arrive
- Check destination chain explorer
- Verify recipient address is correct
- Check XCM message status
- May take up to 10 minutes in rare cases

## 🎯 Advanced: Multi-Chain Routing

Coming soon: Kairos will automatically find the best route!

Example:
```
Send 100 USDC from Moonbeam to Ethereum 0x...
```

Kairos will:
1. Check if direct bridge exists
2. If not, find optimal route (e.g., Moonbeam → Polkadot → Ethereum)
3. Execute multi-hop transfer automatically
4. All in one transaction!

## 🔐 Security

- All transfers are on-chain and verifiable
- XCM is Polkadot's native cross-chain protocol
- Solver bot is non-custodial (never holds your funds)
- Bridge contracts are audited (in production)

## 📊 Comparison

### Traditional Cross-Chain Transfer
1. Go to bridge website
2. Connect wallet
3. Select source chain
4. Select destination chain
5. Enter amount
6. Approve token
7. Confirm bridge transaction
8. Wait for confirmation
9. Check destination chain
**Time**: 10-15 minutes of manual work

### Kairos Cross-Chain Transfer
1. Type: "Bridge 1 DEV to Ethereum 0x..."
2. Click EXECUTE
3. Done! ✨
**Time**: 30 seconds of your time, bot handles the rest

## 🚀 Future Features

- [ ] Support for ERC-20 tokens (USDC, USDT, etc.)
- [ ] Automatic best-route finding
- [ ] Multi-hop transfers
- [ ] Batch cross-chain transfers
- [ ] Cross-chain swaps (e.g., DEV → ETH)
- [ ] NFT bridging

---

**Ready to try?** Open http://localhost:3000 and create your first cross-chain intent! 🌉
