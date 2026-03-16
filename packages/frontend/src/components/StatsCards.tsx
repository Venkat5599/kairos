'use client';

interface StatsCardsProps {
  stats: any;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Intents */}
      <div className="glass-panel p-4 rounded border-l-4 border-cyber-pink">
        <h3 className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">
          Total_Intents
        </h3>
        <div className="text-3xl font-orbitron font-bold text-white my-1">
          {loading ? '...' : stats?.totalIntents || 0}
        </div>
      </div>

      {/* Completed */}
      <div className="glass-panel p-4 rounded border-l-4 border-cyber-blue">
        <h3 className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">
          Completed
        </h3>
        <div className="text-3xl font-orbitron font-bold text-white my-1">
          {loading ? '...' : stats?.completedIntents || 0}
        </div>
      </div>

      {/* Success Rate */}
      <div className="glass-panel p-4 rounded border-l-4 border-cyber-green">
        <h3 className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">
          Success Rate
        </h3>
        <div className="text-3xl font-orbitron font-bold text-white my-1">
          {loading ? '...' : stats?.successRate || '0%'}
        </div>
      </div>
    </div>
  );
}
