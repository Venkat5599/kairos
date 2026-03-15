#!/bin/bash

# IntentFlow Contract Deployment Script

set -e

echo "🚀 IntentFlow Contract Deployment"
echo "================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please create .env from .env.example"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
    echo -e "${RED}❌ DEPLOYER_PRIVATE_KEY not set${NC}"
    exit 1
fi

if [ -z "$POLKADOT_HUB_RPC_URL" ]; then
    echo -e "${RED}❌ POLKADOT_HUB_RPC_URL not set${NC}"
    exit 1
fi

# Navigate to contracts directory
cd packages/contracts

echo "📋 Deployment Configuration:"
echo "   RPC URL: $POLKADOT_HUB_RPC_URL"
echo "   Chain ID: ${CHAIN_ID:-1000}"
echo ""

# Ask for confirmation
read -p "Deploy to this network? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "🔨 Building contracts..."
forge build

echo ""
echo "🧪 Running tests..."
forge test

echo ""
echo "📊 Gas report..."
forge test --gas-report

echo ""
echo "🚀 Deploying contracts..."

# Deploy contracts
forge script script/Deploy.s.sol \
    --rpc-url $POLKADOT_HUB_RPC_URL \
    --broadcast \
    --verify \
    -vvvv

echo ""
echo "✅ Deployment complete!"
echo ""

# Check if deployment addresses were saved
if [ -f .env.deployed ]; then
    echo "📝 Deployed contract addresses:"
    cat .env.deployed
    echo ""

    # Copy to root .env
    echo "Updating root .env with contract addresses..."
    cat .env.deployed >> ../../.env

    echo -e "${GREEN}✓ Contract addresses added to .env${NC}"
else
    echo -e "${YELLOW}⚠ Deployment addresses not found${NC}"
fi

echo ""
echo "📚 Next steps:"
echo "1. Verify contracts on block explorer"
echo "2. Update frontend with contract addresses"
echo "3. Register solver bots"
echo "4. Test intent creation"
echo ""
