# IntentFlow Backend API

NestJS-based REST API for the IntentFlow protocol.

## Features

- Intent management (create, query, update)
- Solver tracking and leaderboard
- Real-time analytics and statistics
- PostgreSQL database with Prisma ORM
- Swagger API documentation
- Input validation and error handling

## API Endpoints

### Intents
- `POST /intents` - Create new intent
- `GET /intents` - List all intents (with filters)
- `GET /intents/pending` - Get pending intents
- `GET /intents/:id` - Get intent details
- `GET /intents/creator/:address` - Get intents by creator
- `PATCH /intents/:id` - Update intent status

### Solvers
- `GET /solvers` - List all solvers
- `GET /solvers/leaderboard` - Get solver leaderboard
- `GET /solvers/:address` - Get solver details
- `GET /solvers/:address/stats` - Get solver statistics

### Analytics
- `GET /analytics/stats` - Overall system statistics
- `GET /analytics/intents-by-status` - Intent status breakdown
- `GET /analytics/recent-activity` - Recent activity feed
- `GET /analytics/volume-by-day` - Daily volume data
- `GET /analytics/top-solvers` - Top performing solvers

## Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 16+

### Installation
```bash
npm install
```

### Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (optional)
npm run prisma:studio
```

### Environment Variables
Create `.env` file:
```env
DATABASE_URL=postgresql://intentflow:password@localhost:5432/intentflow
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:3001/api/docs

## Database Schema

### Intent
- Stores user intents with status tracking
- Links to solver and execution records

### Solver
- Solver registration and reputation
- Performance metrics

### Execution
- Execution history and results
- Route information and gas usage

### XCMMessage
- Cross-chain message tracking

### Analytics
- Daily aggregated statistics

## Testing

```bash
npm run test
npm run test:cov
```

## License

MIT
