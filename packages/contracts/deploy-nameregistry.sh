#!/bin/bash

# Deploy NameRegistry to Moonbase Alpha
# Usage: ./deploy-nameregistry.sh

set -e

echo "🚀 Deploying NameRegistry to Moonbase Alpha..."
echo ""

# Load environment variables
source .env.moonbase

# Check if private key is set
if [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
    echo "❌ Error: DEPLOYER_PRIVATE_KEY not set in .env.moonbase"
    exit 1
fi

# Check balance
echo "📊 Checking deployer balance..."
DEPLOYER_ADDRESS=$(cast wallet address $DEPLOYER_PRIVATE_KEY)
BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url https://rpc.api.moonbase.moonbeam.network)
echo "Deployer: $DEPLOYER_ADDRESS"
echo "Balance: $BALANCE wei"
echo ""

# Deploy contract
echo "📝 Deploying NameRegistry contract..."
forge script script/DeployNameRegistry.s.sol:DeployNameRegistry \
    --rpc-url https://rpc.api.moonbase.moonbeam.network \
    --broadcast \
    --verify \
    --etherscan-api-key moonbase \
    -vvvv

echo ""
echo "✅ NameRegistry deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the NAME_REGISTRY_ADDRESS from .env.nameregistry"
echo "2. Add it to packages/frontend/.env.local as NEXT_PUBLIC_NAME_REGISTRY_ADDRESS"
echo "3. Update DEPLOYED_ADDRESSES.md with the new address"
echo ""
