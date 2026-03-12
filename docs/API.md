# IntentFlow API Reference

Base URL: `http://localhost:3001` (development)

## Authentication

Currently, the API is open. Future versions will implement JWT authentication.

## Intents

### Create Intent

Create a new intent.

**Endpoint:** `POST /intents`

**Request Body:**
```json
{
  "chainId": 1000,
  "creator": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "description": "Send 20 USDC to Alice",
  "data": "0x",
  "reward": "1000000000000000000",
  "deadline": 1704067200,
  "txHash": "0x..."
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "chainId": 1000,
  "creator": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "description": "Send 20 USDC to Alice",
  "status": "PENDING",
  "reward": "1000000000000000000",
  "deadline": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get All Intents

List all intents with optional filters.

**Endpoint:** `GET /intents`

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, EXECUTING, COMPLETED, FAILED, CANCELLED)
- `creator` (optional): Filter by creator address
- `solver` (optional): Filter by solver address
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "intents": [
    {
      "id": "uuid",
      "chainId": 1000,
      "creator": "0x...",
      "description": "Send 20 USDC to Alice",
      "status": "PENDING",
      "reward": "1000000000000000000",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "solver": null
    }
  ],
  "total": 1
}
```

### Get Intent by ID

Get details of a specific intent.

**Endpoint:** `GET /intents/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "chainId": 1000,
  "creator": "0x...",
  "description": "Send 20 USDC to Alice",
  "status": "COMPLETED",
  "reward": "1000000000000000000",
  "deadline": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "executedAt": "2024-01-01T00:05:00.000Z",
  "solver": {
    "address": "0x...",
    "reputation": 100
  },
  "executions": [
    {
      "id": "uuid",
      "success": true,
      "gasUsed": "150000",
      "createdAt": "2024-01-01T00:05:00.000Z"
    }
  ]
}
```

### Get Pending Intents

Get all pending intents.

**Endpoint:** `GET /intents/pending`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "Send 20 USDC to Alice",
    "reward": "1000000000000000000",
    "deadline": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Intents by Creator

Get all intents created by a specific address.

**Endpoint:** `GET /intents/creator/:address`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "Send 20 USDC to Alice",
    "status": "COMPLETED",
    "reward": "1000000000000000000",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update Intent

Update intent status (internal use).

**Endpoint:** `PATCH /intents/:id`

**Request Body:**
```json
{
  "status": "EXECUTING",
  "solverId": "uuid"
}
```

**Response:** `200 OK`

## Solvers

### Get All Solvers

List all solvers.

**Endpoint:** `GET /solvers`

**Query Parameters:**
- `isActive` (optional): Filter by active status (true/false)
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "solvers": [
    {
      "id": "uuid",
      "address": "0x...",
      "stake": "1000000000000000000",
      "reputation": 100,
      "totalExecuted": 50,
      "totalFailed": 2,
      "isActive": true,
      "registeredAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Get Solver by Address

Get details of a specific solver.

**Endpoint:** `GET /solvers/:address`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "address": "0x...",
  "stake": "1000000000000000000",
  "reputation": 100,
  "totalExecuted": 50,
  "totalFailed": 2,
  "isActive": true,
  "registeredAt": "2024-01-01T00:00:00.000Z",
  "intents": [],
  "executions": []
}
```

### Get Solver Leaderboard

Get top solvers by reputation.

**Endpoint:** `GET /solvers/leaderboard`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:** `200 OK`
```json
[
  {
    "address": "0x...",
    "reputation": 500,
    "totalExecuted": 250,
    "totalFailed": 5,
    "stake": "1000000000000000000"
  }
]
```

### Get Solver Stats

Get statistics for a specific solver.

**Endpoint:** `GET /solvers/:address/stats`

**Response:** `200 OK`
```json
{
  "address": "0x...",
  "reputation": 100,
  "totalExecuted": 50,
  "totalFailed": 2,
  "successRate": "96.15",
  "avgExecutionTime": "45.5",
  "stake": "1000000000000000000"
}
```

## Analytics

### Get Overall Stats

Get system-wide statistics.

**Endpoint:** `GET /analytics/stats`

**Response:** `200 OK`
```json
{
  "totalIntents": 1000,
  "completedIntents": 950,
  "failedIntents": 30,
  "pendingIntents": 20,
  "totalSolvers": 50,
  "successRate": "95.00",
  "totalVolume": "1000000000000000000000"
}
```

### Get Intents by Status

Get intent counts grouped by status.

**Endpoint:** `GET /analytics/intents-by-status`

**Response:** `200 OK`
```json
[
  { "status": "PENDING", "count": 20 },
  { "status": "EXECUTING", "count": 5 },
  { "status": "COMPLETED", "count": 950 },
  { "status": "FAILED", "count": 30 },
  { "status": "CANCELLED", "count": 5 }
]
```

### Get Recent Activity

Get recent intent activity.

**Endpoint:** `GET /analytics/recent-activity`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "description": "Send 20 USDC to Alice",
    "status": "COMPLETED",
    "creator": "0x...",
    "reward": "1000000000000000000",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "solver": {
      "address": "0x..."
    }
  }
]
```

### Get Volume by Day

Get daily volume data.

**Endpoint:** `GET /analytics/volume-by-day`

**Query Parameters:**
- `days` (optional): Number of days (default: 7)

**Response:** `200 OK`
```json
[
  {
    "date": "2024-01-01",
    "volume": "50000000000000000000",
    "count": 25
  }
]
```

### Get Top Solvers

Get top performing solvers.

**Endpoint:** `GET /analytics/top-solvers`

**Query Parameters:**
- `limit` (optional): Number of results (default: 5)

**Response:** `200 OK`
```json
[
  {
    "address": "0x...",
    "totalExecuted": 250,
    "reputation": 500
  }
]
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["description should not be empty"],
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Intent with ID uuid not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Rate Limiting

Currently no rate limiting. Future versions will implement:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## Swagger Documentation

Interactive API documentation available at:
- Development: http://localhost:3001/api/docs
- Production: https://api.intentflow.io/api/docs

## WebSocket Support (Future)

Real-time updates for intent status changes will be available via WebSocket connection.

## License

MIT
