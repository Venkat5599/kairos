'use client';

import Image from 'next/image';

export default function Sidebar() {
  return (
    <aside className="space-y-6">
      {/* Profile Card */}
      <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
        {/* Image Section */}
        <div className="relative bg-black p-6">
          <div className="mt-4">
            <p className="text-[10px] font-orbitron text-cyber-blue tracking-widest uppercase mb-2">
              Protocol Avatar
            </p>
            <h5 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tight">
              System Guardian
            </h5>
          </div>
          {/* Guardian Avatar Image */}
          <div className="mt-6 h-64 bg-gradient-to-b from-slate-800 to-black rounded-lg flex items-center justify-center overflow-hidden relative">
            <Image
              src="/assets/guardian-avatar.png"
              alt="Guardian Avatar"
              fill
              className="object-cover opacity-80"
              priority
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-cyber-dark to-black">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Identity Verified</span>
              <span className="text-cyber-green font-orbitron font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Firewall Active</span>
              <span className="text-cyber-green font-orbitron font-bold">SECURE</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">2FA Enabled</span>
              <span className="text-cyber-green font-orbitron font-bold">ACTIVE</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800">
            <button className="w-full py-3 bg-slate-800/50 hover:bg-slate-700/50 text-xs font-orbitron uppercase tracking-widest rounded transition-colors border border-slate-700">
              Manage Security
            </button>
          </div>
        </div>
      </div>

      {/* Network Status Table */}
      <div className="glass-panel p-4 rounded-lg pink-glow-border">
        <h4 className="text-xs font-orbitron text-cyber-pink uppercase tracking-widest mb-4">
          Network_Status
        </h4>
        <table className="w-full text-xs font-mono">
          <tbody className="divide-y divide-slate-800">
            <tr className="h-10">
              <td className="text-slate-400">Latency</td>
              <td className="text-right text-cyber-blue">12ms</td>
            </tr>
            <tr className="h-10">
              <td className="text-slate-400">Gas Price</td>
              <td className="text-right text-cyber-blue">18 Gwei</td>
            </tr>
            <tr className="h-10">
              <td className="text-slate-400">Uptime</td>
              <td className="text-right text-cyber-green">99.99%</td>
            </tr>
            <tr className="h-10">
              <td className="text-slate-400">Active Solvers</td>
              <td className="text-right text-white">124</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mini Console/Terminal */}
      <div className="glass-panel p-4 rounded-lg border border-slate-800 h-48 flex flex-col font-mono text-[10px]">
        <div className="flex-grow overflow-hidden space-y-1">
          <p className="text-slate-500">&gt; Establishing secure tunnel...</p>
          <p className="text-cyber-green">&gt; Connection encrypted (AES-256)</p>
          <p className="text-slate-500">&gt; Monitoring block 18,452,291</p>
          <p className="text-cyber-pink">&gt; ALERT: Volatility detected in DAI/USDC</p>
          <p className="text-slate-500">&gt; Recalibrating slippage params...</p>
          <p className="text-white animate-pulse">&gt; _</p>
        </div>
      </div>
    </aside>
  );
}
