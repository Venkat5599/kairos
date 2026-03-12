# IntentFlow Indexer

Subsquid-based event indexer for IntentFlow protocol.

## Features

- Real-time event indexing from Polkadot Hub
- GraphQL API for querying indexed data
- PostgreSQL storage
- Automatic schema generation

## Events Indexed

- `IntentCreated` - New intent created
- `IntentExecuting` - Intent claimed by solver
- `IntentCompleted` - Intent successfully executed
- `IntentFailed` - Intent execution failed
- `SolverRegistered` - New solver registered
- `RewardClaimed` - Solver claimed reward

## Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Docker (optional)

### Installation
```bash
npm install
```

### Configuration

Create `.env` file:
```env
POLKADOT_HUB_RPC_URL=https://polkadot-hub-rpc.example.com
INTENT_REGISTRY_ADDRESS=0x...
INDEXER_START_BLOCK=0
DB_NAME=intentflow_indexer
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
```

### Generate Types
```bash
npm run codegen
npm run typegen
```

### Database Setup
```bash
# Start PostgreSQL
npm run up

# Generate migration
npm run migration:generate

# Apply migration
npm run migration:apply
```

### Running

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## GraphQL API

Once running, GraphQL playground available at:
- http://localhost:4350/graphql

### Example Queries

Get all intents:
```graphql
query {
  intents(orderBy: createdAt_DESC, limit: 10) {
    id
    creator
    description
    status
    reward
    createdAt
    solver {
      address
      reputation
    }
  }
}
```

Get solver stats:
```graphql
query {
  solver(id: "0x...") {
    address
    reputation
    totalExecuted
    totalFailed
    intents {
      id
      status
    }
  }
}
```

## Architecture

```
Blockchain Events → Processor → PostgreSQL → GraphQL API
```

## License

MIT
