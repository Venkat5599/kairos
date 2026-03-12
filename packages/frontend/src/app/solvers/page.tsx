'use client';

import { useSolvers } from '@/hooks/useSolvers';
import { formatAddress, formatEther } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SolversPage() {
  const { solvers, loading, error } = useSolvers();

  const calculateSuccessRate = (executed: number, failed: number) => {
    const total = executed + failed;
    if (total === 0) return '0.00';
    return ((executed / total) * 100).toFixed(2);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="glass-panel p-6 rounded-lg border-cyber-pink/30">
          <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
            Solver Leaderboard
          </h2>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-2">Failed to load solvers</p>
              <p className="text-slate-500 text-sm">Please check your connection</p>
            </div>
          ) : solvers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-cyber-pink text-5xl mb-4">🤖</div>
              <p className="text-slate-400 mb-2">No solvers registered</p>
              <p className="text-slate-600 text-sm">Be the first to register as a solver</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 font-orbitron text-cyber-blue uppercase text-xs">
                        Rank
                      </th>
                      <th className="text-left py-3 px-4 font-orbitron text-cyber-blue uppercase text-xs">
                        Address
                      </th>
                      <th className="text-right py-3 px-4 font-orbitron text-cyber-blue uppercase text-xs">
                        Reputation
                      </th>
                      <th className="text-right py-3 px-4 font-orbitron text-cyber-blue uppercase text-xs">
                        Completed
                      </th>
                      <th className="text-right py-3 px-4 font-orbitron text-cyber-blue uppercase text-xs">
                        Failed
                      </th>
                      <th className="text-right py-3 px-4 font-orbitron text-cyber-blue uppercase text-xs">
                        Success Rate
                      </th>
                      <th className="text-right py-3 px-4 font-orbitron text-cyber-blue uppercase text-xs">
                        Stake
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {solvers.map((solver, index) => (
                      <tr
                        key={solver.address}
                        className="border-b border-slate-800/50 hover:bg-cyber-pink/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-orbitron text-cyber-pink font-bold">
                            #{index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-white">
                            {formatAddress(solver.address)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-cyber-green font-bold">
                            {solver.reputation}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-cyber-blue">
                          {solver.totalExecuted}
                        </td>
                        <td className="py-4 px-4 text-right text-red-400">
                          {solver.totalFailed}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-cyber-green">
                            {calculateSuccessRate(solver.totalExecuted, solver.totalFailed)}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono text-slate-300">
                          {formatEther(solver.stake)} ETH
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {solvers.map((solver, index) => (
                  <div
                    key={solver.address}
                    className="glass-panel p-4 rounded border border-cyber-pink/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-orbitron text-cyber-pink font-bold text-lg">
                        #{index + 1}
                      </span>
                      <span className="text-cyber-green font-bold text-lg">
                        {solver.reputation}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Address:</span>
                        <span className="font-mono text-white">
                          {formatAddress(solver.address)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Completed:</span>
                        <span className="text-cyber-blue">{solver.totalExecuted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Failed:</span>
                        <span className="text-red-400">{solver.totalFailed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Success Rate:</span>
                        <span className="text-cyber-green">
                          {calculateSuccessRate(solver.totalExecuted, solver.totalFailed)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stake:</span>
                        <span className="font-mono text-slate-300">
                          {formatEther(solver.stake)} ETH
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </main>
  );
}
