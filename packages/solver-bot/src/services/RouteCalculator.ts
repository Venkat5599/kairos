import { logger } from '../utils/logger';
import { IntentParser, ParsedIntent } from './IntentParser';
import { PathOptimizer, OptimizedPath } from './PathOptimizer';
import { ProfitabilityCalculator, ProfitabilityAnalysis } from './ProfitabilityCalculator';
import { ethers } from 'ethers';

export interface Route {
  type: 'DIRECT' | 'SWAP' | 'CROSS_CHAIN' | 'COMPLEX';
  path: string[];
  estimatedGas: number;
  estimatedTime: number;
  additionalData?: any;
  parsedIntent?: ParsedIntent;
  optimizedPath?: OptimizedPath;
  profitability?: ProfitabilityAnalysis;
  mlScore?: number;
}

export class RouteCalculator {
  private intentParser: IntentParser;
  private pathOptimizer: PathOptimizer;
  private profitabilityCalculator: ProfitabilityCalculator;
  private provider: ethers.Provider;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
    this.intentParser = new IntentParser();
    this.pathOptimizer = new PathOptimizer();
    this.profitabilityCalculator = new ProfitabilityCalculator(provider);
  }

  async calculateRoute(intent: any): Promise<Route | null> {
    try {
      logger.info('Calculating intelligent route', { intentId: intent.id });

      // Step 1: Parse intent using NLP
      const parsedIntent = this.intentParser.parseIntent(intent.description);

      // Validate parsed intent
      const validation = this.intentParser.validateIntent(parsedIntent);
      if (!validation.valid) {
        logger.warn('Intent validation failed', { errors: validation.errors });
        return this.calculateFallbackRoute(intent);
      }

      // Step 2: Generate possible routes
      const possibleRoutes = this.pathOptimizer.generateRoutes(parsedIntent);

      // Step 3: Find optimal path
      const optimizedPath = await this.pathOptimizer.findOptimalPath(
        parsedIntent,
        possibleRoutes
      );

      // Step 4: Calculate slippage
      const slippage = this.pathOptimizer.estimateSlippage(
        optimizedPath,
        parsedIntent.amount || 0
      );

      // Step 5: Analyze profitability
      const reward = BigInt(intent.reward);
      const profitability = await this.profitabilityCalculator.calculateProfitability(
        reward,
        optimizedPath,
        slippage
      );

      // Step 6: Check if profitable
      if (!this.profitabilityCalculator.shouldExecute(profitability)) {
        logger.warn('Intent not profitable, skipping', {
          intentId: intent.id,
          profitMargin: profitability.profitMargin,
        });
        return null;
      }

      // Step 7: Calculate ML score with historical data
      const historicalData = await this.getHistoricalData(parsedIntent.action);
      const mlScore = this.profitabilityCalculator.scoreRouteWithML(
        optimizedPath,
        profitability,
        historicalData
      );

      // Step 8: Build final route
      const route: Route = {
        type: this.mapActionToType(parsedIntent.action),
        path: optimizedPath.nodes.map((n) => n.address),
        estimatedGas: optimizedPath.totalGas,
        estimatedTime: optimizedPath.totalTime,
        parsedIntent,
        optimizedPath,
        profitability,
        mlScore,
        additionalData: {
          confidence: parsedIntent.confidence,
          slippage,
          roi: this.profitabilityCalculator.calculateROI(profitability),
        },
      };

      logger.info('Intelligent route calculated', {
        type: route.type,
        gas: route.estimatedGas,
        time: route.estimatedTime,
        profitable: profitability.isProfitable,
        mlScore,
      });

      return route;
    } catch (error) {
      logger.error('Error calculating route', { error });
      return this.calculateFallbackRoute(intent);
    }
  }

  /**
   * Fallback to simple keyword-based routing
   */
  private calculateFallbackRoute(intent: any): Route {
    const description = intent.description.toLowerCase();

    if (description.includes('cross-chain') || description.includes('send to')) {
      return this.calculateCrossChainRoute(intent);
    } else if (description.includes('swap')) {
      return this.calculateSwapRoute(intent);
    } else if (description.includes('send') || description.includes('transfer')) {
      return this.calculateDirectRoute(intent);
    } else {
      return this.calculateComplexRoute(intent);
    }
  }

  private calculateDirectRoute(intent: any): Route {
    return {
      type: 'DIRECT',
      path: [intent.creator],
      estimatedGas: 50000,
      estimatedTime: 15,
    };
  }

  private calculateSwapRoute(intent: any): Route {
    return {
      type: 'SWAP',
      path: [intent.creator, '0xSwapRouter', '0xDestination'],
      estimatedGas: 150000,
      estimatedTime: 30,
    };
  }

  private calculateCrossChainRoute(intent: any): Route {
    return {
      type: 'CROSS_CHAIN',
      path: [intent.creator, '0xXCMBridge', '0xDestinationChain'],
      estimatedGas: 300000,
      estimatedTime: 120,
      additionalData: {
        destinationChain: 2000, // Moonbeam
        bridgeFee: '0.01',
      },
    };
  }

  private calculateComplexRoute(intent: any): Route {
    return {
      type: 'COMPLEX',
      path: [intent.creator, '0xStep1', '0xStep2', '0xStep3'],
      estimatedGas: 500000,
      estimatedTime: 300,
    };
  }

  estimateCost(route: Route): bigint {
    if (route.profitability) {
      return route.profitability.estimatedCost;
    }

    // Fallback estimation
    const gasPrice = BigInt(1000000000); // 1 gwei
    const gasCost = BigInt(route.estimatedGas) * gasPrice;

    return gasCost;
  }

  private mapActionToType(action: ParsedIntent['action']): Route['type'] {
    switch (action) {
      case 'send':
        return 'DIRECT';
      case 'swap':
        return 'SWAP';
      case 'bridge':
        return 'CROSS_CHAIN';
      default:
        return 'COMPLEX';
    }
  }

  /**
   * Get historical execution data for ML scoring
   */
  private async getHistoricalData(action: string): Promise<{
    successRate: number;
    avgTime: number;
    totalExecutions: number;
  }> {
    // In production, this would query the database
    // For now, return mock data
    return {
      successRate: 0.85,
      avgTime: 45,
      totalExecutions: 50,
    };
  }
}
