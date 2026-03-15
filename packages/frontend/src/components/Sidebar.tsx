'use client';

import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { formatAddress } from '@/lib/utils';

export default function Sidebar() {
  const { address, isConnected } = useAccount();
  const { latency, gasPrice, solverCount, loading } = useNetworkStatus();
  const logs = useRecentActivity();

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
              <span className="text-slate-400">Wallet Status</span>
              <span className={`font-orbitron font-bold ${isConnected ? 'text-cyber-green' : 'text-slate-500'}`}>
                {isConnected ? 'CONNECTED' : 'OFFLINE'}
              </span>
            </div>
            {isConnected && address && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Address</span>
                <span className="text-cyber-blue font-mono text-xs">
                  {formatAddress(address)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Network</span>
              <span className="text-cyber-green font-orbitron font-bold">MOONBASE</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Security</span>
              <span className="text-cyber-green font-orbitron font-bold">ACTIVE</span>
            </div>
          </div>
          {isConnected && (
            <div className="pt-4 border-t border-slate-800">
              <div className="text-[10px] text-slate-500 font-mono">
                Connected to Moonbase Alpha Testnet
              </div>
            </div>
          )}
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
              <td className="text-right text-cyber-blue">
                {loading ? '...' : `${latency}ms`}
              </td>
            </tr>
            <tr className="h-10">
              <td className="text-slate-400">Gas Price</td>
              <td className="text-right text-cyber-blue">
                {loading ? '...' : `${parseFloat(gasPrice).toFixed(2)} Gwei`}
              </td>
            </tr>
            <tr className="h-10">
              <td className="text-slate-400">Status</td>
              <td className="text-right text-cyber-green">
                {isConnected ? 'ONLINE' : 'STANDBY'}
              </td>
            </tr>
            <tr className="h-10">
              <td className="text-slate-400">Active Solvers</td>
              <td className="text-right text-white">
                {loading ? '...' : solverCount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mini Console/Terminal */}
      <div className="glass-panel p-4 rounded-lg border border-slate-800 h-48 flex flex-col font-mono text-[10px]">
        <div className="flex-grow overflow-hidden space-y-1">
          {logs.slice(0, 6).map((log) => (
            <p
              key={log.id}
              className={`${
                log.type === 'success'
                  ? 'text-cyber-green'
                  : log.type === 'warning'
                  ? 'text-cyber-pink'
                  : log.type === 'error'
                  ? 'text-red-400'
                  : 'text-slate-500'
              }`}
            >
              &gt; {log.message}
            </p>
          ))}
          <p className="text-white animate-pulse">&gt; _</p>
        </div>
      </div>
    </aside>
  );
}
