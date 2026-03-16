# 🔧 Troubleshooting Guide

## Execute Button Not Working

### Issue: Click "Execute" but nothing happens

### Quick Fixes:

#### 1. Check Wallet Connection
- ✅ Is your wallet connected? (Check top right)
- ✅ Are you on the correct network?
  - Network: **Polkadot Hub TestNet**
  - Chain ID: **420420417**
  - RPC: **https://eth-rpc-testnet.polkadot.io**

#### 2. Add Polkadot Hub TestNet to MetaMask

If you don't see Polkadot Hub TestNet in your wallet:

**Manual Setup:**
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name**: Polkadot Hub TestNet
   - **RPC URL**: https://eth-rpc-testnet.polkadot.io
   - **Chain ID**: 420420417
   - **Currency Symbol**: PAS
   - **Block Explorer**: https://blockscout-testnet.polkadot.io
5. Click "Save"
6. Switch to Polkadot Hub TestNet

#### 3. Get PAS Tokens

You need PAS tokens to pay for gas and rewards:

1. Go to https://faucet.polkadot.io
2. Enter your wallet address
3. Request tokens
4. Wait 1-2 minutes
5. Check your balance

#### 4. Check Console for Errors

Open browser console (F12) and look for:
- ❌ "Insufficient funds" → Get more PAS tokens
- ❌ "User rejected" → You cancelled the transaction
- ❌ "Wrong network" → Switch to Polkadot Hub TestNet
- ❌ "Contract not found" → Check RPC URL is correct

#### 5. Refresh the Page

Sometimes a simple refresh helps:
1. Press Ctrl+R (or Cmd+R on Mac)
2. Reconnect your wallet
3. Try again

### Step-by-Step Test:

```bash
# 1. Make sure frontend is running
cd packages/frontend
npm run dev

# 2. Open http://localhost:3000

# 3. Connect wallet (top right)

# 4. Switch to Polkadot Hub TestNet

# 5. Get PAS tokens from faucet

# 6. Type in terminal:
send 0.01 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# 7. Click "Execute"

# 8. Approve transaction in MetaMask
```

### Common Errors:

#### "Please connect your wallet"
- **Fix**: Click "Connect Wallet" button in top right

#### "Insufficient funds"
- **Fix**: Get PAS tokens from https://faucet.polkadot.io

#### "Wrong network"
- **Fix**: Switch to Polkadot Hub TestNet in MetaMask

#### "Transaction rejected"
- **Fix**: You clicked "Reject" in MetaMask. Try again and click "Confirm"

#### Nothing happens when clicking Execute
- **Fix**: 
  1. Open browser console (F12)
  2. Look for error messages
  3. Check if wallet is connected
  4. Check if on correct network

### Still Not Working?

#### Check These:

1. **Wallet Connected?**
   ```
   Top right should show: "1.03 PAS  0x1E...89B7"
   ```

2. **Correct Network?**
   ```
   Should show: "Polkadot Hub TestNet"
   ```

3. **Have PAS Tokens?**
   ```
   Balance should be > 0.01 PAS
   ```

4. **Contract Address Correct?**
   ```
   IntentRegistry: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2
   ```

5. **RPC Working?**
   ```bash
   curl https://eth-rpc-testnet.polkadot.io
   # Should return JSON response
   ```

### Debug Mode:

Open browser console (F12) and run:

```javascript
// Check if contract address is set
console.log(process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS);
// Should show: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2

// Check if wallet is connected
console.log(window.ethereum?.selectedAddress);
// Should show your wallet address

// Check network
console.log(window.ethereum?.chainId);
// Should show: 0x190f8c01 (hex for 420420417)
```

### Network Configuration:

If MetaMask doesn't have Polkadot Hub TestNet, add it manually:

```json
{
  "chainId": "0x190f8c01",
  "chainName": "Polkadot Hub TestNet",
  "nativeCurrency": {
    "name": "PAS",
    "symbol": "PAS",
    "decimals": 18
  },
  "rpcUrls": ["https://eth-rpc-testnet.polkadot.io"],
  "blockExplorerUrls": ["https://blockscout-testnet.polkadot.io"]
}
```

### Test Transaction:

Try this simple command first:

```
send 0.001 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

This uses a very small amount (0.001 PAS) to test if everything works.

### Contact:

If still not working, check:
1. Browser console for errors
2. MetaMask for pending transactions
3. Network status at https://eth-rpc-testnet.polkadot.io

---

**Most Common Fix**: Make sure you're on Polkadot Hub TestNet and have PAS tokens!
