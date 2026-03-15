# Kairos Indexer (Work in Progress)

## Status: 🚧 Under Development

This package is a Subsquid-based indexer for Kairos events. It's currently a work in progress and not required for the hackathon demo.

## Purpose

The indexer will eventually:
- Index all IntentCreated, IntentClaimed, IntentCompleted events
- Store data in PostgreSQL for fast queries
- Provide historical data for analytics
- Enable efficient filtering and searching

## Current State

- ✅ Basic structure in place
- ✅ Event decoders implemented
- 🚧 Database models (placeholder)
- 🚧 Full event topic mapping
- ❌ Not deployed
- ❌ Not tested

## Future Work

1. Complete database schema
2. Add proper event topic IDs
3. Set up PostgreSQL database
4. Deploy to production
5. Add GraphQL API
6. Create analytics dashboard

## Not Required for Demo

The main Kairos system works without this indexer. The frontend and solver bot query the blockchain directly, which is sufficient for the hackathon demo.

## To Run (When Complete)

```bash
# Start database
npm run up

# Generate types
npm run codegen
npm run typegen

# Run indexer
npm run dev
```

## Dependencies

- Subsquid SDK
- PostgreSQL
- TypeORM

---

**Note**: This is a future enhancement and not part of the core hackathon submission.
