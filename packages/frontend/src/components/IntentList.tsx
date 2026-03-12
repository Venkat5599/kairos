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
        <div className="glass-panel p-8 rounded border border-cyber-blue/30 text-center">
          <div className="text-cyber-blue text-4xl mb-4">⚡</div>
          <p className="text-slate-400 text-sm mb-2">No active intents</p>
          <p className="text-slate-600 text-xs">Create your first intent above to get started</p>
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

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-orbitron text-slate-500 uppercase tracking-widest ml-1">
        Active Intents ({intents.length})
      </h4>

      {intents.map((intent) => {
        const color = getStatusColor(intent.status);
        const progress = getProgress(intent.status);
        
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
                    INTENT #{intent.id} |{' '}
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
