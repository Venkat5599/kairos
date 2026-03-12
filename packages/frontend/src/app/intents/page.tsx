'use client';

import { useState } from 'react';
import { useIntents } from '@/hooks/useIntents';
import { formatAddress, formatTimestamp, formatEther } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function IntentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { intents, loading, error } = useIntents(statusFilter ? { status: statusFilter } : undefined);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="glass-panel p-6 rounded-lg border-cyber-blue/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4 md:mb-0">
              All Intents
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyber-blue"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="EXECUTING">Executing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-2">Failed to load intents</p>
              <p className="text-slate-500 text-sm">Please check your connection</p>
            </div>
          ) : intents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-cyber-blue text-5xl mb-4">⚡</div>
              <p className="text-slate-400 mb-2">No intents found</p>
              <p className="text-slate-600 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {intents.map((intent) => (
                <div
                  key={intent.id}
                  className={`glass-panel p-4 rounded border ${
                    intent.color === 'pink'
                      ? 'border-cyber-pink/30'
                      : intent.color === 'green'
                      ? 'border-cyber-green/30'
                      : intent.color === 'red'
                      ? 'border-red-500/30'
                      : 'border-cyber-blue/30'
                  } hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant={
                        intent.color === 'pink'
                          ? 'pink'
                          : intent.color === 'green'
                          ? 'green'
                          : intent.color === 'red'
                          ? 'red'
                          : 'blue'
                      }
                    >
                      {intent.status}
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono">
                      {intent.id.slice(0, 8)}...
                    </span>
                  </div>

                  <p className="text-sm text-white mb-3 line-clamp-2">{intent.description}</p>

                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Creator:</span>
                      <span className="font-mono text-cyber-blue">
                        {formatAddress(intent.creator)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reward:</span>
                      <span className="font-mono text-cyber-green">
                        {formatEther(intent.reward)} ETH
                      </span>
                    </div>
                    {intent.solver && (
                      <div className="flex justify-between">
                        <span>Solver:</span>
                        <span className="font-mono text-cyber-pink">
                          {formatAddress(intent.solver)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div
                      className={`w-full ${
                        intent.color === 'pink'
                          ? 'bg-cyber-pink/10'
                          : intent.color === 'green'
                          ? 'bg-cyber-green/10'
                          : intent.color === 'red'
                          ? 'bg-red-500/10'
                          : 'bg-cyber-blue/10'
                      } h-2 rounded-full overflow-hidden`}
                    >
                      <div
                        className={`${
                          intent.color === 'pink'
                            ? 'bg-cyber-pink'
                            : intent.color === 'green'
                            ? 'bg-cyber-green'
                            : intent.color === 'red'
                            ? 'bg-red-400'
                            : 'bg-cyber-blue'
                        } h-full transition-all duration-500`}
                        style={{ width: `${intent.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-slate-500">Progress</span>
                      <span className="text-xs font-orbitron text-cyber-blue">
                        {intent.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </main>
  );
}
