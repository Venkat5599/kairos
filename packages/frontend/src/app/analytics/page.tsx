'use client';

import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useUserAnalytics, useGasOptimization, useSolverLeaderboard } from '@/hooks/useUserAnalytics';
import UserStatsCard from '@/components/UserStatsCard';
import GasOptimizationChart from '@/components/GasOptimizationChart';
import SolverLeaderboard from '@/components/SolverLeaderboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount();
  const { data: analyticsData, loading: statsLoading } = useAnalytics();
  const stats = analyticsData?.stats;
  const { analytics: userAnalytics, loading: userLoading } = useUserAnalytics(address);
  const { metrics: gasMetrics, loading: gasLoading } = useGasOptimization();
  const { solvers, loading: solversLoading } = useSolverLeaderboard(10);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        {/* User Analytics (if connected) */}
        {isConnected && address && (
          <div>
            {userLoading ? (
              <div className="glass-panel rounded-lg p-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : userAnalytics ? (
              <UserStatsCard analytics={userAnalytics} address={address} />
            ) : null}
          </div>
        )}

        {/* Global Stats */}
        <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
          <div className="bg-cyber-blue/10 px-4 py-2 border-b border-cyber-blue/30">
            <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
              Global_System_Analytics
            </span>
          </div>
          <div className="p-6">
            {statsLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/40 rounded p-4 border border-cyber-blue/20">
                  <div className="text-xs text-gray-400 uppercase mb-1">Total Intents</div>
                  <div className="text-3xl font-orbitron text-cyber-blue">{stats?.totalIntents || 0}</div>
                </div>

                <div className="bg-black/40 rounded p-4 border border-cyber-green/20">
                  <div className="text-xs text-gray-400 uppercase mb-1">Completed</div>
                  <div className="text-3xl font-orbitron text-cyber-green">{stats?.completedIntents || 0}</div>
                </div>

                <div className="bg-black/40 rounded p-4 border border-yellow-500/20">
                  <div className="text-xs text-gray-400 uppercase mb-1">Success Rate</div>
                  <div className="text-3xl font-orbitron text-yellow-400">{stats?.successRate || 0}%</div>
                </div>

                <div className="bg-black/40 rounded p-4 border border-purple-500/20">
                  <div className="text-xs text-gray-400 uppercase mb-1">Active Solvers</div>
                  <div className="text-3xl font-orbitron text-purple-400">{stats?.totalSolvers || 0}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gas Optimization */}
        {gasLoading ? (
          <div className="glass-panel rounded-lg p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : gasMetrics ? (
          <GasOptimizationChart metrics={gasMetrics} />
        ) : null}

        {/* Solver Leaderboard */}
        {solversLoading ? (
          <div className="glass-panel rounded-lg p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <SolverLeaderboard solvers={solvers} />
        )}

        {/* Info Banner */}
        {!isConnected && (
          <div className="glass-panel rounded-lg p-6 bg-gradient-to-r from-cyber-blue/10 to-purple-500/10 border border-cyber-blue/20">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">🔗</span>
              <div>
                <h3 className="font-orbitron text-white font-bold mb-2">Connect Your Wallet</h3>
                <p className="text-sm text-gray-300">
                  Connect your wallet to see personalized analytics including your intent history,
                  success rate, gas savings, and rewards earned.
                </p>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
}
