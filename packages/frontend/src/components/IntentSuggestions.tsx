'use client';

import { useState, useEffect } from 'react';

interface Suggestion {
  text: string;
  description: string;
  category: 'transfer' | 'cross-chain' | 'staking' | 'governance';
}

const SUGGESTIONS: Suggestion[] = [
  {
    text: 'send 0.1 PAS to polkadot 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    description: 'Cross-chain transfer to Polkadot',
    category: 'cross-chain',
  },
  {
    text: 'send 1 PAS to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    description: 'Simple transfer on Polkadot Hub',
    category: 'transfer',
  },
  {
    text: 'bridge 5 PAS to assethub 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    description: 'Bridge to Asset Hub parachain',
    category: 'cross-chain',
  },
  {
    text: 'transfer 2 PAS to moonbeam 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    description: 'Transfer to Moonbeam parachain',
    category: 'cross-chain',
  },
  {
    text: 'send 0.5 PAS to astar 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    description: 'Transfer to Astar parachain',
    category: 'cross-chain',
  },
];

interface IntentSuggestionsProps {
  input: string;
  onSelect: (suggestion: string) => void;
}

export default function IntentSuggestions({ input, onSelect }: IntentSuggestionsProps) {
  const [filtered, setFiltered] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (input.length < 2) {
      setFiltered([]);
      setShowSuggestions(false);
      return;
    }

    const matches = SUGGESTIONS.filter((s) =>
      s.text.toLowerCase().includes(input.toLowerCase()) ||
      s.description.toLowerCase().includes(input.toLowerCase())
    );

    setFiltered(matches.slice(0, 5));
    setShowSuggestions(matches.length > 0);
  }, [input]);

  if (!showSuggestions || filtered.length === 0) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cross-chain':
        return 'text-purple-400 border-purple-500/30';
      case 'transfer':
        return 'text-cyber-blue border-cyber-blue/30';
      case 'staking':
        return 'text-cyber-green border-cyber-green/30';
      case 'governance':
        return 'text-cyber-pink border-cyber-pink/30';
      default:
        return 'text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <div className="glass-panel rounded-lg border border-cyber-blue/30 overflow-hidden">
        <div className="bg-cyber-blue/10 px-3 py-1 border-b border-cyber-blue/30">
          <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
            Suggested_Intents
          </span>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filtered.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(suggestion.text);
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-3 hover:bg-cyber-blue/10 border-b border-cyber-blue/10 last:border-b-0 text-left transition-colors group"
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-orbitron uppercase border ${getCategoryColor(suggestion.category)}`}>
                  {suggestion.category}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-white group-hover:text-cyber-blue transition-colors truncate">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {suggestion.description}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-cyber-blue opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
