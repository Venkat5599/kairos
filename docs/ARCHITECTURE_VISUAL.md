# Kairos Architecture - Visual Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         KAIROS ECOSYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│    USER      │────────▶│   FRONTEND   │────────▶│  BLOCKCHAIN  │
│              │         │   (Next.js)  │         │  (Moonbase)  │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
                                │                         │
                                │                         │
                                ▼                         ▼
                         ┌──────────────┐         ┌──────────────┐
                         │              │         │              │
                         │   BACKEND    │         │ SOLVER BOTS  │
                         │  (NestJS)    │         │ (TypeScript) │
                         │              │         │              │
                         └──────────────┘         └──────────────┘
```

## Intent Flow

```
1. USER CREATES INTENT
   ┌─────────────────────────────────────────────────────┐
   │ "Bridge 1 DOT to Polkadot 0x123..."                 │
   └─────────────────────────────────────────────────────┘
                          │
                          ▼
2. FRONTEND SUBMITS TO BLOCKCHAIN
   ┌─────────────────────────────────────────────────────┐
   │ IntentRegistry.createIntent()                        │
   │ - Locks funds in escrow                              │
   │ - Sets reward                                        │
   │ - Emits IntentCreated event                          │
   └─────────────────────────────────────────────────────┘
                          │
                          ▼
3. SOLVER BOT DETECTS
   ┌─────────────────────────────────────────────────────┐
   │ - Polls getAllIntentIds()                            │
   │ - Finds pending intent                               │
   │ - Parses description                                 │
   │ - Validates feasibility                              │
   └─────────────────────────────────────────────────────┘
                          │
                          ▼
4. SOLVER CLAIMS INTENT
   ┌─────────────────────────────────────────────────────┐
   │ IntentRegistry.claimIntent(intentId)                 │
   │ - Status: Pending → Claimed                          │
   │ - Assigns solver                                     │
   │ - Starts execution                                   │
   └─────────────────────────────────────────────────────┘
                          │
                          ▼
5. SOLVER EXECUTES
   ┌─────────────────────────────────────────────────────┐
   │ XCMBridge.sendRealXCMTransfer()                      │
   │ - Calls Xtokens precompile                           │
   │ - Real XCM message sent                              │
   │ - Tokens move cross-chain                            │
   └─────────────────────────────────────────────────────┘
                          │
                          ▼
6. SOLVER COMPLETES
   ┌─────────────────────────────────────────────────────┐
   │ IntentRegistry.completeIntent(intentId, proof)       │
   │ - Status: Claimed → Completed                        │
   │ - Transfers reward to solver                         │
   │ - Updates statistics                                 │
   └─────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SMART CONTRACTS                             │
│                    (Moonbase Alpha)                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  IntentRegistry      │  Main contract for intent management
│  0xA7D5e4F7...       │
├──────────────────────┤
│ • createIntent()     │  User creates intent
│ • claimIntent()      │  Solver claims intent
│ • completeIntent()   │  Solver completes intent
│ • cancelIntent()     │  User cancels intent
│ • registerSolver()   │  Register as solver
│ • getAllIntentIds()  │  Get all intents
└──────────────────────┘
           │
           │ calls
           ▼
┌──────────────────────┐
│  IntentRouter        │  Routes intents to appropriate handlers
│  0x7E7d7D50...       │
├──────────────────────┤
│ • routeIntent()      │  Determine intent type
│ • validateIntent()   │  Validate parameters
│ • estimateFee()      │  Calculate fees
└──────────────────────┘
           │
           │ calls
           ▼
┌──────────────────────┐
│  XCMBridge           │  Handles cross-chain execution
│  0xe84F4ad4...       │
├──────────────────────┤
│ • sendRealXCMTransfer()    │  Transfer via Xtokens
│ • stakeOnPolkadot()        │  Remote staking
│ • voteOnPolkadot()         │  Remote voting
│ • sendXCMMessage()         │  Legacy XCM
└──────────────────────┘
           │
           │ calls
           ▼
┌──────────────────────────────────────────────────────────┐
│              MOONBEAM PRECOMPILES                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────┐      ┌─────────────────────┐   │
│  │  Xtokens            │      │  XCM Transactor     │   │
│  │  0x0000...0804      │      │  0x0000...0806      │   │
│  ├─────────────────────┤      ├─────────────────────┤   │
│  │ • transfer()        │      │ • transactThrough   │   │
│  │ • transferWithFee() │      │   Signed()          │   │
│  └─────────────────────┘      └─────────────────────┘   │
│                                                           │
└──────────────────────────────────────────────────────────┘
           │                              │
           │                              │
           ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│  Polkadot Relay      │      │  Polkadot Relay      │
│  Chain               │      │  Chain               │
├──────────────────────┤      ├──────────────────────┤
│ • Receive tokens     │      │ • Execute staking    │
│ • Update balances    │      │ • Execute governance │
└──────────────────────┘      └──────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                │
└─────────────────────────────────────────────────────────────────┘

USER INPUT
    │
    │ "Bridge 1 DOT to Polkadot 0x123..."
    ▼
FRONTEND PARSING
    │
    │ { type: "cross-chain", amount: 1, chain: "polkadot", ... }
    ▼
BLOCKCHAIN SUBMISSION
    │
    │ createIntent(description, reward)
    ▼
EVENT EMISSION
    │
    │ IntentCreated(intentId, creator, description, reward)
    ▼
SOLVER DETECTION
    │
    │ getAllIntentIds() → [intentId1, intentId2, ...]
    ▼
INTENT PARSING
    │
    │ parseIntent(description) → { recipient, amount, chain }
    ▼
EXECUTION
    │
    │ sendRealXCMTransfer(chain, recipient, amount)
    ▼
PRECOMPILE CALL
    │
    │ XTOKENS.transfer(address(0), amount, multilocation, weight)
    ▼
XCM MESSAGE
    │
    │ XCM instruction sent to relay chain
    ▼
DESTINATION CHAIN
    │
    │ Tokens arrive on Polkadot
    ▼
COMPLETION
    │
    │ completeIntent(intentId, proof)
    ▼
REWARD DISTRIBUTION
    │
    │ transfer(solver, reward)
    ▼
DONE ✅
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
└─────────────────────────────────────────────────────────────────┘

LAYER 1: ACCESS CONTROL
┌──────────────────────────────────────────────────────────────┐
│ • Ownable pattern for admin functions                        │
│ • Role-based access (solvers must register)                  │
│ • Intent ownership (only creator can cancel)                 │
│ • Solver assignment (only assigned solver can complete)      │
└──────────────────────────────────────────────────────────────┘

LAYER 2: REENTRANCY PROTECTION
┌──────────────────────────────────────────────────────────────┐
│ • ReentrancyGuard on all state-changing functions            │
│ • Checks-Effects-Interactions pattern                        │
│ • State updates before external calls                        │
└──────────────────────────────────────────────────────────────┘

LAYER 3: FUND SECURITY
┌──────────────────────────────────────────────────────────────┐
│ • Escrow pattern (funds locked until completion)             │
│ • Solver stake requirements (0.1 DEV minimum)                │
│ • Refund mechanisms on failure                               │
└──────────────────────────────────────────────────────────────┘

LAYER 4: INPUT VALIDATION
┌──────────────────────────────────────────────────────────────┐
│ • Amount > 0 checks                                           │
│ • Supported chain validation                                 │
│ • Value mismatch prevention                                  │
│ • Empty description rejection                                │
└──────────────────────────────────────────────────────────────┘

LAYER 5: XCM SECURITY
┌──────────────────────────────────────────────────────────────┐
│ • Try-catch for precompile calls                             │
│ • Proper multilocation encoding                              │
│ • Weight limits                                              │
│ • Refund on precompile failure                               │
└──────────────────────────────────────────────────────────────┘
```

## Solver Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SOLVER NETWORK                              │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │  IntentRegistry  │
                    │   (Blockchain)   │
                    └──────────────────┘
                            │
                            │ Events
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Solver 1    │    │  Solver 2    │    │  Solver 3    │
│  (Bot)       │    │  (Bot)       │    │  (Bot)       │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ Stake: 1 DEV │    │ Stake: 2 DEV │    │ Stake: 5 DEV │
│ Completed: 5 │    │ Completed: 12│    │ Completed: 30│
│ Failed: 0    │    │ Failed: 1    │    │ Failed: 2    │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            │ Compete for intents
                            │
                    ┌──────────────────┐
                    │  First to claim  │
                    │  wins the intent │
                    └──────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                            │
└─────────────────────────────────────────────────────────────────┘

FRONTEND
┌──────────────────────────────────────────────────────────────┐
│ • Next.js 14 (React framework)                               │
│ • TypeScript (Type safety)                                   │
│ • Ethers.js v6 (Blockchain interaction)                      │
│ • TailwindCSS (Styling)                                      │
│ • Wagmi (Wallet connection)                                  │
└──────────────────────────────────────────────────────────────┘

BACKEND
┌──────────────────────────────────────────────────────────────┐
│ • NestJS (Node.js framework)                                 │
│ • Prisma (Database ORM)                                      │
│ • PostgreSQL (Database)                                      │
│ • TypeScript (Type safety)                                   │
└──────────────────────────────────────────────────────────────┘

SMART CONTRACTS
┌──────────────────────────────────────────────────────────────┐
│ • Solidity 0.8.24 (Smart contract language)                  │
│ • OpenZeppelin (Security libraries)                          │
│ • Foundry (Testing framework)                                │
│ • Moonbeam Precompiles (XCM integration)                     │
└──────────────────────────────────────────────────────────────┘

SOLVER BOT
┌──────────────────────────────────────────────────────────────┐
│ • TypeScript (Bot logic)                                     │
│ • Ethers.js v6 (Blockchain interaction)                      │
│ • Node.js (Runtime)                                          │
└──────────────────────────────────────────────────────────────┘

INFRASTRUCTURE
┌──────────────────────────────────────────────────────────────┐
│ • Moonbase Alpha (Testnet)                                   │
│ • Polkadot Relay Chain (Destination)                         │
│ • IPFS (Future: Proof storage)                               │
│ • The Graph (Future: Indexing)                               │
└──────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

TESTNET (Current)
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐      │
│  │  Frontend  │     │  Backend   │     │ Solver Bot │      │
│  │ (Vercel)   │     │ (Railway)  │     │ (Local)    │      │
│  └────────────┘     └────────────┘     └────────────┘      │
│         │                  │                   │             │
│         └──────────────────┼───────────────────┘             │
│                            │                                 │
│                            ▼                                 │
│                  ┌────────────────────┐                      │
│                  │  Moonbase Alpha    │                      │
│                  │  (Testnet)         │                      │
│                  └────────────────────┘                      │
│                            │                                 │
│                            ▼                                 │
│                  ┌────────────────────┐                      │
│                  │  Polkadot Relay    │                      │
│                  │  (Testnet)         │                      │
│                  └────────────────────┘                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘

MAINNET (Future)
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐      │
│  │  Frontend  │     │  Backend   │     │ Solver Bot │      │
│  │ (CDN)      │     │ (AWS)      │     │ (AWS)      │      │
│  └────────────┘     └────────────┘     └────────────┘      │
│         │                  │                   │             │
│         └──────────────────┼───────────────────┘             │
│                            │                                 │
│                            ▼                                 │
│                  ┌────────────────────┐                      │
│                  │  Moonbeam          │                      │
│                  │  (Mainnet)         │                      │
│                  └────────────────────┘                      │
│                            │                                 │
│                            ▼                                 │
│                  ┌────────────────────┐                      │
│                  │  Polkadot Relay    │                      │
│                  │  (Mainnet)         │                      │
│                  └────────────────────┘                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Performance Metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                     PERFORMANCE METRICS                          │
└─────────────────────────────────────────────────────────────────┘

TRANSACTION TIMES
┌──────────────────────────────────────────────────────────────┐
│ Create Intent:     2 seconds                                 │
│ Claim Intent:      2 seconds                                 │
│ Execute Transfer:  10-15 seconds (XCM)                       │
│ Complete Intent:   2 seconds                                 │
│ Total:             16-21 seconds                             │
└──────────────────────────────────────────────────────────────┘

GAS COSTS
┌──────────────────────────────────────────────────────────────┐
│ Create Intent:     145,000 gas (~$0.0045)                    │
│ Claim Intent:      98,000 gas (~$0.0031)                     │
│ Complete Intent:   87,000 gas (~$0.0027)                     │
│ XCM Transfer:      256,000 gas (~$0.0080)                    │
│ Total:             ~$0.018 per intent                        │
└──────────────────────────────────────────────────────────────┘

THROUGHPUT
┌──────────────────────────────────────────────────────────────┐
│ Intents per block:     ~10 (limited by gas)                  │
│ Intents per minute:    ~50 (12s block time)                  │
│ Intents per hour:      ~3,000                                │
│ Intents per day:       ~72,000                               │
└──────────────────────────────────────────────────────────────┘
```

---

**End of Visual Architecture Guide**
