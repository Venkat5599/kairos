# Deploying Kairos to Moonbase Alpha

Moonbase Alpha is the testnet for Moonbeam, providing full EVM compatibility on Polkadot.

## Prerequisites

### 1. Get a Wallet
- Use MetaMask or any Ethereum wallet
- Export your private key (keep it safe!)

### 2. Get Testnet Tokens
Visit the Moonbase Alpha faucet:
- **Faucet URL**: https://faucet.moonbeam.network/
- Connect your wallet
- Request DEV tokens (testnet currency)
- You'll need at least 0.1 DEV for deployment

### 3. Add Moonbase Alpha to MetaMask

**Network Details:**
- Network Name: Moonbase Alpha
- RPC URL: https://rpc.api.moonbase.moonbeam.network
- Chain ID: 1287
- Currency Symbol: DEV
- Block Explorer: https://moonbase.moonscan.io

## Deployment Steps

### 1. Configure Environment

Edit `packages/contracts/.env.moonbase`:

```bash
DEPLOYER_PRIVATE_KEY=your_private_key_here
```

⚠️ **Never commit your private key to git!**

### 2. Deploy Contracts

```bash
cd packages/contracts
bash deploy-moonbase.sh
```

The script will:
- Check your balance
- Deploy IntentRegistry, IntentRouter, and XCMBridge
- Show deployment addresses
- Attempt to verify contracts on Moonscan

### 3. Update Frontend Configuration

Copy the deployed addresses to `packages/frontend/.env.local`:

```env
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
NEXT_PUBLIC_CHAIN_ID=1287
```

### 4. Start Frontend

```bash
cd packages/frontend
npm run dev
```

Visit http://localhost:3000 and connect your wallet to Moonbase Alpha network.

## Verify Contracts Manually

If automatic verification fails:

```bash
forge verify-contract \
    --chain-id 1287 \
    --compiler-version v0.8.24 \
    --constructor-args $(cast abi-encode "constructor()") \
    CONTRACT_ADDRESS \
    src/IntentRegistry.sol:IntentRegistry \
    --etherscan-api-key moonbase
```

## Useful Commands

### Check Contract Code
```bash
cast code CONTRACT_ADDRESS --rpc-url https://rpc.api.moonbase.moonbeam.network
```

### Call Contract Function
```bash
cast call CONTRACT_ADDRESS "getPendingIntentsCount()" \
    --rpc-url https://rpc.api.moonbase.moonbeam.network
```

### Send Transaction
```bash
cast send CONTRACT_ADDRESS \
    "createIntent((string,bytes,uint256,uint256))" \
    "(\"Test Intent\",0x,100000000000000000,1735689600)" \
    --value 0.1ether \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --rpc-url https://rpc.api.moonbase.moonbeam.network
```

## Network Information

- **Network**: Moonbase Alpha
- **Type**: Polkadot Parachain Testnet
- **EVM Compatible**: Yes (full Ethereum compatibility)
- **Native Token**: DEV (testnet token)
- **Block Time**: ~12 seconds
- **Faucet**: https://faucet.moonbeam.network/
- **Explorer**: https://moonbase.moonscan.io
- **Documentation**: https://docs.moonbeam.network/

## Troubleshooting

### "Insufficient funds" error
- Get more DEV tokens from the faucet
- Wait a few minutes for tokens to arrive

### "Nonce too low" error
- Reset your MetaMask account (Settings > Advanced > Reset Account)

### Contract verification fails
- Verify manually using the command above
- Check that compiler version matches (0.8.24)

### RPC connection issues
- Try alternative RPC: https://moonbeam-alpha.api.onfinality.io/public
- Check network status: https://status.moonbeam.network/

## Next Steps

After deployment:
1. Test creating intents through the UI
2. Register as a solver
3. Test the full intent lifecycle
4. Monitor transactions on Moonscan

---

**Ready to deploy! 🚀**
