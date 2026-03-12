#!/bin/bash

# Check if you're ready to deploy to Moonbase Alpha

echo "🔍 Kairos Devnet Deployment Readiness Check"
echo "==========================================="
echo ""

READY=true

# Check 1: Foundry installed
echo "1️⃣  Checking Foundry installation..."
if command -v forge &> /dev/null; then
    FORGE_VERSION=$(forge --version | head -n 1)
    echo "  ✅ Foundry installed: $FORGE_VERSION"
else
    echo "  ❌ Foundry not installed"
    echo "     Install: curl -L https://foundry.paradigm.xyz | bash"
    READY=false
fi

# Check 2: Cast installed
echo ""
echo "2️⃣  Checking Cast installation..."
if command -v cast &> /dev/null; then
    echo "  ✅ Cast installed"
else
    echo "  ❌ Cast not installed (comes with Foundry)"
    READY=false
fi

# Check 3: .env.moonbase exists
echo ""
echo "3️⃣  Checking configuration file..."
if [ -f ".env.moonbase" ]; then
    echo "  ✅ .env.moonbase exists"
    
    # Check if private key is set
    source .env.moonbase
    if [ "$DEPLOYER_PRIVATE_KEY" = "YOUR_PRIVATE_KEY_HERE" ] || [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
        echo "  ⚠️  Private key not configured"
        echo "     Edit .env.moonbase and add your private key"
        READY=false
    else
        echo "  ✅ Private key configured"
        
        # Get address and check balance
        DEPLOYER_ADDRESS=$(cast wallet address $DEPLOYER_PRIVATE_KEY 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo "  ✅ Deployer address: $DEPLOYER_ADDRESS"
            
            # Check balance on Moonbase Alpha
            echo ""
            echo "4️⃣  Checking Moonbase Alpha balance..."
            BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url https://rpc.api.moonbase.moonbeam.network 2>/dev/null)
            if [ $? -eq 0 ]; then
                BALANCE_ETH=$(cast --to-unit $BALANCE ether)
                echo "  💰 Balance: $BALANCE_ETH DEV"
                
                if [ $(echo "$BALANCE_ETH < 0.1" | bc -l) -eq 1 ]; then
                    echo "  ⚠️  Low balance! You need at least 0.1 DEV"
                    echo "     Get tokens: https://faucet.moonbeam.network/"
                    READY=false
                else
                    echo "  ✅ Sufficient balance for deployment"
                fi
            else
                echo "  ⚠️  Cannot check balance (RPC connection issue)"
            fi
        else
            echo "  ❌ Invalid private key format"
            READY=false
        fi
    fi
else
    echo "  ❌ .env.moonbase not found"
    echo "     File should be in packages/contracts/.env.moonbase"
    READY=false
fi

# Check 5: Contracts compile
echo ""
echo "5️⃣  Checking if contracts compile..."
if forge build --silent 2>/dev/null; then
    echo "  ✅ Contracts compile successfully"
else
    echo "  ❌ Compilation errors"
    echo "     Run: forge build"
    READY=false
fi

# Summary
echo ""
echo "==========================================="
if [ "$READY" = true ]; then
    echo "✅ All checks passed! Ready to deploy!"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Run: bash deploy-moonbase.sh"
    echo "  2. Wait for deployment to complete"
    echo "  3. Copy contract addresses to frontend/.env.local"
    echo "  4. Start frontend: cd ../frontend && npm run dev"
else
    echo "❌ Some checks failed. Please fix the issues above."
    echo ""
    echo "📚 Quick fixes:"
    echo "  • Install Foundry: curl -L https://foundry.paradigm.xyz | bash"
    echo "  • Get private key: cast wallet new"
    echo "  • Get testnet tokens: https://faucet.moonbeam.network/"
    echo "  • Configure: nano .env.moonbase"
fi
echo ""
