import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMarketplaceIntentDto } from './dto/create-marketplace-intent.dto';
import { RateIntentDto } from './dto/rate-intent.dto';
import { CloneIntentDto } from './dto/clone-intent.dto';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  async create(creator: string, dto: CreateMarketplaceIntentDto) {
    return this.prisma.marketplaceIntent.create({
      data: {
        creator,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        difficulty: dto.difficulty,
        template: dto.template,
        icon: dto.icon,
        tags: dto.tags || [],
        isPublic: dto.isPublic ?? true,
      },
    });
  }

  async findAll(filters?: {
    category?: string;
    difficulty?: string;
    isFeatured?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search.toLowerCase() } },
      ];
    }

    where.isPublic = true;

    const [intents, total] = await Promise.all([
      this.prisma.marketplaceIntent.findMany({
        where,
        orderBy: [
          { isFeatured: 'desc' },
          { usageCount: 'desc' },
          { rating: 'desc' },
        ],
        include: {
          _count: {
            select: { usages: true, ratings: true },
          },
        },
      }),
      this.prisma.marketplaceIntent.count({ where }),
    ]);

    return { intents, total };
  }

  async findOne(id: string) {
    const intent = await this.prisma.marketplaceIntent.findUnique({
      where: { id },
      include: {
        usages: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        ratings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { usages: true, ratings: true },
        },
      },
    });

    if (!intent) {
      throw new NotFoundException('Marketplace intent not found');
    }

    return intent;
  }

  async rateIntent(marketplaceIntentId: string, userId: string, dto: RateIntentDto) {
    // Upsert rating
    await this.prisma.intentRating.upsert({
      where: {
        marketplaceIntentId_userId: {
          marketplaceIntentId,
          userId,
        },
      },
      create: {
        marketplaceIntentId,
        userId,
        rating: dto.rating,
        review: dto.review,
      },
      update: {
        rating: dto.rating,
        review: dto.review,
      },
    });

    // Recalculate average rating
    const ratings = await this.prisma.intentRating.findMany({
      where: { marketplaceIntentId },
    });

    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await this.prisma.marketplaceIntent.update({
      where: { id: marketplaceIntentId },
      data: {
        rating: avgRating,
        ratingCount: ratings.length,
      },
    });

    return { success: true, avgRating, ratingCount: ratings.length };
  }

  async cloneIntent(marketplaceIntentId: string, dto: CloneIntentDto) {
    // Record usage
    const usage = await this.prisma.intentUsage.create({
      data: {
        marketplaceIntentId,
        userId: dto.userId,
        intentId: dto.intentId,
        success: dto.success ?? false,
        gasSaved: dto.gasSaved,
        executionTime: dto.executionTime,
      },
    });

    // Increment usage count
    await this.prisma.marketplaceIntent.update({
      where: { id: marketplaceIntentId },
      data: {
        usageCount: { increment: 1 },
      },
    });

    // Update success rate if provided
    if (dto.success !== undefined) {
      const usages = await this.prisma.intentUsage.findMany({
        where: { marketplaceIntentId },
      });

      const successCount = usages.filter((u) => u.success).length;
      const successRate = (successCount / usages.length) * 100;

      await this.prisma.marketplaceIntent.update({
        where: { id: marketplaceIntentId },
        data: { successRate },
      });
    }

    return usage;
  }

  async getLeaderboard(limit = 10) {
    return this.prisma.marketplaceIntent.findMany({
      where: { isPublic: true },
      orderBy: [
        { usageCount: 'desc' },
        { rating: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        icon: true,
        usageCount: true,
        rating: true,
        ratingCount: true,
        successRate: true,
      },
    });
  }

  async getCategories() {
    const intents = await this.prisma.marketplaceIntent.findMany({
      where: { isPublic: true },
      select: { category: true },
    });

    const categoryCounts = intents.reduce((acc, intent) => {
      acc[intent.category] = (acc[intent.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  }

  async seedTemplates() {
    const templates = [
      {
        creator: 'system',
        name: 'Quick USDC Transfer',
        description: 'Send USDC to any address instantly',
        category: 'transfer',
        difficulty: 'beginner',
        template: { command: 'send {{amount}} USDC to {{recipient}}' },
        icon: '💵',
        tags: ['usdc', 'transfer', 'stablecoin'],
        isFeatured: true,
      },
      {
        creator: 'system',
        name: 'Quick USDT Transfer',
        description: 'Send USDT to any address instantly',
        category: 'transfer',
        difficulty: 'beginner',
        template: { command: 'send {{amount}} USDT to {{recipient}}' },
        icon: '💵',
        tags: ['usdt', 'transfer', 'stablecoin'],
      },
      {
        creator: 'system',
        name: 'Native DEV Transfer',
        description: 'Send native DEV tokens to any address',
        category: 'transfer',
        difficulty: 'beginner',
        template: { command: 'send {{amount}} DEV to {{recipient}}' },
        icon: '💎',
        tags: ['dev', 'transfer', 'native'],
        isFeatured: true,
      },
      {
        creator: 'system',
        name: 'Bridge to Polkadot',
        description: 'Transfer tokens to Polkadot Relay Chain via XCM',
        category: 'cross-chain',
        difficulty: 'intermediate',
        template: { command: 'send {{amount}} DOT to polkadot {{recipient}}' },
        icon: '🌉',
        tags: ['xcm', 'bridge', 'polkadot', 'cross-chain'],
        isFeatured: true,
      },
      {
        creator: 'system',
        name: 'Bridge to Asset Hub',
        description: 'Transfer tokens to Asset Hub parachain',
        category: 'cross-chain',
        difficulty: 'intermediate',
        template: { command: 'send {{amount}} DOT to assethub {{recipient}}' },
        icon: '🏦',
        tags: ['xcm', 'bridge', 'assethub', 'cross-chain'],
      },
      {
        creator: 'system',
        name: 'Bridge to Moonbeam',
        description: 'Transfer tokens to Moonbeam parachain',
        category: 'cross-chain',
        difficulty: 'intermediate',
        template: { command: 'send {{amount}} GLMR to moonbeam {{recipient}}' },
        icon: '🌙',
        tags: ['xcm', 'bridge', 'moonbeam', 'cross-chain'],
      },
      {
        creator: 'system',
        name: 'Bridge USDC to AssetHub',
        description: 'Cross-chain stablecoin transfer via XCM',
        category: 'cross-chain',
        difficulty: 'intermediate',
        template: { command: 'send {{amount}} USDC to assethub {{recipient}}' },
        icon: '🔗',
        tags: ['xcm', 'bridge', 'usdc', 'stablecoin'],
      },
      {
        creator: 'system',
        name: 'Bridge to Acala',
        description: 'Transfer to Acala DeFi hub',
        category: 'cross-chain',
        difficulty: 'intermediate',
        template: { command: 'send {{amount}} USDC to acala {{recipient}}' },
        icon: '⭐',
        tags: ['xcm', 'bridge', 'acala', 'defi'],
      },
      {
        creator: 'system',
        name: 'Swap USDC for DOT',
        description: 'Exchange stablecoins for native tokens',
        category: 'defi',
        difficulty: 'intermediate',
        template: { command: 'swap {{amount}} USDC for DOT on Polkadot Hub' },
        icon: '🔄',
        tags: ['swap', 'defi', 'usdc', 'dot'],
        isFeatured: true,
      },
      {
        creator: 'system',
        name: 'Provide Liquidity',
        description: 'Earn fees by providing liquidity',
        category: 'defi',
        difficulty: 'advanced',
        template: { command: 'provide {{amount1}} USDC + {{amount2}} USDT liquidity' },
        icon: '💧',
        tags: ['liquidity', 'defi', 'yield'],
      },
      {
        creator: 'system',
        name: 'Lend USDC',
        description: 'Earn interest on stablecoins',
        category: 'defi',
        difficulty: 'advanced',
        template: { command: 'lend {{amount}} USDC on Aave' },
        icon: '🏦',
        tags: ['lending', 'defi', 'aave', 'yield'],
      },
      {
        creator: 'system',
        name: 'Swap & Stake',
        description: 'Multi-step DeFi operation',
        category: 'defi',
        difficulty: 'advanced',
        template: { command: 'swap {{amount}} USDC for DOT and stake on Polkadot' },
        icon: '⚡',
        tags: ['swap', 'stake', 'defi', 'workflow'],
      },
      {
        creator: 'system',
        name: 'Stake DOT',
        description: 'Earn staking rewards on Polkadot',
        category: 'staking',
        difficulty: 'intermediate',
        template: { command: 'stake {{amount}} DOT on Polkadot Relay Chain' },
        icon: '🔒',
        tags: ['staking', 'dot', 'polkadot'],
      },
      {
        creator: 'system',
        name: 'Delegate to Validator',
        description: 'Support network security and earn rewards',
        category: 'staking',
        difficulty: 'intermediate',
        template: { command: 'delegate {{amount}} DOT to validator {{validator}}' },
        icon: '🎯',
        tags: ['staking', 'delegation', 'validator'],
      },
      {
        creator: 'system',
        name: 'Vote on Referendum',
        description: 'Participate in Polkadot governance',
        category: 'governance',
        difficulty: 'intermediate',
        template: { command: 'vote {{vote}} on referendum #{{number}}' },
        icon: '🗳️',
        tags: ['governance', 'voting', 'polkadot'],
      },
    ];

    const existing = await this.prisma.marketplaceIntent.count();
    if (existing > 0) {
      return { message: 'Templates already seeded', count: existing };
    }

    await this.prisma.marketplaceIntent.createMany({
      data: templates,
    });

    return { message: 'Templates seeded successfully', count: templates.length };
  }
}
