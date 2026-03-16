# 📚 Kairos Documentation

Welcome to the Kairos documentation! This folder contains all technical documentation, guides, and reference materials.

## 🚀 Quick Start

**New to Kairos?** Start here:
1. Read [QUICK_START.md](./QUICK_START.md) - Get up and running in 10 minutes
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the system design
3. Follow [DEPLOYMENT_HACKATHON.md](./DEPLOYMENT_HACKATHON.md) - Deploy for hackathon

## 📋 Documentation Index

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide for developers
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design

### Deployment & Migration
- **[DEPLOYMENT_HACKATHON.md](./DEPLOYMENT_HACKATHON.md)** - Hackathon deployment guide
- **[MIGRATION_TO_POLKADOT_HUB.md](./MIGRATION_TO_POLKADOT_HUB.md)** - Migration from Moonbase to Polkadot Hub
- **[MIGRATION_STATUS.md](./MIGRATION_STATUS.md)** - Current migration status
- **[NETWORK_COMPARISON.md](./NETWORK_COMPARISON.md)** - Network comparison table

### Root Directory Guides
These important guides are in the root directory for easy access:

- **[../DEPLOY_POLKADOT_HUB.md](../DEPLOY_POLKADOT_HUB.md)** ⭐ Main deployment guide
- **[../QUICK_MIGRATION_CHECKLIST.md](../QUICK_MIGRATION_CHECKLIST.md)** ⭐ Quick reference
- **[../HACKATHON_READY.md](../HACKATHON_READY.md)** - Hackathon submission checklist
- **[../SUMMARY_FOR_USER.md](../SUMMARY_FOR_USER.md)** - Complete summary
- **[../MIGRATION_VISUAL_GUIDE.md](../MIGRATION_VISUAL_GUIDE.md)** - Visual guide
- **[../SECURITY_AUDIT.md](../SECURITY_AUDIT.md)** - Security audit report
- **[../README.md](../README.md)** - Main project README

## 🎯 Documentation by Use Case

### I want to deploy Kairos for the hackathon
1. Read: [../SUMMARY_FOR_USER.md](../SUMMARY_FOR_USER.md)
2. Follow: [../QUICK_MIGRATION_CHECKLIST.md](../QUICK_MIGRATION_CHECKLIST.md)
3. Reference: [../DEPLOY_POLKADOT_HUB.md](../DEPLOY_POLKADOT_HUB.md)

### I want to understand the architecture
1. Read: [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Review: [../README.md](../README.md)
3. Check: [../SECURITY_AUDIT.md](../SECURITY_AUDIT.md)

### I want to understand the migration
1. Read: [MIGRATION_TO_POLKADOT_HUB.md](./MIGRATION_TO_POLKADOT_HUB.md)
2. Compare: [NETWORK_COMPARISON.md](./NETWORK_COMPARISON.md)
3. Check: [MIGRATION_STATUS.md](./MIGRATION_STATUS.md)

### I want to deploy quickly
1. Follow: [../QUICK_MIGRATION_CHECKLIST.md](../QUICK_MIGRATION_CHECKLIST.md)
2. Reference: [../MIGRATION_VISUAL_GUIDE.md](../MIGRATION_VISUAL_GUIDE.md)

### I want to prepare for hackathon submission
1. Read: [../HACKATHON_READY.md](../HACKATHON_READY.md)
2. Review: [DEPLOYMENT_HACKATHON.md](./DEPLOYMENT_HACKATHON.md)

## 📁 File Organization

```
kairos/
├── README.md                           # Main project README
├── DEPLOY_POLKADOT_HUB.md             # ⭐ Main deployment guide
├── QUICK_MIGRATION_CHECKLIST.md       # ⭐ Quick reference
├── HACKATHON_READY.md                 # Hackathon checklist
├── SUMMARY_FOR_USER.md                # Complete summary
├── MIGRATION_VISUAL_GUIDE.md          # Visual guide
├── SECURITY_AUDIT.md                  # Security audit
│
├── docs/                              # Documentation folder
│   ├── README.md                      # This file
│   ├── QUICK_START.md                 # Quick start guide
│   ├── ARCHITECTURE.md                # Architecture docs
│   ├── DEPLOYMENT_HACKATHON.md        # Hackathon deployment
│   ├── MIGRATION_TO_POLKADOT_HUB.md  # Migration details
│   ├── MIGRATION_STATUS.md            # Migration status
│   └── NETWORK_COMPARISON.md          # Network comparison
│
├── packages/
│   ├── contracts/                     # Smart contracts
│   │   ├── src/
│   │   │   ├── IntentRegistry.sol
│   │   │   ├── IntentRouter.sol
│   │   │   ├── XCMBridge.sol
│   │   │   └── XCMBridgePolkadotHub.sol  # New!
│   │   ├── script/
│   │   │   └── DeployPolkadotHub.s.sol   # New!
│   │   └── .env.polkadot-hub             # New!
│   │
│   ├── frontend/                      # Next.js frontend
│   │   └── .env.local                 # Update this
│   │
│   └── solver-bot/                    # Solver bot
│       ├── .env                       # Update this
│       └── README_DEPLOYMENT.md       # Bot deployment guide
```

## 🎓 Key Concepts

### Intent-Based Execution
Users express what they want (intent), not how to do it. Solvers compete to execute intents efficiently.

### XCM (Cross-Consensus Messaging)
Polkadot's native cross-chain messaging protocol. Kairos makes XCM accessible through natural language.

### Decentralized Solver Network
Anyone can become a solver by staking tokens. Solvers earn rewards for executing intents.

### Native Polkadot Integration
Uses Polkadot Hub's native XCM precompile (0x...0a0000) for real cross-chain functionality.

## 🔗 External Resources

### Polkadot Documentation
- [Polkadot Hub](https://docs.polkadot.com/reference/polkadot-hub/)
- [XCM Precompile](https://docs.polkadot.com/smart-contracts/precompiles/xcm/)
- [Smart Contracts](https://docs.polkadot.com/smart-contracts/connect/)

### Hackathon Resources
- [Hackathon Info](https://openguild.wtf/hackathon)
- [Codecamp](https://codecamp.openguild.wtf)
- [Builders Hub](https://build.openguild.wtf/hackathon-resources)

### Network Resources
- [Faucet](https://faucet.polkadot.io/)
- [Explorer](https://blockscout-testnet.polkadot.io/)
- [Developer Support](https://t.me/substratedevs)

## 🆘 Getting Help

### Documentation Issues
If you find any issues with the documentation:
1. Check if there's a more recent version
2. Review related documentation files
3. Check the main README.md

### Technical Issues
For technical issues:
1. Check [../DEPLOY_POLKADOT_HUB.md](../DEPLOY_POLKADOT_HUB.md) troubleshooting section
2. Review [NETWORK_COMPARISON.md](./NETWORK_COMPARISON.md)
3. Contact Polkadot Developer Support: https://t.me/substratedevs

### Hackathon Support
For hackathon-related questions:
- **Telegram**: @Zoey1412
- **Email**: zoey@openguild.wtf
- **Discord**: https://discord.com/invite/WWgzkDfPQF

## 📊 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| QUICK_START.md | ✅ Complete | Current |
| ARCHITECTURE.md | ✅ Complete | Current |
| DEPLOYMENT_HACKATHON.md | ✅ Complete | Current |
| MIGRATION_TO_POLKADOT_HUB.md | ✅ Complete | Current |
| MIGRATION_STATUS.md | ✅ Complete | Current |
| NETWORK_COMPARISON.md | ✅ Complete | Current |

## 🎯 Next Steps

1. **For Hackathon**: Follow [../QUICK_MIGRATION_CHECKLIST.md](../QUICK_MIGRATION_CHECKLIST.md)
2. **For Learning**: Read [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **For Deployment**: Follow [../DEPLOY_POLKADOT_HUB.md](../DEPLOY_POLKADOT_HUB.md)

---

**Need help?** Start with [../SUMMARY_FOR_USER.md](../SUMMARY_FOR_USER.md) for a complete overview!
