'use client';

import { GasOptimizationMetrics } from '@/hooks/useUserAnalytics';

interface GasOptimizationChartProps {
  metrics: GasOptimizationMetrics;
}

export default function GasOptimizationChart({ metrics }: GasOptimizationChartProps) {
  const totalGasSavedGwei = (Number(metrics.totalGasSaved) / 1e9).toFixed(2);
  const avgGasSavedGwei = (Number(metrics.avgGasSavedPerIntent) / 1e9).toFixed(2);

  return (
    <div className="glass-panel rounded-lg overflow-hidden purple-glow-border">
      <div className="bg-purple-500/10 px-4 py-2 border-b border-purple-500/30">
        <span className="text-[10px] font-orbitron text-purple-400 uppercase tracking-widest">
          Gas_Optimization_Metrics
        </span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Gas Saved */}
          <div className="bg-black/40 rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400 uppercase mb-1">Total Gas Saved</div>
                <div className="text-4xl font-orbitron text-purple-400">{totalGasSavedGwei}</div>
                <div className="text-xs text-gray-500 mt-1">Gwei</div>
              </div>
              <div className="text-5xl">⚡</div>
            </div>
            <div className="h-2 bg-black/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyber-blue"
                style={{ width: `${Math.min(Number(metrics.optimizationRate), 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {metrics.optimizationRate}% optimization rate
            </div>
          </div>

          {/* Average Gas Saved */}
          <div className="bg-black/40 rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400 uppercase mb-1">Avg Gas Saved Per Intent</div>
                <div className="text-4xl font-orbitron text-purple-400">{avgGasSavedGwei}</div>
                <div className="text-xs text-gray-500 mt-1">Gwei</div>
              </div>
              <div className="text-5xl">📊</div>
            </div>
            <div className="text-sm text-gray-300">
              Across <span className="text-cyber-blue font-bold">{metrics.totalExecutions}</span> successful executions
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-orbitron text-white text-sm mb-1">How Gas Optimization Works</h4>
              <p className="text-xs text-gray-400">
                Intent-based execution optimizes gas usage by batching operations, finding efficient routes,
                and leveraging solver competition. Compared to direct transactions, you save an average of{' '}
                <span className="text-purple-400 font-bold">{metrics.optimizationRate}%</span> on gas costs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
