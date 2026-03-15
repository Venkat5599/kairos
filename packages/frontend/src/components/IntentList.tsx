'use client';

import { useIntents } from '@/hooks/useIntents';

export default function IntentList() {
  const { intents, loading, error } = useIntents();

  if (loading) {
    return (
      <div className="space-y-4">
        <h4 className="text-xs font-orbitron text-slate-500 uppercase tracking-widest ml-1">
          Active Intents
        </h4>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel p-4 rounded border border-cyber-blue/30 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-slate-800 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h4 className="text-xs font-orbitron text-slate-500 uppercase tracking-widest ml-1">
          Active Intents
        </h4>
        <div className="glass-panel p-6 rounded border border-red-500/30 text-center">
          <p className="text-red-400 text-sm">⚠️ {error}</p>
          <p className="text-slate-500 text-xs mt-2">Please check your connection</p>
        </div>
      </div>
    );
  }

  if (intents.length === 0) {
    return (
      <div className="space-y-4">
        <h4 className="text-xs font-orbitron text-slate-500 uppercase tracking-widest ml-1">
          Active Intents
        </h4>
        <div className="glass-panel p-12 rounded border border-cyber-blue/30 text-center">
          <div className="text-cyber-blue text-6xl mb-6 animate-pulse">⚡</div>
          <h3 className="text-cyber-pink font-orbitron text-xl mb-3">No Active Intents</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Create your first intent using the terminal above. Describe what you want in natural language and let the solver bots execute it automatically!
          </p>
          <div className="space-y-3 text-left max-w-md mx-auto bg-black/40 p-4 rounded border border-cyber-blue/20">
            <p className="text-xs font-orbitron text-cyber-blue uppercase">Example Intents:</p>
            <div className="space-y-2 text-xs text-slate-400 font-mono">
              <div className="flex items-start space-x-2">
                <span className="text-cyber-green">→</span>
                <span>send 0.01 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-cyber-green">→</span>
                <span>Bridge 0.1 DEV to Ethereum 0x1234...</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-cyber-green">→</span>
                <span>Transfer 0.05 DEV to 0xabcd...</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-6 px-6 py-3 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-cyber-blue font-orbitron font-bold rounded transition-all group"
          >
            <span className="flex items-center space-x-2">
              <span>CREATE INTENT</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'Failed':
      case 'Cancelled':
        return 'red';
      case 'Executing':
        return 'pink';
      default:
        return 'blue';
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'Completed':
        return 100;
      case 'Executing':
        return 50;
      case 'Failed':
      case 'Cancelled':
        return 100;
      default:
        return 0;
    }
  };

  // Detect if intent is cross-chain
  const isCrossChain = (description: string) => {
    const crossChainKeywords = /bridge|polkadot|ethereum|astar|moonriver|from\s+\w+\s+to\s+\w+/i;
    return crossChainKeywords.test(description);
  };

  // Extract destination chain from description
  const getDestinationChain = (description: string) => {
    const chains = ['Polkadot', 'Ethereum', 'Astar', 'Moonriver', 'Moonbeam'];
    for (const chain of chains) {
      if (description.toLowerCase().includes(chain.toLowerCase())) {
        return chain;
      }
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-orbitron text-slate-500 uppercase tracking-widest ml-1">
        Active Intents ({intents.length})
      </h4>

      {intents.map((intent) => {
        const color = getStatusColor(intent.status);
        const progress = getProgress(intent.status);
        const crossChain = isCrossChain(intent.description);
        const destinationChain = getDestinationChain(intent.description);
        
        return (
          <div
            key={intent.id}
            className={`glass-panel p-4 rounded border ${
              color === 'pink'
                ? 'border-cyber-pink/30'
                : color === 'green'
                ? 'border-cyber-green/30'
                : color === 'red'
                ? 'border-red-500/30'
                : 'border-cyber-blue/30'
            } relative overflow-hidden group hover:scale-[1.01] transition-transform cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-1">
                  <span className="text-xs font-mono text-white">
                    INTENT #{intent.id.slice(0, 8)}... |{' '}
                    <span
                      className={
                        color === 'pink'
                          ? 'text-cyber-pink'
                          : color === 'green'
                          ? 'text-cyber-green'
                          : color === 'red'
                          ? 'text-red-400'
                          : 'text-cyber-blue'
                      }
                    >
                      {intent.status}
                    </span>
                  </span>
                  {crossChain && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-[9px] text-purple-300 font-orbitron">
                      <span>🌉</span>
                      <span>CROSS-CHAIN</span>
                      {destinationChain && <span>→ {destinationChain.toUpperCase()}</span>}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 italic mb-1">{intent.description}</p>
                <div className="flex items-center space-x-4 text-[9px] text-slate-500">
                  <span>Reward: {intent.reward} DEV</span>
                  <span>Creator: {intent.creator.slice(0, 6)}...{intent.creator.slice(-4)}</span>
                </div>
              </div>
              <span
                className={`text-xs font-orbitron ${
                  color === 'pink'
                    ? 'text-cyber-pink'
                    : color === 'green'
                    ? 'text-cyber-green'
                    : color === 'red'
                    ? 'text-red-400'
                    : 'text-cyber-blue'
                }`}
              >
                {progress}%
              </span>
            </div>
            <div
              className={`w-full ${
                color === 'pink'
                  ? 'bg-cyber-pink/10'
                  : color === 'green'
                  ? 'bg-cyber-green/10'
                  : color === 'red'
                  ? 'bg-red-500/10'
                  : 'bg-cyber-blue/10'
              } h-2 rounded-full relative z-10 overflow-hidden`}
            >
              <div
                className={`${
                  color === 'pink'
                    ? 'bg-cyber-pink'
                    : color === 'green'
                    ? 'bg-cyber-green'
                    : color === 'red'
                    ? 'bg-red-400'
                    : 'bg-cyber-blue'
                } h-full ${progress < 100 ? 'progress-pulse' : ''} rounded-full ${
                  color === 'pink'
                    ? 'shadow-[0_0_10px_rgba(255,0,110,0.8)]'
                    : color === 'green'
                    ? 'shadow-[0_0_10px_rgba(0,255,65,0.8)]'
                    : color === 'red'
                    ? 'shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                    : 'shadow-[0_0_10px_rgba(0,217,255,0.8)]'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
