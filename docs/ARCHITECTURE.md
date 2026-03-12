# IntentFlow Architecture

## Overview

IntentFlow is a cross-chain intent execution layer built on Polkadot Hub (EVM compatible). The protocol abstracts blockchain complexity by allowing users to express high-level intents that are automatically executed by a decentralized solver network.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Layer                              │
│                    (Next.js Frontend)                           │
│  - Intent submission                                            │
│  - Wallet integration (RainbowKit)                              │
│  - Status tracking                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Smart Contract Layer                         │
│              (Solidity on Polkadot Hub EVM)                     │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ IntentRegistry   │  │  IntentRouter    │  │  XCMBridge   │ │
│  │                  │  │                  │  │              │ │
│  │ - Store intents  │  │ - Route calc     │  │ - XCM msgs   │ │
│  │ - Manage status  │  │ - Path finding   │  │ - Cross-chain│ │
│  │ - Solver rewards │  │ - Gas estimates  │  │ - Delivery   │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │ Events
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Event Indexer                              │
│                    (Subsquid + PostgreSQL)                      │
│                                                                 │
│  - Index blockchain events                                      │
│  - Provide GraphQL API                                          │
│  - Historical data queries                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API                                │
│                  (NestJS + Prisma ORM)                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Intent API   │  │ Solver API   │  │ Analytics API        │ │
│  │              │  │              │  │                      │ │
│  │ - CRUD ops   │  │ - Leaderboard│  │ - System stats       │ │
│  │ - Filtering  │  │ - Stats      │  │ - Volume tracking    │ │
│  │ - Validation │  │ - Reputation │  │ - Performance metrics│ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Solver Bot Network                           │
│                  (TypeScript Workers)                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Intent       │  │ Route        │  │ Executors            │ │
│  │ Listener     │  │ Calculator   │  │                      │ │
│  │              │  │              │  │ - Direct             │ │
│  │ - Event mon  │  │ - Path find  │  │ - Swap               │ │
│  │ - Polling    │  │ - Gas est    │  │ - Cross-chain (XCM)  │ │
│  │ - Filtering  │  │ - Cost calc  │  │ - Complex            │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Smart Contracts

**IntentRegistry**
- Core contract managing intent lifecycle
- Stores intent data (description, reward, deadline, status)
- Manages solver registration and staking
- Handles reward distribution
- Implements slashing for failures

**IntentRouter**
- Determines optimal execution routes
- Calculates gas estimates
- Provides route recommendations
- Supports multiple route types (Direct, Swap, CrossChain, Complex)

**XCMBridge**
- Handles cross-chain message passing
- Integrates with Polkadot XCM protocol
- Manages message delivery confirmation
- Tracks cross-chain transaction status

### 2. Backend API

**Technology Stack**
- NestJS framework
- Prisma ORM
- PostgreSQL database
- Swagger documentation

**Modules**
- Intents: CRUD operations, filtering, status updates
- Solvers: Registration, stats, leaderboard
- Analytics: System metrics, volume tracking, performance

### 3. Frontend

**Technology Stack**
- Next.js 14 (App Router)
- TailwindCSS
- Wagmi + RainbowKit
- React Query

**Features**
- Wallet connection
- Intent creation form
- Real-time status tracking
- Solver leaderboard
- Analytics dashboard

### 4. Solver Bot

**Components**
- Intent Listener: Monitors blockchain events
- Route Calculator: Determines optimal execution paths
- XCM Executor: Handles cross-chain operations
- Contract Interaction: Manages on-chain transactions

**Execution Flow**
1. Listen for IntentCreated events
2. Filter by minimum reward threshold
3. Calculate optimal route
4. Claim intent for execution
5. Execute based on route type
6. Mark as completed or failed
7. Claim reward

### 5. Event Indexer

**Technology Stack**
- Subsquid framework
- PostgreSQL storage
- GraphQL API

**Indexed Events**
- IntentCreated
- IntentExecuting
- IntentCompleted
- IntentFailed
- SolverRegistered
- RewardClaimed

## Data Flow

### Intent Creation Flow

```
User → Frontend → Wallet Sign → Smart Contract → Event Emitted
                                       ↓
                                  Backend API
                                       ↓
                                   Database
```

### Intent Execution Flow

```
Event Emitted → Indexer → Database
                    ↓
              Solver Bot (polling)
                    ↓
         Route Calculation
                    ↓
         Claim Intent (on-chain)
                    ↓
              Execute Intent
                    ↓
         Complete/Fail (on-chain)
                    ↓
            Claim Reward
```

## Security Considerations

1. **Solver Staking**: Minimum 1 DOT stake required
2. **Slashing**: 0.1 DOT penalty for failed executions
3. **Deadline Enforcement**: Intents expire after deadline
4. **Reputation System**: Track solver performance
5. **Gas Limits**: Prevent excessive gas consumption
6. **Input Validation**: All user inputs validated

## Scalability

- **Horizontal Scaling**: Multiple solver bots can run in parallel
- **Database Indexing**: Optimized queries with proper indexes
- **Event-Driven**: Asynchronous processing via events
- **Caching**: Redis for solver coordination (future)
- **Load Balancing**: Multiple backend instances (future)

## Future Enhancements

1. **AI-Powered Intent Parsing**: Natural language understanding
2. **Multi-Chain Support**: Expand beyond Polkadot ecosystem
3. **Intent Batching**: Execute multiple intents atomically
4. **Privacy Layer**: Zero-knowledge intent execution
5. **MEV Protection**: Prevent front-running
6. **Governance**: Decentralized protocol upgrades

## Technology Choices

**Why Polkadot Hub?**
- Native XCM support for cross-chain operations
- EVM compatibility for Solidity contracts
- Strong ecosystem and tooling
- Low transaction costs

**Why Subsquid?**
- High-performance indexing
- GraphQL API out of the box
- PostgreSQL storage
- Active development and support

**Why NestJS?**
- Enterprise-grade architecture
- TypeScript support
- Modular design
- Extensive ecosystem

**Why Next.js?**
- Server-side rendering
- Excellent developer experience
- Built-in optimization
- Large community

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Setup                        │
│                                                             │
│  Frontend (Vercel) ←→ Backend (AWS/GCP) ←→ PostgreSQL     │
│                              ↓                              │
│                       Solver Bots (VPS)                     │
│                              ↓                              │
│                    Polkadot Hub (RPC)                       │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

- **Logs**: Winston logger with file rotation
- **Metrics**: Solver performance, execution times
- **Alerts**: Failed executions, low balances
- **Dashboard**: Grafana for visualization (future)

## License

MIT
