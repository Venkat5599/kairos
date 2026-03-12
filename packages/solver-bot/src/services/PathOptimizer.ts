import { logger } from '../utils/logger';
import { ParsedIntent } from './IntentParser';

export interface RouteNode {
  address: string;
  type: 'dex' | 'bridge' | 'wallet' | 'contract';
  gasCost: number;
  timeCost: number;
  liquidityScore?: number;
}

export interface OptimizedPath {
  nodes: RouteNode[];
  totalGas: number;
  totalTime: number;
  score: number;
  estimatedCost: bigint;
}

export class PathOptimizer {
  private readonly gasPrice: bigint = BigInt(1000000000); // 1 gwei default

  /**
   * Find optimal path using modified Dijkstra's algorithm
   */
  async findOptimalPath(
    parsed: ParsedIntent,
    availableRoutes: RouteNode[][]
  ): Promise<OptimizedPath> {
    if (availableRoutes.length === 0) {
      return this.createDirectPath(parsed);
    }

    // Score each route
    const scoredRoutes = availableRoutes.map((route) =>
      this.scoreRoute(route)
    );

    // Sort by score (higher is better)
    scoredRoutes.sort((a, b) => b.score - a.score);

    const bestRoute = scoredRoutes[0];

    logger.info('Optimal path found', {
      nodes: bestRoute.nodes.length,
      totalGas: bestRoute.totalGas,
      totalTime: bestRoute.totalTime,
      score: bestRoute.score,
    });

    return bestRoute;
  }

  /**
   * Generate possible routes based on intent
   */
  generateRoutes(parsed: ParsedIntent): RouteNode[][] {
    const routes: RouteNode[][] = [];

    switch (parsed.action) {
      case 'send':
        routes.push(this.generateDirectRoute(parsed));
        break;

      case 'swap':
        routes.push(this.generateSwapRoute(parsed));
        routes.push(this.generateAggregatorRoute(parsed));
        break;

      case 'bridge':
        routes.push(this.generateBridgeRoute(parsed));
        break;

      case 'complex':
        routes.push(...this.generateComplexRoutes(parsed));
        break;
    }

    return routes;
  }

  private generateDirectRoute(parsed: ParsedIntent): RouteNode[] {
    return [
      {
        address: parsed.destination || '0x0',
        type: 'wallet',
        gasCost: 21000,
        timeCost: 15,
      },
    ];
  }

  private generateSwapRoute(parsed: ParsedIntent): RouteNode[] {
    return [
      {
        address: '0xDEXRouter',
        type: 'dex',
        gasCost: 150000,
        timeCost: 30,
        liquidityScore: 0.8,
      },
      {
        address: parsed.destination || '0x0',
        type: 'wallet',
        gasCost: 21000,
        timeCost: 5,
      },
    ];
  }

  private generateAggregatorRoute(parsed: ParsedIntent): RouteNode[] {
    return [
      {
        address: '0xAggregator',
        type: 'contract',
        gasCost: 200000,
        timeCost: 45,
        liquidityScore: 0.95,
      },
      {
        address: parsed.destination || '0x0',
        type: 'wallet',
        gasCost: 21000,
        timeCost: 5,
      },
    ];
  }

  private generateBridgeRoute(parsed: ParsedIntent): RouteNode[] {
    return [
      {
        address: '0xXCMBridge',
        type: 'bridge',
        gasCost: 300000,
        timeCost: 120,
      },
      {
        address: parsed.destination || '0x0',
        type: 'wallet',
        gasCost: 50000,
        timeCost: 30,
      },
    ];
  }

  private generateComplexRoutes(parsed: ParsedIntent): RouteNode[][] {
    // For complex intents, generate multiple possible paths
    return [
      this.generateDirectRoute(parsed),
      this.generateSwapRoute(parsed),
    ];
  }

  private scoreRoute(route: RouteNode[]): OptimizedPath {
    let totalGas = 0;
    let totalTime = 0;
    let liquidityScore = 1.0;

    for (const node of route) {
      totalGas += node.gasCost;
      totalTime += node.timeCost;

      if (node.liquidityScore) {
        liquidityScore *= node.liquidityScore;
      }
    }

    const estimatedCost = BigInt(totalGas) * this.gasPrice;

    // Scoring formula: balance gas, time, and liquidity
    // Lower gas and time = higher score
    // Higher liquidity = higher score
    const gasScore = 1 / (1 + totalGas / 100000);
    const timeScore = 1 / (1 + totalTime / 60);
    const liquidityWeight = liquidityScore;

    const score = gasScore * 0.3 + timeScore * 0.2 + liquidityWeight * 0.5;

    return {
      nodes: route,
      totalGas,
      totalTime,
      score,
      estimatedCost,
    };
  }

  private createDirectPath(parsed: ParsedIntent): OptimizedPath {
    const route = this.generateDirectRoute(parsed);
    return this.scoreRoute(route);
  }

  /**
   * Compare multiple paths and select best
   */
  comparePaths(paths: OptimizedPath[]): OptimizedPath {
    if (paths.length === 0) {
      throw new Error('No paths to compare');
    }

    // Sort by score descending
    paths.sort((a, b) => b.score - a.score);

    logger.info('Path comparison', {
      totalPaths: paths.length,
      bestScore: paths[0].score,
      worstScore: paths[paths.length - 1].score,
    });

    return paths[0];
  }

  /**
   * Estimate slippage for a given path
   */
  estimateSlippage(path: OptimizedPath, amount: number): number {
    // Simple slippage model based on liquidity
    let totalSlippage = 0;

    for (const node of path.nodes) {
      if (node.type === 'dex' && node.liquidityScore) {
        // Lower liquidity = higher slippage
        const slippage = (1 - node.liquidityScore) * 0.05; // Max 5% slippage
        totalSlippage += slippage;
      }
    }

    return Math.min(totalSlippage, 0.1); // Cap at 10%
  }
}
