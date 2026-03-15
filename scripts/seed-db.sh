#!/bin/bash

# IntentFlow Database Seeding Script

set -e

echo "🌱 IntentFlow Database Seeding"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check database connection
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
    exit 1
fi

echo "📊 Database: $DATABASE_URL"
echo ""

# Navigate to backend directory
cd packages/backend

echo "🗄️  Running migrations..."
npm run prisma:migrate deploy

echo ""
echo "🌱 Seeding database..."

# Create seed script
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample solvers
  const solver1 = await prisma.solver.upsert({
    where: { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' },
    update: {},
    create: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      stake: '1000000000000000000',
      reputation: 100,
      totalExecuted: 50,
      totalFailed: 2,
      isActive: true,
    },
  });

  const solver2 = await prisma.solver.upsert({
    where: { address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199' },
    update: {},
    create: {
      address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      stake: '2000000000000000000',
      reputation: 250,
      totalExecuted: 120,
      totalFailed: 5,
      isActive: true,
    },
  });

  console.log('✓ Created solvers:', solver1.address, solver2.address);

  // Create sample intents
  const intent1 = await prisma.intent.create({ 
    data: {
      chainId: 1000,
      creator: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      description: 'Send 20 USDC to Alice',
      data: '0x',
      status: 'COMPLETED',
      reward: '100000000000000000',
      deadline: new Date(Date.now() + 3600000),
      solverId: solver1.id,
      executedAt: new Date(),
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
  });

  const intent2 = await prisma.intent.create({
    data: {
      chainId: 1000,
      creator: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      description: 'Swap DOT to USDC',
      data: '0x',
      status: 'PENDING',
      reward: '50000000000000000',
      deadline: new Date(Date.now() + 7200000),
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    },
  });

  console.log('✓ Created intents:', intent1.id, intent2.id);

  // Create sample executions
  const execution1 = await prisma.execution.create({
    data: {
      intentId: intent1.id,
      solverId: solver1.id,
      route: { type: 'DIRECT', path: [], estimatedGas: 50000 },
      gasUsed: '48500',
      success: true,
      result: 'Transfer completed successfully',
    },
  });

  console.log('✓ Created execution:', execution1.id);

  console.log('');
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# Run seed script
npx ts-node prisma/seed.ts

echo ""
echo -e "${GREEN}✅ Database seeding complete!${NC}"
echo ""
echo "📊 Summary:"
echo "   - 2 solvers created"
echo "   - 2 intents created"
echo "   - 1 execution created"
echo ""
echo "🔍 View data:"
echo "   npm run prisma:studio"
echo ""
