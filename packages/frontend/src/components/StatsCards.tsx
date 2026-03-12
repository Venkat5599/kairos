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
        <div className="h-10 w-full mt-2">
          <svg className="w-full h-full" viewBox="0 0 100 30">
            <path
              className="chart-line"
              d="M0 25 L10 20 L20 22 L30 15 L40 18 L50 10 L60 12 L70 5 L80 15 L90 8 L100 12"
              fill="none"
              stroke="#FF006E"
              strokeWidth="2"
            />
          </svg>
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
        <div className="h-10 w-full mt-2">
          <svg className="w-full h-full" viewBox="0 0 100 30">
            <path
              className="chart-line"
              d="M0 25 L20 20 L40 18 L60 15 L80 12 L100 8"
              fill="none"
              stroke="#00D9FF"
              strokeWidth="2"
            />
          </svg>
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
        <div className="h-10 w-full mt-2">
          <svg className="w-full h-full" viewBox="0 0 100 30">
            <path
              className="chart-line"
              d="M0 15 L10 16 L20 14 L30 15 L40 13 L50 14 L60 12 L70 13 L80 11 L90 12 L100 10"
              fill="none"
              stroke="#00FF41"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
