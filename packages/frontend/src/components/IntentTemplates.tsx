'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  command: string;
  category: 'cross-chain' | 'transfer' | 'staking' | 'governance' | 'defi';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'simple-transfer',
    name: 'Simple Transfer',
    description: 'Send PAS tokens to another address on Polkadot Hub',
    command: 'send 0.1 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    category: 'transfer',
    difficulty: 'beginner',
    icon: '💸',
  },
  {
    id: 'cross-chain-polkadot',
    name: 'Bridge to Polkadot',
    description: 'Transfer tokens to Polkadot Relay Chain via XCM',
    command: 'send 1 PAS to polkadot 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    category: 'cross-chain',
    difficulty: 'intermediate',
    icon: '🌉',
  },
  {
    id: 'cross-chain-assethub',
    name: 'Bridge to Asset Hub',
    description: 'Transfer tokens to Asset Hub parachain',
    command: 'bridge 2 PAS to assethub 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    category: 'cross-chain',
    difficulty: 'intermediate',
    icon: '🏦',
  },
  {
    id: 'cross-chain-moonbeam',
    name: 'Bridge to Moonbeam',
    description: 'Transfer tokens to Moonbeam parachain',
    command: 'transfer 0.5 PAS to moonbeam 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    category: 'cross-chain',
    difficulty: 'intermediate',
    icon: '🌙',
  },
  {
    id: 'cross-chain-astar',
    name: 'Bridge to Astar',
    description: 'Transfer tokens to Astar parachain',
    command: 'send 1.5 PAS to astar 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    category: 'cross-chain',
    difficulty: 'intermediate',
    icon: '⭐',
  },
  {
    id: 'batch-transfer',
    name: 'Batch Transfer',
    description: 'Send to multiple recipients in one intent',
    command: 'send 0.1 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb AND 0.2 PAS to 0x123...',
    category: 'transfer',
    difficulty: 'advanced',
    icon: '📦',
  },
];

interface IntentTemplatesProps {
  onSelectTemplate: (command: string) => void;
}

export default function IntentTemplates({ onSelectTemplate }: IntentTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = ['all', 'transfer', 'cross-chain', 'staking', 'governance', 'defi'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredTemplates = TEMPLATES.filter((template) => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

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

  return (
    <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
      <div className="bg-cyber-blue/10 px-4 py-2 border-b border-cyber-blue/30">
        <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
          Intent_Templates_Library
        </span>
      </div>

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 uppercase">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-orbitron uppercase transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyber-blue text-white'
                    : 'bg-black/40 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 uppercase">Level:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded text-xs font-orbitron uppercase transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-cyber-blue text-white'
                    : 'bg-black/40 text-gray-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.command)}
              className="bg-black/40 rounded-lg p-4 border border-cyber-blue/20 hover:border-cyber-blue/40 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">{template.icon}</span>
                  <div>
                    <h3 className="font-orbitron text-white group-hover:text-cyber-blue transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-orbitron uppercase border ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
                <span className={`text-[10px] font-orbitron uppercase ${getDifficultyColor(template.difficulty)}`}>
                  {template.difficulty}
                </span>
              </div>

              <div className="bg-black/60 rounded p-2 font-mono text-xs text-gray-300 border border-cyber-blue/10 group-hover:border-cyber-blue/30 transition-colors">
                <span className="text-cyber-green mr-1">&gt;</span>
                {template.command}
              </div>

              <div className="mt-3 flex items-center justify-end">
                <span className="text-xs text-cyber-blue opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  Use Template
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No templates found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
