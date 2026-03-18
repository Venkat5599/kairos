'use client';

import { MarketplaceIntent } from '@/hooks/useMarketplace';
import { cloneIntent } from '@/hooks/useMarketplace';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

interface MarketplaceCardProps {
  intent: MarketplaceIntent;
  onClone?: (command: string) => void;
}

export default function MarketplaceCard({ intent, onClone }: MarketplaceCardProps) {
  const { address } = useAccount();
  const [isRating, setIsRating] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cross-chain':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'transfer':
        return 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30';
      case 'staking':
        return 'bg-cyber-green/20 text-cyber-green border-cyber-green/30';
      case 'governance':
        return 'bg-cyber-pink/20 text-cyber-pink border-cyber-pink/30';
      case 'defi':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleClone = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      const command = intent.template?.command || '';

      // Track clone
      await cloneIntent(intent.id, address, 'pending', false);

      // Call parent callback to populate IntentTerminal
      if (onClone) {
        onClone(command);
      }

      toast.success('Template cloned! Edit and execute below.');
    } catch (err) {
      console.error('Failed to clone:', err);
      toast.error('Failed to clone template');
    }
  };

  return (
    <div className="bg-black/40 rounded-lg p-4 border border-cyber-blue/20 hover:border-cyber-blue/40 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{intent.icon || '📝'}</span>
          <div>
            <h3 className="font-orbitron text-white group-hover:text-cyber-blue transition-colors">
              {intent.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{intent.description}</p>
          </div>
        </div>
        {intent.isFeatured && (
          <span className="px-2 py-1 bg-cyber-pink/20 text-cyber-pink text-[10px] font-orbitron uppercase rounded border border-cyber-pink/30">
            Featured
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-orbitron uppercase border ${getCategoryColor(intent.category)}`}>
          {intent.category}
        </span>
        <span className={`text-[10px] font-orbitron uppercase ${getDifficultyColor(intent.difficulty)}`}>
          {intent.difficulty}
        </span>
      </div>

      <div className="bg-black/60 rounded p-2 font-mono text-xs text-gray-300 border border-cyber-blue/10 group-hover:border-cyber-blue/30 transition-colors mb-3">
        <span className="text-cyber-green mr-1">&gt;</span>
        {intent.template?.command || 'No command available'}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <div className="flex items-center space-x-3">
          <span>⭐ {intent.rating.toFixed(1)} ({intent.ratingCount})</span>
          <span>📊 {intent.usageCount} uses</span>
          <span>✅ {intent.successRate.toFixed(0)}%</span>
        </div>
      </div>

      <button
        onClick={handleClone}
        className="w-full px-4 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-cyber-blue font-orbitron text-sm rounded transition-all"
      >
        Clone Template
      </button>
    </div>
  );
}
