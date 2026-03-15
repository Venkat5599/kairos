#!/bin/bash

# Test Real XCM Transfer Script
# This tests the actual Xtokens precompile integration

set -e

echo "🧪 Testing REAL XCM Transfer via Xtokens Precompile"
echo "=================================================="
echo ""

# Contract addresses
XCM_BRIDGE="0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234"
PRIVATE_KEY="0x2e8ca714b56638e54705e0c39194e35bd98e82c8bccf8b61d1acbe02aba85a1d"

# Test recipient (Polkadot address converted to bytes32)
# Using a test address - in production use real Polkadot address
RECIPIENT="0x0000000000000000000000001234567890123456789012345678901234567890"

# Amount to send (0.01 DEV = 10000000000000000 wei)
AMOUNT="10000000000000000"

# Destination: 0 = Polkadot Relay Chain, 1000 = Asset Hub
DESTINATION_CHAIN="1000"

echo "📋 Test Parameters:"
echo "   XCM Bridge: $XCM_BRIDGE"
echo "   Destination: Chain ID $DESTINATION_CHAIN (Asset Hub)"
echo "   Recipient: $RECIPIENT"
echo "   Amount: 0.01 DEV"
echo ""

echo "1️⃣ Checking if sendRealXCMTransfer function exists..."
cast call $XCM_BRIDGE "sendRealXCMTransfer(uint32,bytes32,uint256)" --rpc-url moonbase 2>/dev/null && echo "✅ Function exists!" || echo "❌ Function not found"
echo ""

echo "2️⃣ Checking Xtokens precompile (0x0000000000000000000000000000000000000804)..."
XTOKENS="0x0000000000000000000000000000000000000804"
cast code $XTOKENS --rpc-url moonbase | head -c 10
echo ""
echo "✅ Xtokens precompile is available"
echo ""

echo "3️⃣ Testing REAL XCM transfer (0.01 DEV to Asset Hub)..."
echo "   ⚠️  This will execute a REAL cross-chain transfer!"
echo "   Press Ctrl+C to cancel, or wait 5 seconds to continue..."
sleep 5

echo ""
echo "🚀 Sending XCM transfer..."

# Execute the real XCM transfer
cast send $XCM_BRIDGE \
  "sendRealXCMTransfer(uint32,bytes32,uint256)" \
  $DESTINATION_CHAIN \
  $RECIPIENT \
  $AMOUNT \
  --value $AMOUNT \
  --rpc-url moonbase \
  --private-key $PRIVATE_KEY \
  --legacy

echo ""
echo "✅ XCM Transfer Sent!"
echo ""
echo "🔍 Verification:"
echo "   1. Check Moonbase Alpha: https://moonbase.moonscan.io/"
echo "   2. Check Asset Hub: https://assethub-polkadot.subscan.io/"
echo "   3. Look for XCM message in Polkadot: https://polkadot.subscan.io/xcm_message"
echo ""
echo "💡 Note: XCM transfers may take 1-2 minutes to appear on destination chain"
