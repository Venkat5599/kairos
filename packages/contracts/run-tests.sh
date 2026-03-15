#!/bin/bash

# Kairos Test Suite Runner
# Comprehensive testing for all smart contracts

set -e

echo "🧪 Kairos Smart Contract Test Suite"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if forge is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not installed. Install from https://getfoundry.sh/"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
forge install

echo ""
echo -e "${BLUE}🔨 Compiling contracts...${NC}"
forge build

echo ""
echo -e "${BLUE}🧪 Running unit tests...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
forge test -vv

echo ""
echo -e "${BLUE}📊 Generating gas report...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
forge test --gas-report

echo ""
echo -e "${BLUE}📈 Generating coverage report...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
forge coverage

echo ""
echo -e "${BLUE}🔍 Running specific test suites...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo -e "${YELLOW}Testing IntentRegistry...${NC}"
forge test --match-contract IntentRegistryTest -vv

echo ""
echo -e "${YELLOW}Testing XCMBridge...${NC}"
forge test --match-contract XCMBridgeTest -vv

echo ""
echo -e "${BLUE}🎲 Running fuzz tests...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
forge test --match-test testFuzz -vv

echo ""
echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "📋 Test Summary:"
echo "  - Unit tests: ✅"
echo "  - Integration tests: ✅"
echo "  - Fuzz tests: ✅"
echo "  - Gas optimization: ✅"
echo "  - Coverage report: ✅"
echo ""
echo "🔍 View detailed results above"
echo "📊 Gas report shows optimization opportunities"
echo "📈 Coverage report shows test completeness"
