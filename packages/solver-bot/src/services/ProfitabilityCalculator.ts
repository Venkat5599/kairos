import { logger } from '../utils/logger';
import { OptimizedPath } from './PathOptimizer';
import { ethers } from 'ethers';

export interface ProfitabilityAnalysis {
  reward: bigint;
  estimatedCost: bigint;
  profit: bigint;
  profitMargin: number;
  isProfitable: boolean;
  breakdownCosts: {
    gas: bigint;
    bridgeFees: bigint;
    slippage: bigint;
    total: bigint;
  };
}

export class ProfitabilityCalculator {
  private provider: ethers.Provider;
  private readonly MIN_PROFIT_MARGIN = 0.1; // 10% minimum profit margin

  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }

  /**
   * Calculate profitability of executing an intent
   */
  async calculateProfitability(
    reward: bigint,
    path: OptimizedPath,
    slippagePercent: number
  ): Promise<ProfitabilityAnalysis> {
    // Get current gas price
    const feeData = await this.provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(1000000000); // 1 gwei fallback

    // Calculate gas cost
    const gasCost = BigInt(path.totalGas) * gasPrice;

    // Calculate bridge fees (if applicable)
    const bridgeFees = this.calculateBridgeFees(path);

    // Calculate slippage cost
    const slippageCost = (reward * BigInt(Math.floor(slippagePercent * 10000))) / BigInt(10000);

    // Total cost
    const totalCost = gasCost + bridgeFees + slippageCost;

    // Profit calculation
    const profit = reward - totalCost;
    const profitMargin = Number(profit) / Number(reward);

    const isProfitable = profit > 0 && profitMargin >= this.MIN_PROFIT_MARGIN;

    logger.info('Profitability analysis', {
      reward: ethers.formatEther(reward),
      totalCost: ethers.formatEther(totalCost),
      profit: ethers.formatEther(profit),
      profitMargin: `${(profitMargin * 100).toFixed(2)}%`,
      isProfitable,
    });

    return {
      reward,
      estimatedCost: totalCost,
      profit,
      profitMargin,
      isProfitable,
      breakdownCosts: {
        gas: gasCost,
        bridgeFees,
        slippage: slippageCost,
        total: totalCost,
      },
    };
  }

  /**
   * Calculate bridge fees based on path
   */
  private calculateBridgeFees(path: OptimizedPath): bigint {
    let fees = BigInt(0);

    for (const node of path.nodes) {
      if (node.type === 'bridge') {
        fees += ethers.parseEther('0.01'); // Base bridge fee
      }
    }

    return fees;
  }

  /**
   * Estimate gas price with buffer
   */
  async estimateGasPriceWithBuffer(bufferPercent: number = 10): Promise<bigint> {
    const feeData = await this.provider.getFeeData();
    const gasPrice = feeData.gasPrice || BigInt(1000000000);

    // Add buffer for gas price volatility
    const buffer = (gasPrice * BigInt(bufferPercent)) / BigInt(100);

    return gasPrice + buffer;
  }

  /**
   * Calculate break-even reward
   */
  async calculateBreakEvenReward(
    path: OptimizedPath,
    slippagePercent: number
  ): Promise<bigint> {
    const gasPrice = await this.estimateGasPriceWithBuffer();
    const gasCost = BigInt(path.totalGas) * gasPrice;
    const bridgeFees = this.calculateBridgeFees(path);

    // Break-even = costs / (1 - slippage - min_margin)
    const effectiveRate = 1 - slippagePercent - this.MIN_PROFIT_MARGIN;
    const breakEven = (gasCost + bridgeFees) / BigInt(Math.floor(effectiveRate * 100)) * BigInt(100);

    return breakEven;
  }

  /**
   * Compare profitability of multiple paths
   */
  async compareProfitability(
    reward: bigint,
    paths: OptimizedPath[],
    slippagePercent: number
  ): Promise<ProfitabilityAnalysis[]> {
    const analyses = await Promise.all(
      paths.map((path) => this.calculateProfitability(reward, path, slippagePercent))
    );

    // Sort by profit descending
    analyses.sort((a, b) => Number(b.profit - a.profit));

    return analyses;
  }

  /**
   * Calculate ROI (Return on Investment)
   */
  calculateROI(analysis: ProfitabilityAnalysis): number {
    if (analysis.estimatedCost === BigInt(0)) return 0;

    return Number(analysis.profit) / Number(analysis.estimatedCost);
  }

  /**
   * Determine if intent should be executed based on profitability
   */
  shouldExecute(analysis: ProfitabilityAnalysis, minROI: number = 0.2): boolean {
    if (!analysis.isProfitable) return false;

    const roi = this.calculateROI(analysis);

    return roi >= minROI;
  }

  /**
   * Calculate historical success rate weighted score
   */
  calculateHistoricalScore(
    successRate: number,
    avgExecutionTime: number,
    totalExecutions: number
  ): number {
    // Weight factors
    const successWeight = 0.5;
    const timeWeight = 0.3;
    const volumeWeight = 0.2;

    // Normalize metrics
    const successScore = successRate;
    const timeScore = Math.max(0, 1 - avgExecutionTime / 300); // Normalize to 5 min max
    const volumeScore = Math.min(1, totalExecutions / 100); // Normalize to 100 executions

    return (
      successScore * successWeight +
      timeScore * timeWeight +
      volumeScore * volumeWeight
    );
  }

  /**
   * Machine learning route scoring
   */
  scoreRouteWithML(
    path: OptimizedPath,
    profitability: ProfitabilityAnalysis,
    historicalData: {
      successRate: number;
      avgTime: number;
      totalExecutions: number;
    }
  ): number {
    // Weight factors for ML scoring
    const weights = {
      gasCost: 0.3,
      time: 0.2,
      successRate: 0.3,
      profitMargin: 0.2,
    };

    // Normalize and score each factor
    const gasCostScore = 1 / (1 + Number(profitability.breakdownCosts.gas) / 1e18);
    const timeScore = 1 / (1 + path.totalTime / 60);
    const successScore = historicalData.successRate;
    const profitScore = Math.max(0, profitability.profitMargin);

    const finalScore =
      gasCostScore * weights.gasCost +
      timeScore * weights.time +
      successScore * weights.successRate +
      profitScore * weights.profitMargin;

    logger.info('ML route scoring', {
      gasCostScore,
      timeScore,
      successScore,
      profitScore,
      finalScore,
    });

    return finalScore;
  }
}
