'use client';

import { UserAnalytics } from '@/hooks/useUserAnalytics';
import { formatEther } from '@/lib/utils';

interface UserStatsCardProps {
  analytics: UserAnalytics;
  address: string;
}

export default function UserStatsCard({ analytics, address }: UserStatsCardProps) {
  return (
    <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
      <div className="bg-cyber-blue/10 px-4 py-2 border-b border-cyber-blue/30">
        <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
          Your_Analytics
        </span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/40 rounded p-4 border border-cyber-blue/20">
            <div className="text-xs text-gray-400 uppercase mb-1">Total Intents</div>
            <div className="text-3xl font-orbitron text-cyber-blue">{analytics.totalIntents}</div>
          </div>

          <div className="bg-black/40 rounded p-4 border border-cyber-green/20">
            <div className="text-xs text-gray-400 uppercase mb-1">Completed</div>
            <div className="text-3xl font-orbitron text-cyber-green">{analytics.completedIntents}</div>
          </div>

          <div className="bg-black/40 rounded p-4 border border-red-500/20">
            <div className="text-xs text-gray-400 uppercase mb-1">Failed</div>
            <div className="text-3xl font-orbitron text-red-400">{analytics.failedIntents}</div>
          </div>

          <div className="bg-black/40 rounded p-4 border border-yellow-500/20">
            <div className="text-xs text-gray-400 uppercase mb-1">Pending</div>
            <div className="text-3xl font-orbitron text-yellow-400">{analytics.pendingIntents}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-black/40 rounded p-4 border border-cyber-blue/20">
            <div className="text-xs text-gray-400 uppercase mb-1">Success Rate</div>
            <div className="text-2xl font-orbitron text-cyber-blue">{analytics.successRate}%</div>
          </div>

          <div className="bg-black/40 rounded p-4 border border-cyber-green/20">
            <div className="text-xs text-gray-400 uppercase mb-1">Total Rewards Paid</div>
            <div className="text-2xl font-orbitron text-cyber-green">
              {formatEther(analytics.totalRewardsPaid)} DEV
            </div>
          </div>

          <div className="bg-black/40 rounded p-4 border border-purple-500/20">
            <div className="text-xs text-gray-400 uppercase mb-1">Gas Saved</div>
            <div className="text-2xl font-orbitron text-purple-400">
              {(Number(analytics.estimatedGasSaved) / 1e9).toFixed(2)} Gwei
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-cyber-blue/10 rounded border border-cyber-blue/20">
          <div className="text-xs text-gray-400 mb-1">Connected Wallet</div>
          <div className="font-mono text-sm text-cyber-blue">{address}</div>
        </div>
      </div>
    </div>
  );
}
