'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { INTENT_REGISTRY_ADDRESS } from '@/lib/constants';
import { INTENT_REGISTRY_ABI } from '@/lib/abis';
import { formatAddress, formatEther } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AnalyticsPage() {
  const publicClient = usePublicClient();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!publicClient) return;

    try {
      const intentIds = (await publicClient.readContract({
        address: INTENT_REGISTRY_ADDRESS as `0x${string}`,
        abi: INTENT_REGISTRY_ABI,
        functionName: 'getAllIntentIds',
      })) as string[];

      let completed = 0;
      let failed = 0;
      let pending = 0;
      let executing = 0;
      let totalVolume = BigInt(0);
      const recentActivity: any[] = [];
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
          const statusName = ['Pending', 'Executing', 'Completed', 'Failed', 'Cancelled'][status];

          if (status === 0) pending++;
          else if (status === 1) executing++;
          else if (status === 2) {
            completed++;
            totalVolume += intent[4];
            if (intent[7] !== '0x0000000000000000000000000000000000000000') {
              solvers.add(intent[7]);
            }
          } else if (status === 3) failed++;

          recentActivity.push({
            id: intentId,
            description: intent[2],
            status: statusName,
            creator: intent[0],
            reward: intent[4].toString(),
            createdAt: new Date(Number(intent[8]) * 1000).toISOString(),
          });
        } catch (err) {
          // Skip invalid intents
        }
      }

      const total = intentIds.length;
      const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

      setData({
        stats: {
          totalIntents: total,
          completedIntents: completed,
          failedIntents: failed,
          pendingIntents: pending,
          totalSolvers: solvers.size,
          successRate,
          totalVolume: totalVolume.toString(),
        },
        intentsByStatus: [
          { status: 'PENDING', count: pending },
          { status: 'EXECUTING', count: executing },
          { status: 'COMPLETED', count: completed },
          { status: 'FAILED', count: failed },
        ].filter(s => s.count > 0),
        recentActivity: recentActivity.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 10),
        topSolvers: Array.from(solvers).map((address, index) => ({
          address,
          totalExecuted: completed, // Simplified for demo
          reputation: 100 - (index * 10),
        })).slice(0, 5),
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const COLORS = {
    PENDING: '#00D9FF',
    EXECUTING: '#FF006E',
    COMPLETED: '#00FF41',
    FAILED: '#EF4444',
    CANCELLED: '#64748b',
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        {loading ? (
          <div className="glass-panel p-12 rounded-lg text-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="glass-panel p-12 rounded-lg text-center">
            <p className="text-red-400 mb-2">{error}</p>
            <p className="text-slate-500 text-sm">Please check your connection</p>
          </div>
        ) : data ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-lg border-cyber-blue/30">
                <p className="text-xs font-orbitron text-slate-500 uppercase mb-2">Total Intents</p>
                <p className="text-3xl font-bold text-cyber-blue">{data.stats.totalIntents}</p>
              </div>
              <div className="glass-panel p-4 rounded-lg border-cyber-green/30">
                <p className="text-xs font-orbitron text-slate-500 uppercase mb-2">Completed</p>
                <p className="text-3xl font-bold text-cyber-green">{data.stats.completedIntents}</p>
              </div>
              <div className="glass-panel p-4 rounded-lg border-cyber-pink/30">
                <p className="text-xs font-orbitron text-slate-500 uppercase mb-2">Success Rate</p>
                <p className="text-3xl font-bold text-cyber-pink">{data.stats.successRate}%</p>
              </div>
              <div className="glass-panel p-4 rounded-lg border-slate-600/30">
                <p className="text-xs font-orbitron text-slate-500 uppercase mb-2">Total Volume</p>
                <p className="text-3xl font-bold text-white">{(Number(data.stats.totalVolume) / 1e18).toFixed(4)} PAS</p>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="glass-panel p-6 rounded-lg border-cyber-pink/30">
              <h3 className="text-lg font-orbitron text-white mb-4">Intents by Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.intentsByStatus.map((item: any) => (
                  <div key={item.status} className="bg-black/40 rounded-lg p-4 border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase mb-2">{item.status}</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS[item.status as keyof typeof COLORS] }}>
                      {item.count}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity & Top Solvers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="glass-panel p-6 rounded-lg border-cyber-green/30">
                <h3 className="text-lg font-orbitron text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {data.recentActivity.slice(0, 5).map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between p-3 bg-black/40 rounded border border-slate-800"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-white mb-1 line-clamp-1">{activity.description}</p>
                        <p className="text-xs text-slate-500 font-mono">
                          {formatAddress(activity.creator)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          activity.status === 'Completed'
                            ? 'green'
                            : activity.status === 'Executing'
                            ? 'pink'
                            : activity.status === 'Failed'
                            ? 'red'
                            : 'blue'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Solvers */}
              <div className="glass-panel p-6 rounded-lg border-cyber-pink/30">
                <h3 className="text-lg font-orbitron text-white mb-4">Top Solvers</h3>
                <div className="space-y-3">
                  {data.topSolvers.map((solver: any, index: number) => (
                    <div
                      key={solver.address}
                      className="flex items-center justify-between p-3 bg-black/40 rounded border border-slate-800"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-orbitron text-cyber-pink font-bold">#{index + 1}</span>
                        <span className="font-mono text-white text-sm">
                          {formatAddress(solver.address)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-cyber-green font-bold">{solver.reputation}</p>
                        <p className="text-xs text-slate-500">{solver.totalExecuted} completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        <Footer />
      </div>
    </main>
  );
}
