'use client';

import { SolverStats } from '@/hooks/useUserAnalytics';
import { formatAddress } from '@/lib/utils';

interface SolverLeaderboardProps {
  solvers: SolverStats[];
}

export default function SolverLeaderboard({ solvers }: SolverLeaderboardProps) {
  return (
    <div className="glass-panel rounded-lg overflow-hidden pink-glow-border">
      <div className="bg-cyber-pink/10 px-4 py-2 border-b border-cyber-pink/30">
        <span className="text-[10px] font-orbitron text-cyber-pink uppercase tracking-widest">
          Solver_Leaderboard
        </span>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-pink/20">
                <th className="text-left py-3 px-2 text-xs text-gray-400 uppercase font-orbitron">Rank</th>
                <th className="text-left py-3 px-2 text-xs text-gray-400 uppercase font-orbitron">Solver</th>
                <th className="text-right py-3 px-2 text-xs text-gray-400 uppercase font-orbitron">Executed</th>
                <th className="text-right py-3 px-2 text-xs text-gray-400 uppercase font-orbitron">Success Rate</th>
                <th className="text-right py-3 px-2 text-xs text-gray-400 uppercase font-orbitron">Reputation</th>
                <th className="text-right py-3 px-2 text-xs text-gray-400 uppercase font-orbitron">Avg Gas</th>
              </tr>
            </thead>
            <tbody>
              {solvers.map((solver, index) => (
                <tr
                  key={solver.address}
                  className="border-b border-cyber-pink/10 hover:bg-cyber-pink/5 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center">
                      {index === 0 && <span className="text-xl mr-2">🥇</span>}
                      {index === 1 && <span className="text-xl mr-2">🥈</span>}
                      {index === 2 && <span className="text-xl mr-2">🥉</span>}
                      <span className="font-orbitron text-white">{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="font-mono text-sm text-cyber-blue">
                      {formatAddress(solver.address)}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="font-orbitron text-white">{solver.totalExecuted}</div>
                    {solver.totalFailed > 0 && (
                      <div className="text-xs text-red-400">{solver.totalFailed} failed</div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="font-orbitron text-cyber-green">{solver.successRate}%</div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-orbitron text-white">{solver.reputation}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="font-mono text-xs text-gray-400">
                      {(Number(solver.avgGasUsed) / 1000).toFixed(1)}k
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {solvers.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-gray-400">No active solvers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
