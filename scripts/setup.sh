#!/bin/bash

# Kairos Setup Script
# This script sets up the entire Kairos development environment

set -e

echo "🚀 Kairos Setup Script"
echo "=========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version must be 20 or higher${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker is not installed (optional but recommended)${NC}"
else
    echo -e "${GREEN}✓ Docker $(docker -v | cut -d' ' -f3 | cut -d',' -f1)${NC}"
fi

# Check Foundry
if ! command -v forge &> /dev/null; then
    echo -e "${YELLOW}⚠ Foundry is not installed${NC}"
    echo "Installing Foundry..."
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
fi
echo -e "${GREEN}✓ Foundry $(forge --version | head -n1)${NC}"

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install package dependencies
echo "Installing contracts dependencies..."
cd packages/contracts && forge install && cd ../..

echo "Installing shared dependencies..."
cd packages/shared && npm install && cd ../..

echo "Installing backend dependencies..."
cd packages/backend && npm install && cd ../..

echo "Installing frontend dependencies..."
cd packages/frontend && npm install && cd ../..

echo "Installing solver-bot dependencies..."
cd packages/solver-bot && npm install && cd ../..

echo "Installing indexer dependencies..."
cd packages/indexer && npm install && cd ../..

echo ""
echo "⚙️  Setting up environment..."

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit .env with your configuration${NC}"
fi

echo ""
echo "🗄️  Setting up database..."

# Check if PostgreSQL is running
if command -v psql &> /dev/null; then
    echo "PostgreSQL detected"

    # Create database if it doesn't exist
    createdb kairos 2>/dev/null || echo "Database already exists"

    # Run migrations
    cd packages/backend
    npm run prisma:generate
    npm run prisma:migrate || echo "Migrations already applied"
    cd ../..
else
    echo -e "${YELLOW}⚠ PostgreSQL not found. Using Docker...${NC}"

    if command -v docker &> /dev/null; then
        docker run -d \
            --name kairos-postgres \
            -e POSTGRES_USER=kairos \
            -e POSTGRES_PASSWORD=password \
            -e POSTGRES_DB=kairos \
            -p 5432:5432 \
            postgres:16-alpine || echo "Container already running"

        echo "Waiting for PostgreSQL to start..."
        sleep 5

        cd packages/backend
        npm run prisma:generate
        npm run prisma:migrate
        cd ../..
    else
        echo -e "${RED}❌ Please install PostgreSQL or Docker${NC}"
        exit 1
    fi
fi

echo ""
echo "🔨 Building packages..."

# Build shared package
cd packages/shared && npm run build && cd ../..

# Build contracts
cd packages/contracts && forge build && cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Deploy contracts: cd packages/contracts && forge script script/Deploy.s.sol --rpc-url localhost --broadcast"
echo "3. Start development: npm run dev"
echo ""
echo "🚀 Quick start:"
echo "   docker-compose up -d    # Start all services with Docker"
echo "   npm run backend:dev     # Start backend only"
echo "   npm run frontend:dev    # Start frontend only"
echo "   npm run solver:dev      # Start solver bot only"
echo ""
echo "📚 Documentation: ./docs/"
echo ""
