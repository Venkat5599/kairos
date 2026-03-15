# How to Send Assets with Kairos

## 🎯 What is Kairos?

Kairos is an **intent-based execution system**. Instead of manually sending transactions, you describe what you want to do in natural language, and a solver bot executes it for you automatically!

## 💰 Step 1: Get Test Tokens

1. Go to **Moonbase Alpha Faucet**: https://faucet.moonbeam.network/
2. Connect your MetaMask wallet
3. Request DEV tokens (you'll get ~1 DEV)
4. Wait ~30 seconds for tokens to arrive

## 🔗 Step 2: Connect Your Wallet

1. Open http://localhost:3000
2. Click **"Connect Wallet"** button (top right)
3. Select MetaMask
4. Make sure you're on **Moonbase Alpha** network
   - Network Name: Moonbase Alpha
   - Chain ID: 1287
   - RPC: https://rpc.api.moonbase.moonbeam.network

## 📝 Step 3: Create an Intent

In the **"NEW INTENT PROTOCOL"** terminal on the homepage:

### Example 1: Send DEV to an address
```
Send 0.01 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```
- **Reward**: `0.005` (this is what the solver earns)
- Click **EXECUTE**

### Example 2: Send to another address
```
Send 0.05 DEV to 0x1234567890123456789012345678901234567890
```
- **Reward**: `0.01`
- Click **EXECUTE**

### Example 3: Transfer format
```
Transfer 0.02 DEV to 0xYourFriendAddress
```
- **Reward**: `0.005`
- Click **EXECUTE**

## ⚡ Step 4: Watch the Magic!

Once you click EXECUTE:

1. **MetaMask pops up** - Approve the transaction
   - You're paying: Amount + Reward + Gas
   - Example: 0.01 DEV (send) + 0.005 DEV (reward) = 0.015 DEV total

2. **Intent is created** on the blockchain
   - Status: "Pending"
   - Visible in "ACTIVE INTENTS" section

3. **Solver bot detects it** (check the solver terminal)
   ```
   🔔 New Intent Detected!
   🎯 Processing Intent...
   ```

4. **Bot executes automatically**:
   - Claims the intent
   - Sends the DEV to recipient
   - Marks as completed
   - Claims the reward

5. **Intent status updates** to "Completed"
   - You'll see it in the UI with 100% progress
   - Transaction hash visible on Moonscan

## 🎬 Complete Example

Let's say you want to send 0.1 DEV to your friend:

1. **Your wallet**: `0xYourAddress` (has 1 DEV)
2. **Friend's wallet**: `0xFriendAddress` (will receive 0.1 DEV)

**In Kairos UI:**
```
Description: Send 0.1 DEV to 0xFriendAddress
Reward: 0.01 DEV
```

**What happens:**
- You pay: 0.1 + 0.01 = 0.11 DEV (+ gas ~0.001)
- Solver bot receives: 0.01 DEV (reward)
- Your friend receives: 0.1 DEV
- **Total cost to you**: ~0.111 DEV

## 🔍 Verify on Blockchain

After execution, check on Moonscan:

1. **Your transaction**: https://moonbase.moonscan.io/address/YOUR_ADDRESS
2. **Friend's wallet**: https://moonbase.moonscan.io/address/FRIEND_ADDRESS
3. **Contract**: https://moonbase.moonscan.io/address/0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777

## 📊 Understanding the UI

### Stats Cards (Top)
- **TOTAL INTENTS**: All intents ever created
- **COMPLETED**: Successfully executed intents
- **SUCCESS RATE**: Percentage of successful executions

### Intent Terminal (Middle)
- Type your intent in natural language
- Set reward amount
- Click EXECUTE to create

### Active Intents (Bottom)
- See all intents and their status
- **Pending**: Waiting for solver
- **Executing**: Solver is working on it
- **Completed**: Successfully done ✅
- **Failed**: Something went wrong ❌

## 💡 Tips

1. **Reward Amount**: 
   - Minimum: 0.001 DEV
   - Recommended: 5-10% of transfer amount
   - Higher reward = faster execution (if multiple solvers)

2. **Intent Format**:
   - Must include amount and address
   - Supported: "Send X DEV to 0x..."
   - Supported: "Transfer X DEV to 0x..."
   - Case insensitive

3. **Gas Costs**:
   - Creating intent: ~0.001 DEV
   - Total cost: Amount + Reward + Gas

4. **Execution Time**:
   - Usually 10-30 seconds
   - Depends on block time and solver polling

## 🐛 Troubleshooting

### "Name 'Alice' not found"
- You must use actual Ethereum addresses (0x...)
- Name service not yet implemented

### "Insufficient balance"
- Make sure you have enough DEV for: Amount + Reward + Gas
- Get more from faucet

### Intent stays "Pending"
- Check if solver bot is running
- Check if reward is above minimum (0.001 DEV)
- Check intent format is correct

### Transaction fails
- Make sure recipient address is valid
- Check you have enough balance
- Try with smaller amount first

## 🎯 Advanced: Multiple Intents

You can create multiple intents:

```
Intent 1: Send 0.01 DEV to 0xAddress1 (Reward: 0.005)
Intent 2: Send 0.02 DEV to 0xAddress2 (Reward: 0.005)
Intent 3: Send 0.03 DEV to 0xAddress3 (Reward: 0.005)
```

The solver bot will process them one by one automatically!

## 🚀 Why Use Kairos?

Instead of:
1. Opening MetaMask
2. Clicking Send
3. Pasting address
4. Entering amount
5. Confirming transaction

You just:
1. Type what you want in natural language
2. Click EXECUTE
3. Done! ✨

The solver handles everything automatically!

---

**Need help?** Check the solver bot terminal to see what's happening in real-time!
