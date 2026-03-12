# Kairos - Deployed Contracts

## Moonbase Alpha Testnet

**Deployment Date:** March 10, 2026
**Network:** Moonbase Alpha
**Chain ID:** 1287

### Contract Addresses

| Contract | Address | Explorer |
|----------|---------|----------|
| **IntentRegistry** | `0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777` | [View on Moonscan](https://moonbase.moonscan.io/address/0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777) |
| **IntentRouter** | `0x607C43fa56df6fC436ed70e8e8860AeE07B74D25` | [View on Moonscan](https://moonbase.moonscan.io/address/0x607C43fa56df6fC436ed70e8e8860AeE07B74D25) |
| **XCMBridge** | `0xedDC0735AC932459Bc7FeAD80d24e985c85e2425` | [View on Moonscan](https://moonbase.moonscan.io/address/0xedDC0735AC932459Bc7FeAD80d24e985c85e2425) |
| **NameRegistry** | `PENDING DEPLOYMENT` | Deploy using instructions below |

### Deployer Account

**Address:** `0x9700e80cffFE423ACFE4D8206B3f88306D5410EF`

### Network Information

- **RPC URL:** https://rpc.api.moonbase.moonbeam.network
- **Chain ID:** 1287
- **Currency:** DEV
- **Block Explorer:** https://moonbase.moonscan.io

## Deploy NameRegistry Contract

The NameRegistry contract enables users to register human-readable names (like "Alice") linked to their wallet addresses.

### Prerequisites
1. Foundry installed (`forge` command available)
2. Private key with DEV tokens in `.env.moonbase`
3. Moonbase Alpha RPC access

### Deployment Steps

```bash
cd packages/contracts

# Option 1: Using the deployment script
bash deploy-nameregistry.sh

# Option 2: Manual deployment
forge script script/DeployNameRegistry.s.sol:DeployNameRegistry \
  --rpc-url https://rpc.api.moonbase.moonbeam.network \
  --broadcast \
  --legacy \
  -vvv
```

### After Deployment

1. Copy the deployed NameRegistry address
2. Update `packages/frontend/.env.local`:
   ```
   NEXT_PUBLIC_NAME_REGISTRY_ADDRESS=0x...
   ```
3. Update this file with the deployed address
4. Restart the frontend: `cd packages/frontend && npm run dev`

## Frontend Configuration Status

✅ **Fixed Critical Issues:**
- Updated complete ABIs with all contract functions
- Fixed hooks to use `bytes32` intent IDs instead of `uint256` indices
- Fixed chain ID from 1000 to 1287
- Updated all environment configurations

✅ **Ready to Use:**
- Frontend can now read from deployed IntentRegistry
- Can create new intents on Moonbase Alpha
- All contract interactions properly configured

⏳ **Pending:**
- Deploy NameRegistry contract
- Add NameRegistry address to frontend config
- Test name registration feature

## Quick Test Commands

### Check Contract Code
```bash
cast code 0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777 --rpc-url https://rpc.api.moonbase.moonbeam.network
```

### Get All Intent IDs
```bash
cast call 0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777 "getAllIntentIds()" --rpc-url https://rpc.api.moonbase.moonbeam.network
```

### Get Pending Intents Count
```bash
cast call 0x980f64d3B8e69Fc9672b3D6e3539171Df31Fe777 "getPendingIntentsCount()" --rpc-url https://rpc.api.moonbase.moonbeam.network
```

### Test NameRegistry (after deployment)
```bash
# Check if name is available
cast call <NAME_REGISTRY_ADDRESS> "isAvailable(string)" "Alice" --rpc-url https://rpc.api.moonbase.moonbeam.network

# Register a name
cast send <NAME_REGISTRY_ADDRESS> "registerName(string)" "Alice" \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url https://rpc.api.moonbase.moonbeam.network
```

## Next Steps

1. ✅ Contracts deployed successfully
2. ✅ Frontend fixed and configured
3. 🔄 Deploy NameRegistry contract
4. 🎨 Start the frontend: `cd packages/frontend && npm run dev`
5. 🧪 Test creating intents through the UI
6. 👤 Register your name and test name resolution
7. 🤖 Start solver bot (optional): `cd packages/solver-bot && npm run start:dev`

---

**All core contracts deployed and frontend ready! 🚀**
