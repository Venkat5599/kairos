#!/bin/bash

# Kairos Development Startup Script

set -e

echo "🚀 Starting Kairos Development Environment"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Run: cp .env.example .env"
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠ Port $1 is already in use${NC}"
        return 1
    fi
    return 0
}

# Check required ports
echo "🔍 Checking ports..."
check_port 3000 || echo "   Frontend port 3000 in use"
check_port 3001 || echo "   Backend port 3001 in use"
check_port 5432 || echo "   PostgreSQL port 5432 in use"

echo ""
echo "📦 Starting services..."
echo ""

# Start PostgreSQL if not running
if ! pgrep -x "postgres" > /dev/null; then
    echo -e "${BLUE}Starting PostgreSQL...${NC}"
    if command -v docker &> /dev/null; then
        docker start kairos-postgres 2>/dev/null || \
        docker run -d \
            --name kairos-postgres \
            -e POSTGRES_USER=kairos \
            -e POSTGRES_PASSWORD=password \
            -e POSTGRES_DB=kairos \
            -p 5432:5432 \
            postgres:16-alpine
        sleep 3
    fi
fi

# Start Redis if available
if command -v redis-server &> /dev/null; then
    if ! pgrep -x "redis-server" > /dev/null; then
        echo -e "${BLUE}Starting Redis...${NC}"
        redis-server --daemonize yes
    fi
fi

echo ""
echo "🔨 Building packages..."

# Build shared package
cd packages/shared
npm run build
cd ../..

echo ""
echo "🎯 Starting services in parallel..."
echo ""

# Create logs directory
mkdir -p logs

# Start backend
echo -e "${BLUE}Starting Backend API (port 3001)...${NC}"
cd packages/backend
npm run start:dev > ../../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Wait for backend to start
sleep 5

# Start frontend
echo -e "${BLUE}Starting Frontend (port 3000)...${NC}"
cd packages/frontend
npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

# Start solver bot
echo -e "${BLUE}Starting Solver Bot...${NC}"
cd packages/solver-bot
npm run start:dev > ../../logs/solver.log 2>&1 &
SOLVER_PID=$!
cd ../..

# Start indexer (optional)
if [ "$START_INDEXER" = "true" ]; then
    echo -e "${BLUE}Starting Indexer...${NC}"
    cd packages/indexer
    npm run dev > ../../logs/indexer.log 2>&1 &
    INDEXER_PID=$!
    cd ../..
fi

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "📊 Service URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:3001"
echo "   API Docs:  http://localhost:3001/api/docs"
echo ""
echo "📝 Logs:"
echo "   Backend:   tail -f logs/backend.log"
echo "   Frontend:  tail -f logs/frontend.log"
echo "   Solver:    tail -f logs/solver.log"
echo ""
echo "🛑 To stop all services:"
echo "   kill $BACKEND_PID $FRONTEND_PID $SOLVER_PID"
echo ""
echo "💡 Tip: Use 'docker-compose up' for easier management"
echo ""

# Save PIDs to file for cleanup
echo "$BACKEND_PID" > .pids
echo "$FRONTEND_PID" >> .pids
echo "$SOLVER_PID" >> .pids
[ ! -z "$INDEXER_PID" ] && echo "$INDEXER_PID" >> .pids

# Wait for user interrupt
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID $SOLVER_PID 2>/dev/null; [ ! -z '$INDEXER_PID' ] && kill $INDEXER_PID 2>/dev/null; rm -f .pids; echo 'Services stopped'; exit 0" INT

echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running
wait
