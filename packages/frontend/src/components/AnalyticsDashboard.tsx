'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { INTENT_REGISTRY_ADDRESS } from '@/lib/constants';
import { INTENT_REGISTRY_ABI } from '@/lib/abis';

interface Analytics {
  totalIntents: number;
  completedIntents: number;
  failedIntents: number;
  avgExecutionTime: string;
  successRate: string;
  totalRewardsDistributed: string;
  activeSolvers: number;
}

export default function AnalyticsDashboard() {
  const publicClient = usePublicClient();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalIntents: 0,
    completedIntents: 0,
    failedIntents: 0,
    avgExecutionTime: '0s',
    successRate: '0%',
    totalRewardsDistributed: '0',
    activeSolvers: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    if (!publicClient) return;

    try {
      const intentIds = (await publicClient.readContract({
        address: INTENT_REGISTRY_ADDRESS as `0x${string}`,
        abi: INTENT_REGISTRY_ABI,
        functionName: 'getAllIntentIds',
      })) as string[];

      let completed = 0;
      let failed = 0;
      let totalExecutionTime = 0;
      let totalRewards = BigInt(0);
      const solvers = new Set<string>();

      for (const intentId of intentIds) {
        try {
          const intent = (await publicClient.readContract({
            address: INTENT_REGISTRY_ADDRESS as `0x${string}`,
            abi: INTENT_REGISTRY_ABI,
            functionName: 'intents',
            args: [intentId as `0x${string}`],
          })) as any;

          const status = intent[6];

          if (status === 2) {
            completed++;
            totalRewards += intent[4];
            if (intent[7] !== '0x0000000000000000000000000000000000000000') {
              solvers.add(intent[7]);
            }
            
            const createdAt = Number(intent[8]);
            const executedAt = Number(intent[9]);
            if (executedAt > 0) {
              totalExecutionTime += executedAt - createdAt;
            }
          } else if (status === 3) {
            failed++;
          }
        } catch (err) {
          // Skip invalid intents
        }
      }

      const total = intentIds.length;
      const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
      const avgTime = completed > 0 ? Math.floor(totalExecutionTime / completed) : 0;

      setAnalytics({
        totalIntents: total,
        completedIntents: completed,
        failedIntents: failed,
        avgExecutionTime: formatTime(avgTime),
        successRate: `${successRate}%`,
        totalRewardsDistributed: (Number(totalRewards) / 1e18).toFixed(4),
        activeSolvers: solvers.size,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [loadAnalytics]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-cyber-blue/20 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-cyber-blue/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Intents',
      value: analytics.totalIntents,
      color: 'text-cyber-blue',
      icon: '📊',
    },
    {
      label: 'Success Rate',
      value: analytics.successRate,
      color: 'text-cyber-green',
      icon: '✅',
    },
    {
      label: 'Avg Execution',
      value: analytics.avgExecutionTime,
      color: 'text-purple-400',
      icon: '⚡',
    },
    {
      label: 'Active Solvers',
      value: analytics.activeSolvers,
      color: 'text-cyber-pink',
      icon: '🤖',
    },
    {
      label: 'Completed',
      value: analytics.completedIntents,
      color: 'text-green-400',
      icon: '🎯',
    },
    {
      label: 'Failed',
      value: analytics.failedIntents,
      color: 'text-red-400',
      icon: '❌',
    },
    {
      label: 'Total Rewards',
      value: `${analytics.totalRewardsDistributed} PAS`,
      color: 'text-yellow-400',
      icon: '💰',
    },
    {
      label: 'Network',
      value: 'Polkadot Hub',
      color: 'text-cyber-blue',
      icon: '🌐',
    },
  ];

  return (
    <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
      <div className="bg-cyber-blue/10 px-4 py-2 border-b border-cyber-blue/30">
        <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
          Live_Analytics_Dashboard
        </span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-black/40 rounded-lg p-4 border border-cyber-blue/20 hover:border-cyber-blue/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{metric.icon}</span>
                <div className={`text-xs font-orbitron ${metric.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                  LIVE
                </div>
              </div>
              <div className={`text-2xl font-bold font-orbitron ${metric.color} mb-1`}>
                {metric.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-cyber-blue/5 rounded-lg border border-cyber-blue/20">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
            <span className="text-gray-300">
              Real-time analytics powered by Polkadot Hub TestNet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
