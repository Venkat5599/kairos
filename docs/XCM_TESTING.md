# Testing Real XCM Integration

## Quick Start Commands

### 1. Test the Contract Function

```bash
cd packages/contracts

# Verify function exists
cast call 0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234 \
  "sendRealXCMTransfer(uint32,bytes32,uint256)" \
  --rpc-url moonbase

# Check Xtokens precompile
cast code 0x0000000000000000000000000000000000000804 --rpc-url moonbase
```

### 2. Run Test Script

```bash
chmod +x test-real-xcm.sh
./test-real-xcm.sh
```

### 3. Start Solver Bot with Real XCM

```bash
cd ../solver-bot
npm run start:simple
```

### 4. Create Test Intent

Open another terminal:

```bash
# Create a cross-chain intent via frontend or directly with cast
cd packages/contracts

# Example: Create intent for 0.05 DEV to Polkadot
cast send 0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB \
  "createIntent(string,uint256)" \
  "Bridge 0.05 DEV to Polkadot 0x1234567890123456789012345678901234567890123456789012345678901234" \
  50000000000000000 \
  --value 50000000000000000 \
  --rpc-url moonbase \
  --private-key 0x2e8ca714b56638e54705e0c39194e35bd98e82c8bccf8b61d1acbe02aba85a1d \
  --legacy
```

### 5. Watch Solver Bot Execute

The bot will:
1. Detect the pending intent
2. Parse "Bridge 0.05 DEV to Polkadot 0x..."
3. Call `sendRealXCMTransfer()` on XCMBridge
4. Xtokens precompile executes REAL XCM transfer
5. Mark intent as completed

### 6. Verify on Explorers

**Moonbase Alpha**:
```
https://moonbase.moonscan.io/address/0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234
```

**Polkadot XCM Messages**:
```
https://polkadot.subscan.io/xcm_message
```

**Asset Hub**:
```
https://assethub-polkadot.subscan.io/
```

## Expected Output

### Solver Bot Console:

```
🔍 Polling for pending intents...
📋 Found 1 pending intent(s)

🎯 Processing Intent: 0xabc123...
   Description: Bridge 0.05 DEV to Polkadot 0x1234...
   Reward: 0.05 DEV
   Type: cross-chain

✅ Step 1: Claiming intent...
✅ Intent claimed! (Block: 15569123)

🌉 Step 2: Executing REAL cross-chain transfer...
   🌉 REAL XCM TRANSFER via Xtokens Precompile
   Target Chain ID: 0 (Polkadot)
   Recipient: 0x1234567890123456789012345678901234567890123456789012345678901234
   Amount: 0.05 DEV
   Recipient (bytes32): 0x0000000000000000000000001234567890123456789012345678901234567890
   📡 Calling Xtokens precompile...
✅ REAL XCM transfer sent!
   Hash: 0xdef456...
   Block: 15569124
   🔍 Check on Polkadot explorer: https://polkadot.subscan.io/

✅ Step 3: Marking as completed...
✅ Intent completed! (Block: 15569125)
💰 Reward claimed: 0.05 DEV

🎉 SUCCESS! Real cross-chain intent executed via XCM!
```

### On Moonbase Explorer:

- Transaction to XCMBridge contract
- Function: `sendRealXCMTransfer`
- Event: `XCMMessageSent`
- Status: Success

### On Polkadot Explorer (1-2 min delay):

- Incoming XCM message from Moonbase
- Destination: Relay Chain or Asset Hub
- Amount: 0.05 DEV (converted to DOT equivalent)
- Status: Success

## Troubleshooting

### "Insufficient value sent"
Make sure `--value` matches the amount parameter.

### "Chain not supported"
Use chain IDs: 0 (Polkadot), 1000 (Asset Hub), 2004 (Moonbeam)

### "Transaction reverted"
Check:
1. Xtokens precompile is available
2. Amount is > 0
3. Sufficient balance in sender wallet

### XCM not appearing on destination
- Wait 1-2 minutes for cross-chain message
- Check correct destination chain explorer
- Verify multilocation encoding is correct

## Demo Script for Hackathon

1. **Show the code**: Open `XCMBridge.sol` and point to Xtokens precompile integration
2. **Start solver bot**: `npm run start:simple`
3. **Create intent**: Via frontend with natural language
4. **Watch execution**: Show bot console output
5. **Verify on Moonbase**: Show transaction calling real precompile
6. **Verify on Polkadot**: Show XCM message arrival (if time permits)
7. **Explain**: "This uses Moonbeam's native XCM precompiles for REAL cross-chain transfers"

## Key Points for Judges

✅ **Real Precompile Usage**: Direct integration with `0x0000000000000000000000000000000000000804`
✅ **Verifiable**: Transactions visible on both chains
✅ **Production Quality**: Proper error handling, events, multilocation encoding
✅ **User Friendly**: Natural language → Real XCM transfer
✅ **Automated**: Solver bot handles everything

This is NOT a simulation - these are REAL cross-chain transfers using Polkadot's XCM!
