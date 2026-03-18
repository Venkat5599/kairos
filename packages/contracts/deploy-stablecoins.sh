#!/bin/bash

# Deploy Stablecoins to Polkadot Hub TestNet
# This script deploys MockUSDC and MockUSDT and adds them to IntentRegistry

set -e

echo "🚀 Deploying Stablecoins to Polkadot Hub TestNet..."

# Load environment variables
source .env.polkadot-hub

# Check required variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env.polkadot-hub"
    exit 1
fi

if [ -z "$INTENT_REGISTRY_ADDRESS" ]; then
    echo "❌ Error: INTENT_REGISTRY_ADDRESS not set in .env.polkadot-hub"
    exit 1
fi

echo "📋 Configuration:"
echo "  RPC URL: $RPC_URL"
echo "  Chain ID: $CHAIN_ID"
echo "  IntentRegistry: $INTENT_REGISTRY_ADDRESS"
echo ""

# Compile contracts
echo "🔨 Compiling contracts..."
forge build

# Deploy stablecoins
echo "💰 Deploying stablecoins..."
forge script script/DeployStablecoins.s.sol:DeployStablecoins \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify \
    -vvvv

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the contract addresses from the output above"
echo "2. Add them to packages/frontend/.env.local:"
echo "   NEXT_PUBLIC_MOCK_USDC_ADDRESS=<usdc_address>"
echo "   NEXT_PUBLIC_MOCK_USDT_ADDRESS=<usdt_address>"
echo "3. Restart the frontend: cd packages/frontend && npm run dev"
echo "4. Test creating intents with USDC/USDT rewards"
