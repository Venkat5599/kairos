'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMarketplace, useMarketplaceLeaderboard, seedMarketplace } from '@/hooks/useMarketplace';
import MarketplaceCard from '@/components/MarketplaceCard';
import MarketplaceFilters from '@/components/MarketplaceFilters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [clonedCommand, setClonedCommand] = useState('');

  const filters = {
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
    search: searchQuery || undefined,
  };

  const { intents, loading, error, refetch } = useMarketplace(filters);
  const { leaderboard, loading: leaderboardLoading } = useMarketplaceLeaderboard(5);

  const handleSeed = async () => {
    try {
      const result = await seedMarketplace();
      toast.success(result.message);
      refetch();
    } catch (err) {
      toast.error('Failed to seed marketplace');
    }
  };

  const handleClone = (command: string) => {
    setClonedCommand(command);
    // Scroll to IntentTerminal if it exists on the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        {/* Cloned command notification */}
        {clonedCommand && (
          <div className="glass-panel rounded-lg p-4 bg-cyber-green/10 border border-cyber-green/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-cyber-green font-orbitron text-sm">Template Cloned!</span>
                <p className="text-xs text-gray-400 mt-1 font-mono">{clonedCommand}</p>
              </div>
              <button
                onClick={() => setClonedCommand('')}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
          <div className="bg-cyber-blue/10 px-4 py-2 border-b border-cyber-blue/30 flex justify-between items-center">
            <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
              Intent_Template_Marketplace
            </span>
            <button
              onClick={handleSeed}
              className="text-[10px] font-orbitron text-cyber-blue hover:text-white uppercase px-2 py-1 border border-cyber-blue/30 rounded hover:bg-cyber-blue/20 transition-all"
            >
              Seed Templates
            </button>
          </div>

          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue"
              />
            </div>

            {/* Filters */}
            <MarketplaceFilters
              selectedCategory={selectedCategory}
              selectedDifficulty={selectedDifficulty}
              onCategoryChange={setSelectedCategory}
              onDifficultyChange={setSelectedDifficulty}
            />

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 rounded p-3 border border-cyber-blue/20">
                <div className="text-xs text-gray-400 uppercase">Total Templates</div>
                <div className="text-2xl font-orbitron text-cyber-blue">{intents.length}</div>
              </div>
              <div className="bg-black/40 rounded p-3 border border-cyber-blue/20">
                <div className="text-xs text-gray-400 uppercase">Categories</div>
                <div className="text-2xl font-orbitron text-cyber-blue">5</div>
              </div>
              <div className="bg-black/40 rounded p-3 border border-cyber-blue/20">
                <div className="text-xs text-gray-400 uppercase">Total Uses</div>
                <div className="text-2xl font-orbitron text-cyber-blue">
                  {intents.reduce((sum, i) => sum + i.usageCount, 0)}
                </div>
              </div>
              <div className="bg-black/40 rounded p-3 border border-cyber-blue/20">
                <div className="text-xs text-gray-400 uppercase">Avg Rating</div>
                <div className="text-2xl font-orbitron text-cyber-blue">
                  {intents.length > 0
                    ? (intents.reduce((sum, i) => sum + i.rating, 0) / intents.length).toFixed(1)
                    : '0.0'}
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="mt-8">
              {loading ? (
                <div className="py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400 mb-2">Failed to load templates</p>
                  <p className="text-slate-500 text-sm">Please check your connection</p>
                </div>
              ) : intents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-cyber-blue text-5xl mb-4">📚</div>
                  <p className="text-slate-400 mb-2">No templates found</p>
                  <p className="text-slate-600 text-sm">Try adjusting your filters or seed the marketplace</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {intents.map((intent) => (
                    <MarketplaceCard key={intent.id} intent={intent} onClone={handleClone} />
                  ))}
                </div>
              )}
            </div>

            {/* Leaderboard Sidebar */}
            {!leaderboardLoading && leaderboard.length > 0 && (
              <div className="mt-8 glass-panel rounded-lg p-4 border border-cyber-blue/20">
                <h3 className="font-orbitron text-cyber-blue uppercase text-sm mb-4">
                  🏆 Top Templates
                </h3>
                <div className="space-y-2">
                  {leaderboard.map((template, index) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-2 bg-black/40 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{index + 1}.</span>
                        <span className="text-xl">{template.icon}</span>
                        <div>
                          <div className="text-sm text-white">{template.name}</div>
                          <div className="text-xs text-gray-400">
                            {template.usageCount} uses • ⭐ {template.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Banner */}
            <div className="mt-8 p-4 bg-gradient-to-r from-cyber-blue/10 to-purple-500/10 rounded-lg border border-cyber-blue/20">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-orbitron text-white font-bold mb-1">
                    Browse & Clone Intent Templates
                  </h3>
                  <p className="text-sm text-gray-300">
                    Discover pre-built intent templates for transfers, cross-chain bridges, DeFi operations, and more.
                    Clone any template to customize and execute. Rate templates to help others find the best ones!
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
