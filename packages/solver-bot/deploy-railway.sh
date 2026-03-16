#!/bin/bash

# Kairos Solver Bot - Railway Deployment Script
# This script automates the deployment of the solver bot to Railway

echo "🤖 Kairos Solver Bot - Railway Deployment"
echo "=========================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
else
    echo "✅ Railway CLI found"
fi

echo ""
echo "📝 Please provide the following information:"
echo ""

# Get private key
read -sp "Enter your SOLVER_PRIVATE_KEY: " PRIVATE_KEY
echo ""

# Confirm deployment
echo ""
echo "🚀 Ready to deploy with the following configuration:"
echo "   RPC_URL: https://eth-rpc-testnet.polkadot.io"
echo "   INTENT_REGISTRY: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2"
echo "   XCM_BRIDGE: 0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🔐 Logging in to Railway..."
railway login

echo ""
echo "📦 Initializing Railway project..."
railway init

echo ""
echo "⚙️  Setting environment variables..."
railway variables set SOLVER_PRIVATE_KEY="$PRIVATE_KEY"
railway variables set RPC_URL="https://eth-rpc-testnet.polkadot.io"
railway variables set INTENT_REGISTRY_ADDRESS="0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2"
railway variables set XCM_BRIDGE_ADDRESS="0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88"
railway variables set SOLVER_MIN_REWARD="0.001"
railway variables set SOLVER_POLL_INTERVAL="10000"

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 View your deployment:"
echo "   Dashboard: https://railway.app/dashboard"
echo "   Logs: railway logs"
echo ""
echo "🎉 Your solver bot is now running 24/7 in the cloud!"
