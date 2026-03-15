#!/bin/bash

echo "🔍 Verifying REAL System Status"
echo "================================"
echo ""

RPC="https://rpc.api.moonbase.moonbeam.network"
REGISTRY="0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB"
XCM_BRIDGE="0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234"
SOLVER="0x6cc55F248DB629A8578722A5F1E10871F3Ae165B"
XTOKENS="0x0000000000000000000000000000000000000804"

echo "1️⃣ Checking Solver Registration..."
SOLVER_DATA=$(cast call $REGISTRY "solvers(address)(bool,uint256,uint256,bool)" $SOLVER --rpc-url $RPC)
echo "$SOLVER_DATA"
if [[ $SOLVER_DATA == *"true"* ]]; then
    echo "✅ Solver is registered!"
else
    echo "❌ Solver not registered"
fi
echo ""

echo "2️⃣ Checking Xtokens Precompile..."
PRECOMPILE_CODE=$(cast code $XTOKENS --rpc-url $RPC)
if [[ ${#PRECOMPILE_CODE} -gt 10 ]]; then
    echo "✅ Xtokens precompile EXISTS (bytecode: ${PRECOMPILE_CODE:0:20}...)"
else
    echo "❌ Xtokens precompile not found"
fi
echo ""

echo "3️⃣ Checking XCM Bridge Configuration..."
XTOKENS_ADDR=$(cast call $XCM_BRIDGE "XTOKENS()(address)" --rpc-url $RPC 2>/dev/null)
if [[ $XTOKENS_ADDR == *"0804"* ]]; then
    echo "✅ XCM Bridge has Xtokens configured: $XTOKENS_ADDR"
else
    echo "⚠️  Could not verify XTOKENS constant"
fi
echo ""

echo "4️⃣ Checking Intents..."
INTENTS=$(cast call $REGISTRY "getAllIntentIds()(bytes32[])" --rpc-url