#!/bin/bash

# Kairos Deployment to Moonbase Alpha
# Moonbase Alpha is Moonbeam's testnet with full EVM compatibility

echo "🌙 Kairos Deployment to Moonbase Alpha"
echo "======================================="
echo ""

# Check if .env.moonbase exists
if [ ! -f ".env.moonbase" ]; then
    echo "❌ .env.moonbase file not found!"
    echo "Please create it with your DEPLOYER_PRIVATE_KEY"
    exit 1
fi

# Load environment variables
source .env.moonbase

# Check if private key is set
if [ "$DEPLOYER_PRIVATE_KEY" = "YOUR_PRIVATE_KEY_HERE" ] || [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
    echo "❌ DEPLOYER_PRIVATE_KEY not set in .env.moonbase"
    echo ""
    echo "📝 Steps to deploy:"
    echo "  1. Get a wallet private key (MetaMask, etc.)"
    echo "  2. Get testnet DEV tokens from: https://faucet.moonbeam.network/"
    echo "  3. Add your private key to .env.moonbase"
    echo "  4. Run this script again"
    exit 1
fi

# Get deployer address
DEPLOYER_ADDRESS=$(cast wallet address $DEPLOYER_PRIVATE_KEY)
echo "📋 Deployer Address: $DEPLOYER_ADDRESS"

# Check balance
echo "💰 Checking balance..."
BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url $RPC_URL)
BALANCE_ETH=$(cast --to-unit $BALANCE ether)
echo "  Balance: $BALANCE_ETH DEV"

if [ $(echo "$BALANCE_ETH < 0.1" | bc) -eq 1 ]; then
    echo ""
    echo "⚠️  Low balance! You need at least 0.1 DEV for deployment"
    echo "Get testnet tokens from: https://faucet.moonbeam.network/"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🚀 Deploying contracts to Moonbase Alpha..."
echo "  Network: Moonbase Alpha"
echo "  Chain ID: $CHAIN_ID"
echo "  RPC: $RPC_URL"
echo ""

# Deploy contracts
forge script script/Deploy.s.sol \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify \
    --etherscan-api-key moonbase \
    -vvvv

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "📋 Next steps:"
echo "  1. Check the deployment output above for contract addresses"
echo "  2. Update .env.moonbase with the deployed addresses"
echo "  3. Update packages/frontend/.env.local with the addresses"
echo "  4. Verify contracts on Moonscan: $EXPLORER_URL"
echo ""
