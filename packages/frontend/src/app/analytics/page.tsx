'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { formatAddress, formatEther, formatTimestamp } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { data, loading, error } = useAnalytics();

  const COLORS = {
    PENDING: '#00D9FF',
    EXECUTING: '#FF006E',
    COMPLETED: '#00FF41',
    FAILED: '#EF4444',
    CANCELLED: '#64748b',
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        {loading ? (
          <div className="glass-panel p-12 rounded-lg text-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="glass-panel p-12 rounded-lg text-center">
            <p className="text-red-400 mb-2">Failed to load analytics</p>
            <p className="text-slate-500 text-sm">Please check your connection</p>
          </div>
        ) : data ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-lg border-cyber-blue/30">
                <p className="text-xs font-orbitron text-slate-500 uppercase mb-2">Total Intents</p>
                <p className="text-3xl font-bold text-cyber-blue">{data.stats.totalIntents}</p>
              </div>
              <div className="glass-panel p-4 rounded-lg border-cyber-green/30">
                <p className="text-xs font-orbitron text-slate-500 uppercase mb-2">Completed</p>
                <p className="text-3xl font-bold text-cyber-green">{data.stats.completedIntents}</p>
              </div>
              <div className="glass-panel p-4 rounded-lg border-cyber-pink/30">
                <p className="text-xs font-orbitron text-slate-500 uppercase mb-2">Success Rate</p>
                <p className="text-3xl font-bold text-cyber-pink">{data.stats.successRate}%</p>
              </div>
              <div className="glass-panel p-4 rounded-lg border-slate-600/30">
                <p className="text-xs font-orbitron text-slate-500 uppercase mb-2">Total Volume</p>
                <p className="text-3xl font-bold text-white">{formatEther(data.stats.totalVolume)} ETH</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Volume Chart */}
              <div className="glass-panel p-6 rounded-lg border-cyber-blue/30">
                <h3 className="text-lg font-orbitron text-white mb-4">Volume by Day</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.volumeByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #00D9FF',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#00D9FF" strokeWidth={2} dot={{ fill: '#00D9FF' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Status Distribution */}
              <div className="glass-panel p-6 rounded-lg border-cyber-pink/30">
                <h3 className="text-lg font-orbitron text-white mb-4">Intents by Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.intentsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.intentsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || '#64748b'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #FF006E',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity & Top Solvers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="glass-panel p-6 rounded-lg border-cyber-green/30">
                <h3 className="text-lg font-orbitron text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {data.recentActivity.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between p-3 bg-black/40 rounded border border-slate-800"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-white mb-1 line-clamp-1">{activity.description}</p>
                        <p className="text-xs text-slate-500 font-mono">
                          {formatAddress(activity.creator)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          activity.status === 'COMPLETED'
                            ? 'green'
                            : activity.status === 'EXECUTING'
                            ? 'pink'
                            : activity.status === 'FAILED'
                            ? 'red'
                            : 'blue'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Solvers */}
              <div className="glass-panel p-6 rounded-lg border-cyber-pink/30">
                <h3 className="text-lg font-orbitron text-white mb-4">Top Solvers</h3>
                <div className="space-y-3">
                  {data.topSolvers.map((solver, index) => (
                    <div
                      key={solver.address}
                      className="flex items-center justify-between p-3 bg-black/40 rounded border border-slate-800"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-orbitron text-cyber-pink font-bold">#{index + 1}</span>
                        <span className="font-mono text-white text-sm">
                          {formatAddress(solver.address)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-cyber-green font-bold">{solver.reputation}</p>
                        <p className="text-xs text-slate-500">{solver.totalExecuted} completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        <Footer />
      </div>
    </main>
  );
}
