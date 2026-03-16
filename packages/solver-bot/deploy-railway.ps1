# Kairos Solver Bot - Railway Deployment Script (PowerShell)
# This script automates the deployment of the solver bot to Railway

Write-Host "🤖 Kairos Solver Bot - Railway Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
    Write-Host "✅ Railway CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Railway CLI found" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Please provide the following information:" -ForegroundColor Yellow
Write-Host ""

# Get private key
$PRIVATE_KEY = Read-Host "Enter your SOLVER_PRIVATE_KEY" -AsSecureString
$PRIVATE_KEY_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($PRIVATE_KEY)
)

# Confirm deployment
Write-Host ""
Write-Host "🚀 Ready to deploy with the following configuration:" -ForegroundColor Cyan
Write-Host "   RPC_URL: https://eth-rpc-testnet.polkadot.io"
Write-Host "   INTENT_REGISTRY: 0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2"
Write-Host "   XCM_BRIDGE: 0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88"
Write-Host ""
$confirm = Read-Host "Continue with deployment? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔐 Logging in to Railway..." -ForegroundColor Cyan
railway login

Write-Host ""
Write-Host "📦 Initializing Railway project..." -ForegroundColor Cyan
railway init

Write-Host ""
Write-Host "⚙️  Setting environment variables..." -ForegroundColor Cyan
railway variables set SOLVER_PRIVATE_KEY="$PRIVATE_KEY_PLAIN"
railway variables set RPC_URL="https://eth-rpc-testnet.polkadot.io"
railway variables set INTENT_REGISTRY_ADDRESS="0x237B40f9c2D95B4847221D7bF91b5A36c46da7e2"
railway variables set XCM_BRIDGE_ADDRESS="0xD8B9D7C3b20e2981004dDDb702e41c9A552C5f88"
railway variables set SOLVER_MIN_REWARD="0.001"
railway variables set SOLVER_POLL_INTERVAL="10000"

Write-Host ""
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Cyan
railway up

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 View your deployment:" -ForegroundColor Cyan
Write-Host "   Dashboard: https://railway.app/dashboard"
Write-Host "   Logs: railway logs"
Write-Host ""
Write-Host "🎉 Your solver bot is now running 24/7 in the cloud!" -ForegroundColor Green
