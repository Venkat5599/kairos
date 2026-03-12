# Kairos Devnet Deployment Guide

Quick guide to deploy Kairos contracts to Moonbase Alpha testnet.

## Option 1: Moonbase Alpha (Recommended)

Moonbase Alpha is Moonbeam's testnet - a Polkadot parachain with full EVM compatibility.

### Why Moonbase Alpha?
- ✅ Full EVM compatibility (deploy Solidity contracts as-is)
- ✅ Connected to Polkadot ecosystem
- ✅ Free testnet tokens via faucet
- ✅ Block explorer (Moonscan)
- ✅ XCM support for cross-chain messaging
- ✅ Fast block times (~12 seconds)

### Quick Start

1. **Get a wallet and private key**
   ```bash
   # If you don't have one, create a new wallet
   cast wallet new
   # Save the private key securely!
   ```

2. **Get testnet tokens**
   - Visit: https://faucet.moonbeam.network/
   - Connect your wallet
   - Request DEV tokens (you'll get 1 DEV)
   - Wait ~30 seconds for tokens to arrive

3. **Configure deployment**
   ```bash
   cd packages/contracts
   
   # Edit .env.moonbase and add your private key
   nano .env.moonbase
   # Replace YOUR_PRIVATE_KEY_HERE with your actual key
   ```

4. **Deploy contracts**
   ```bash
   bash deploy-moonbase.sh
   ```

5. **Update frontend**
   - Copy the deployed contract addresses from the output
   - Update `packages/frontend/.env.local` with the addresses
   - Change RPC_URL to: https://rpc.api.moonbase.moonbeam.network
   - Change CHAIN_ID to: 1287

6. **Start frontend**
   ```bash
   cd packages/frontend
   npm run dev
   ```

7. **Test in browser**
   - Visit: http://localhost:3000
   - Add Moonbase Alpha network to MetaMask:
     - Network Name: Moonbase Alpha
     - RPC URL: https://rpc.api.moonbase.moonbeam.network
     - Chain ID: 1287
     - Currency: DEV
   - Connect wallet and test!

### Network Details

| Property | Value |
|----------|-------|
| Network Name | Moonbase Alpha |
| RPC URL | https://rpc.api.moonbase.moonbeam.network |
| Chain ID | 1287 |
| Currency | DEV |
| Block Explorer | https://moonbase.moonscan.io |
| Faucet | https://faucet.moonbeam.network/ |

### Verify Contracts

After deployment, verify on Moonscan:

```bash
forge verify-contract \
    --chain-id 1287 \
    --compiler-version v0.8.24 \
    YOUR_CONTRACT_ADDRESS \
    src/IntentRegistry.sol:IntentRegistry \
    --etherscan-api-key moonbase
```

---

## Option 2: Sepolia (Ethereum Testnet)

If you prefer Ethereum testnet:

### Setup

1. **Get Sepolia ETH**
   - Faucet: https://sepoliafaucet.com/
   - Or: https://www.alchemy.com/faucets/ethereum-sepolia

2. **Configure**
   ```bash
   # Create .env.sepolia
   DEPLOYER_PRIVATE_KEY=your_key_here
   RPC_URL=https://rpc.sepolia.org
   CHAIN_ID=11155111
   ```

3. **Deploy**
   ```bash
   forge script script/Deploy.s.sol \
       --rpc-url https://rpc.sepolia.org \
       --broadcast \
       --verify
   ```

### Network Details

| Property | Value |
|----------|-------|
| Network Name | Sepolia |
| RPC URL | https://rpc.sepolia.org |
| Chain ID | 11155111 |
| Currency | SepoliaETH |
| Block Explorer | https://sepolia.etherscan.io |

---

## Troubleshooting

### "Insufficient funds"
- Get more testnet tokens from the faucet
- Wait a few minutes for tokens to arrive
- Check your balance: `cast balance YOUR_ADDRESS --rpc-url RPC_URL`

### "Nonce too low"
- Reset your wallet account in MetaMask
- Settings > Advanced > Reset Account

### "Contract verification failed"
- Verify manually using the forge verify-contract command
- Make sure compiler version matches (0.8.24)
- Check that the contract address is correct

### "RPC connection timeout"
- Try alternative RPC endpoints
- Check network status
- Ensure you have internet connection

### "Transaction underpriced"
- Increase gas price in your wallet
- Wait for network congestion to clear

---

## Next Steps After Deployment

1. ✅ Verify contracts on block explorer
2. ✅ Test creating intents through UI
3. ✅ Register as a solver
4. ✅ Test intent fulfillment
5. ✅ Monitor transactions on explorer
6. ✅ Share your deployment with the team!

---

**Need help?** Check the full documentation in `MOONBASE_DEPLOYMENT.md`
