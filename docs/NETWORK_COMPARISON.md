# Network Comparison: Moonbase Alpha vs Polkadot Hub TestNet

## Quick Reference Table

| Feature | Moonbase Alpha | Polkadot Hub TestNet |
|---------|---------------|---------------------|
| **Status** | ❌ Old Network | ✅ Required for Hackathon |
| **Network Type** | Moonbeam Testnet | Polkadot Hub Testnet |
| **Chain ID** | 1287 | 420420417 |
| **Native Currency** | DEV | PAS (Paseo) |
| **Decimals** | 18 | 18 |

## RPC Endpoints

| Network | Primary RPC | Alternative RPC |
|---------|------------|----------------|
| **Moonbase Alpha** | https://rpc.api.moonbase.moonbeam.network | - |
| **Polkadot Hub** | https://eth-rpc-testnet.polkadot.io/ | https://services.polkadothub-rpc.com/testnet/ |

## Block Explorers

| Network | Primary Explorer | Alternative Explorer |
|---------|-----------------|---------------------|
| **Moonbase Alpha** | https://moonbase.moonscan.io | - |
| **Polkadot Hub** | https://blockscout-testnet.polkadot.io/ | https://polkadot.testnet.routescan.io/ |

## Faucets

| Network | Faucet URL | Token |
|---------|-----------|-------|
| **Moonbase Alpha** | https://faucet.moonbeam.network/ | DEV |
| **Polkadot Hub** | https://faucet.polkadot.io/ | PAS |

## XCM Precompiles

| Network | Precompile Type | Address | Interface |
|---------|----------------|---------|-----------|
| **Moonbase Alpha** | Xtokens | 0x0000000000000000000000000000000000000804 | IXtokens |
| **Moonbase Alpha** | XCM Transactor | 0x0000000000000000000000000000000000000806 | IXcmTransactor |
| **Polkadot Hub** | Native XCM | 0x00000000000000000000000000000000000a0000 | IXcm |

## XCM Functionality Comparison

### Moonbase Alpha (Moonbeam-specific)

```solidity
// Xtokens precompile
interface IXtokens {
    function transfer(
        address currencyAddress,
        uint256 amount,
        bytes memory destination,
        uint64 weight
    ) external;
}

// Usage
XTOKENS.transfer(
    address(0),      // Native token
    amount,
    destination,     // Multilocation
    4_000_000_000    // Weight
);
```

**Pros:**
- Simple interface
- Easy to use
- Good for basic transfers

**Cons:**
- Moonbeam-specific
- Limited flexibility
- Not native Polkadot

### Polkadot Hub (Native Polkadot)

```solidity
// Native XCM precompile
interface IXcm {
    struct Weight {
        uint64 refTime;
        uint64 proofSize;
    }
    
    function execute(
        bytes calldata message,
        Weight calldata weight
    ) external;
    
    function weighMessage(
        bytes calldata message
    ) external view returns (Weight memory);
}

// Usage
bytes memory xcmMessage = buildXCMMessage(...);
Weight memory weight = XCM_PRECOMPILE.weighMessage(xcmMessage);
XCM_PRECOMPILE.execute(xcmMessage, weight);
```

**Pros:**
- Native Polkadot integration
- Full XCM flexibility
- Production-ready
- Required for hackathon

**Cons:**
- More complex (requires SCALE encoding)
- Need to build XCM messages manually

## Contract Deployment Comparison

### Moonbase Alpha

```bash
# Deploy
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://rpc.api.moonbase.moonbeam.network \
  --broadcast

# Verify
cast code <ADDRESS> --rpc-url https://rpc.api.moonbase.moonbeam.network
```

### Polkadot Hub

```bash
# Deploy
forge script script/DeployPolkadotHub.s.sol:DeployPolkadotHub \
  --rpc-url https://eth-rpc-testnet.polkadot.io/ \
  --broadcast \
  --legacy

# Verify
cast code <ADDRESS> --rpc-url https://eth-rpc-testnet.polkadot.io/
```

## Frontend Configuration Comparison

### Moonbase Alpha

```env
NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
NEXT_PUBLIC_CHAIN_ID=1287
NEXT_PUBLIC_NETWORK_NAME=Moonbase Alpha
NEXT_PUBLIC_EXPLORER_URL=https://moonbase.moonscan.io
```

### Polkadot Hub

```env
NEXT_PUBLIC_RPC_URL=https://eth-rpc-testnet.polkadot.io/
NEXT_PUBLIC_CHAIN_ID=420420417
NEXT_PUBLIC_NETWORK_NAME=Polkadot Hub TestNet
NEXT_PUBLIC_EXPLORER_URL=https://blockscout-testnet.polkadot.io/
```

## MetaMask Configuration

### Moonbase Alpha

```
Network Name: Moonbase Alpha
RPC URL: https://rpc.api.moonbase.moonbeam.network
Chain ID: 1287
Currency Symbol: DEV
Block Explorer: https://moonbase.moonscan.io
```

### Polkadot Hub TestNet

```
Network Name: Polkadot Hub TestNet
RPC URL: https://eth-rpc-testnet.polkadot.io/
Chain ID: 420420417
Currency Symbol: PAS
Block Explorer: https://blockscout-testnet.polkadot.io/
```

## Ecosystem Integration

| Feature | Moonbase Alpha | Polkadot Hub |
|---------|---------------|--------------|
| **Part of Polkadot** | Parachain (Moonbeam) | System Parachain |
| **XCM Support** | Via Moonbeam precompiles | Native pallet_xcm |
| **Asset Hub Access** | Yes (via XCM) | Yes (native) |
| **Relay Chain Access** | Yes (via XCM) | Yes (native) |
| **Other Parachains** | Yes (via XCM) | Yes (native) |
| **Governance** | Moonbeam governance | Polkadot governance |
| **Staking** | Via XCM Transactor | Via XCM execute |

## Development Experience

| Aspect | Moonbase Alpha | Polkadot Hub |
|--------|---------------|--------------|
| **Documentation** | Moonbeam docs | Polkadot docs |
| **Learning Curve** | Lower (simpler) | Higher (more powerful) |
| **Flexibility** | Limited | Full XCM control |
| **Production Path** | Moonbeam mainnet | Polkadot Hub mainnet |
| **Community** | Moonbeam community | Polkadot community |
| **Hackathon** | ❌ Not accepted | ✅ Required |

## Migration Effort

| Task | Effort | Time |
|------|--------|------|
| Update XCM contract | Medium | 1 hour (done) |
| Deploy contracts | Low | 5 minutes |
| Update frontend config | Low | 2 minutes |
| Update solver bot config | Low | 2 minutes |
| Update Vercel | Low | 3 minutes |
| Testing | Medium | 10 minutes |
| Documentation | Low | 5 minutes |
| **Total** | **Medium** | **~30 minutes** |

## Cost Comparison

| Operation | Moonbase Alpha (DEV) | Polkadot Hub (PAS) |
|-----------|---------------------|-------------------|
| **Contract Deploy** | ~0.01 DEV | ~0.01 PAS |
| **Intent Creation** | ~0.001 DEV | ~0.001 PAS |
| **XCM Transfer** | ~0.01 DEV | ~0.01 PAS |
| **Solver Registration** | ~0.001 DEV | ~0.001 PAS |
| **Faucet Amount** | 1 DEV | 10 PAS |

## Performance Comparison

| Metric | Moonbase Alpha | Polkadot Hub |
|--------|---------------|--------------|
| **Block Time** | ~12 seconds | ~12 seconds |
| **Finality** | ~12 seconds | ~12 seconds |
| **Gas Price** | Variable | Variable |
| **RPC Latency** | ~200ms | ~200ms |
| **XCM Speed** | ~30 seconds | ~30 seconds |

## Hackathon Alignment

| Criteria | Moonbase Alpha | Polkadot Hub |
|----------|---------------|--------------|
| **Track 2: PVM Smart Contracts** | ❌ Not eligible | ✅ Required |
| **"Accessing Polkadot native functionality"** | ⚠️ Via Moonbeam | ✅ Native |
| **"Build with precompiles"** | ✅ Yes | ✅ Yes (native) |
| **Submission Requirement** | ❌ Wrong network | ✅ Correct network |
| **Judging Criteria** | ❌ Disqualified | ✅ Eligible |

## Recommendation

### For Hackathon Submission: Use Polkadot Hub TestNet ✅

**Reasons:**
1. Required by hackathon rules
2. Native Polkadot integration
3. Better alignment with Track 2 criteria
4. Shows understanding of Polkadot architecture
5. Production-ready path

### Migration Priority: HIGH 🔴

**Timeline:**
- Hackathon ends: March 24, 2026
- Current date: March 15, 2026
- Time remaining: 9 days
- Migration time: 30 minutes
- **Action: Migrate immediately**

## Resources

### Moonbase Alpha
- Docs: https://docs.moonbeam.network/
- Faucet: https://faucet.moonbeam.network/
- Explorer: https://moonbase.moonscan.io

### Polkadot Hub TestNet
- Docs: https://docs.polkadot.com/reference/polkadot-hub/
- XCM Precompile: https://docs.polkadot.com/smart-contracts/precompiles/xcm/
- Faucet: https://faucet.polkadot.io/
- Explorer: https://blockscout-testnet.polkadot.io/

## Next Steps

1. Read: [DEPLOY_POLKADOT_HUB.md](./DEPLOY_POLKADOT_HUB.md)
2. Follow: [QUICK_MIGRATION_CHECKLIST.md](./QUICK_MIGRATION_CHECKLIST.md)
3. Check: [MIGRATION_STATUS.md](./MIGRATION_STATUS.md)
4. Deploy: Get PAS tokens and start migration!

---

**Conclusion**: Polkadot Hub TestNet is the correct network for the hackathon. Migration is straightforward and takes ~30 minutes. All preparation is complete. Ready to deploy!
