'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useIntents } from '@/hooks/useIntents';
import { formatAddress, formatEther } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const { intents, loading, error } = useIntents();
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('reward');

  const pendingIntents = intents.filter(i => i.status === 'Pending');
  
  const filteredIntents = filter === 'all' 
    ? pendingIntents 
    : pendingIntents.filter(i => i.description.toLowerCase().includes(filter));

  const sortedIntents = [...filteredIntents].sort((a, b) => {
    if (sortBy === 'reward') {
      return Number(b.reward) - Number(a.reward);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleClaim = (intentId: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }
    toast.success('Intent claimed! Executing...');
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="glass-panel rounded-lg overflow-hidden pink-glow-border">
          <div className="bg-cyber-pink/10 px-4 py-2 border-b border-cyber-pink/30">
            <span className="text-[10px] font-orbitron text-cyber-pink uppercase tracking-widest">
              Intent_Marketplace
            </span>
          </div>

          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 uppercase">Filter:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-black/40 border border-cyber-pink/30 rounded px-3 py-1 text-sm text-white font-mono focus:outline-none focus:border-cyber-pink"
                >
                  <option value="all">All Intents</option>
                  <option value="send">Transfers</option>
                  <option value="bridge">Cross-Chain</option>
                  <option value="swap">Swaps</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 uppercase">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/40 border border-cyber-pink/30 rounded px-3 py-1 text-sm text-white font-mono focus:outline-none focus:border-cyber-pink"
                >
                  <option value="reward">Highest Reward</option>
                  <option value="time">Most Recent</option>
                </select>
              </div>

              <div className="ml-auto flex items-center space-x-2 bg-cyber-pink/10 px-3 py-1 rounded border border-cyber-pink/30">
                <span className="text-xs text-cyber-pink font-orbitron uppercase">
                  {sortedIntents.length} Available
                </span>
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
            ) : sortedIntents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-cyber-pink text-5xl mb-4">🎯</div>
                <p className="text-slate-400 mb-2">No intents available</p>
                <p className="text-slate-600 text-sm">Check back soon for new opportunities</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedIntents.map((intent) => (
                  <div
                    key={intent.id}
                    className="glass-panel p-4 rounded-lg border border-cyber-pink/30 hover:border-cyber-pink/60 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="blue">Pending</Badge>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Reward</div>
                        <div className="text-lg font-bold text-cyber-green font-orbitron">
                          {formatEther(intent.reward)} PAS
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-white mb-3 line-clamp-2 font-mono">
                      {intent.description}
                    </p>

                    <div className="space-y-2 text-xs text-slate-400 mb-4">
                      <div className="flex justify-between">
                        <span>Creator:</span>
                        <span className="font-mono text-cyber-blue">
                          {formatAddress(intent.creator)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="font-mono">
                          {new Date(intent.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaim(intent.id)}
                      disabled={!isConnected}
                      className="w-full py-2 bg-cyber-pink/20 hover:bg-cyber-pink/30 border border-cyber-pink text-cyber-pink font-orbitron font-bold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105"
                    >
                      {isConnected ? 'Claim & Execute' : 'Connect Wallet'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Info Banner */}
            <div className="mt-8 p-4 bg-gradient-to-r from-cyber-pink/10 to-cyber-blue/10 rounded-lg border border-cyber-pink/20">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-orbitron text-white font-bold mb-1">Earn Rewards as a Solver</h3>
                  <p className="text-sm text-gray-300">
                    Claim pending intents and execute them to earn rewards. The marketplace shows all available 
                    opportunities sorted by reward amount. Connect your wallet to start earning!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
