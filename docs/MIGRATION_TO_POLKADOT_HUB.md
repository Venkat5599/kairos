# Migration from Moonbase Alpha to Polkadot Hub TestNet

## Overview

This document outlines the migration process from Moonbase Alpha to Polkadot Hub TestNet as required by the Polkadot Solidity Hackathon (Feb 15 - Mar 24, 2026).

## Network Comparison

| Parameter | Moonbase Alpha (OLD) | Polkadot Hub TestNet (NEW) |
|-----------|---------------------|---------------------------|
| RPC URL | https://rpc.api.moonbase.moonbeam.network | https://eth-rpc-testnet.polkadot.io/ |
| Chain ID | 1287 | 420420417 |
| Currency | DEV | PAS (Paseo) |
| Explorer | https://moonbase.moonscan.io | https://blockscout-testnet.polkadot.io/ |
| Faucet | https://faucet.moonbeam.network/ | https://faucet.polkadot.io/ |

## XCM Precompile Differences

### Moonbase Alpha (Moonbeam-specific)
- **Xtokens Precompile**: `0x0000000000000000000000000000000000000804`
- **XCM Transactor Precompile**: `0x0000000000000000000000000000000000000806`
- Uses Moonbeam's custom XCM interfaces

### Polkadot Hub TestNet (Native Polkadot)
- **XCM Precompile**: `0x00000000000000000000000000000000000a0000`
- Uses native Polkadot `pallet_xcm` interface
- More generic and flexible XCM functionality
- Requires SCALE-encoded XCM messages

## Migration Steps

### 1. Update Smart Contracts

The XCMBridge contract needs to be updated to use Polkadot Hub's native XCM precompile instead of Moonbeam's Xtokens precompile.

**Key Changes:**
- Replace Moonbeam precompile addresses with Polkadot Hub XCM precompile
- Update interface to use `IXcm` instead of `IXtokens` and `IXcmTransactor`
- Implement SCALE encoding for XCM messages
- Update multilocation building logic

### 2. Redeploy Contracts

```bash
cd packages/contracts

# Get PAS tokens from faucet
# Visit: https://faucet.polkadot.io/

# Update .env file with Polkadot Hub TestNet config
cp .env.moonbase .env.polkadot-hub

# Deploy to Polkadot Hub TestNet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://eth-rpc-testnet.polkadot.io/ \
  --broadcast \
  --verify
```

### 3. Update Frontend Configuration

Update `packages/frontend/.env.local`:

```env
# Polkadot Hub TestNet Configuration
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=<new_address>
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=<new_address>
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=<new_address>

NEXT_PUBLIC_RPC_URL=https://eth-rpc-testnet.polkadot.io/
NEXT_PUBLIC_CHAIN_ID=420420417
NEXT_PUBLIC_NETWORK_NAME=Polkadot Hub TestNet

NEXT_PUBLIC_EXPLORER_URL=https://blockscout-testnet.polkadot.io/
```

### 4. Update Solver Bot Configuration

Update `packages/solver-bot/.env`:

```env
# Network
RPC_URL=https://eth-rpc-testnet.polkadot.io/
CHAIN_ID=420420417

# Deployed Contracts
INTENT_REGISTRY_ADDRESS=<new_address>
INTENT_ROUTER_ADDRESS=<new_address>
XCM_BRIDGE_ADDRESS=<new_address>
```

### 5. Update Vercel Environment Variables

In Vercel dashboard, update all environment variables to use Polkadot Hub TestNet configuration.

### 6. Update Documentation

Update README.md and all documentation to reference Polkadot Hub TestNet instead of Moonbase Alpha.

## Testing Checklist

After migration, verify:

- [ ] Contracts deployed successfully to Polkadot Hub TestNet
- [ ] Frontend connects to correct network (Chain ID: 420420417)
- [ ] Can create intents on new network
- [ ] Solver bot can register and claim intents
- [ ] XCM transfers work with new precompile
- [ ] All contract addresses updated in frontend and solver bot
- [ ] Vercel deployment updated with new env vars
- [ ] Documentation updated with new network details

## Benefits of Polkadot Hub

1. **Native Polkadot Integration**: Direct access to Polkadot's native XCM functionality
2. **Hackathon Requirement**: Required network for Track 2: PVM Smart Contracts
3. **Better XCM Support**: More flexible and powerful XCM capabilities
4. **Production Path**: Polkadot Hub is the official smart contract platform for Polkadot

## Resources

- [Polkadot Hub Documentation](https://docs.polkadot.com/reference/polkadot-hub/)
- [XCM Precompile Guide](https://docs.polkadot.com/smart-contracts/precompiles/xcm/)
- [Network Connection Details](https://docs.polkadot.com/smart-contracts/connect/)
- [Polkadot Faucet](https://faucet.polkadot.io/)
- [Block Explorer](https://blockscout-testnet.polkadot.io/)

## Timeline

- **Current**: Deployed on Moonbase Alpha
- **Target**: Migrate to Polkadot Hub TestNet before hackathon submission (Mar 24, 2026)
- **Status**: Ready to migrate - contracts need XCM precompile update

## Next Steps

1. Update XCMBridge.sol to use Polkadot Hub's XCM precompile
2. Test locally with Polkadot Hub TestNet RPC
3. Deploy all contracts to Polkadot Hub TestNet
4. Update all configuration files
5. Redeploy frontend to Vercel
6. Test end-to-end functionality
7. Update all documentation
