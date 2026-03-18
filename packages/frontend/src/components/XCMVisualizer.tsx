'use client';

import { memo } from 'react';

interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CHAINS: Record<string, Chain> = {
  'polkadot-hub': {
    id: 'polkadot-hub',
    name: 'Polkadot Hub',
    icon: '⬢',
    color: 'cyber-blue',
  },
  'polkadot': {
    id: 'polkadot',
    name: 'Polkadot Relay',
    icon: '🔴',
    color: 'pink-500',
  },
  'assethub': {
    id: 'assethub',
    name: 'Asset Hub',
    icon: '🏦',
    color: 'green-500',
  },
  'moonbeam': {
    id: 'moonbeam',
    name: 'Moonbeam',
    icon: '🌙',
    color: 'purple-500',
  },
  'acala': {
    id: 'acala',
    name: 'Acala',
    icon: '⭐',
    color: 'yellow-500',
  },
};

interface XCMVisualizerProps {
  sourceChain: string;
  destinationChain: string;
  status: 'pending' | 'sending' | 'confirming' | 'completed' | 'failed';
  amount?: string;
  token?: string;
}

const XCMVisualizer = memo(function XCMVisualizer({
  sourceChain,
  destinationChain,
  status,
  amount,
  token = 'DOT',
}: XCMVisualizerProps) {
  const source = CHAINS[sourceChain] || CHAINS['polkadot-hub'];
  const destination = CHAINS[destinationChain] || CHAINS['assethub'];

  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'sending': return 'text-cyber-blue';
      case 'confirming': return 'text-yellow-400';
      case 'completed': return 'text-cyber-green';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending': return 'Preparing XCM Message';
      case 'sending': return 'Sending via XCM';
      case 'confirming': return 'Confirming on Destination';
      case 'completed': return 'Transfer Complete';
      case 'failed': return 'Transfer Failed';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="glass-panel rounded-lg p-6 blue-glow-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-orbitron text-cyber-blue uppercase tracking-widest">
          Cross-Chain Transfer
        </h3>
        <span className={`text-xs font-mono ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Transfer Amount */}
      {amount && (
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-white">
            {amount} {token}
          </div>
          <div className="text-xs text-slate-400 mt-1">Transfer Amount</div>
        </div>
      )}

      {/* Chain Flow Visualization */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {/* Source Chain */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className={`w-16 h-16 rounded-full bg-${source.color}/20 border-2 border-${source.color} flex items-center justify-center text-3xl`}>
              {source.icon}
            </div>
            <div className="text-center">
              <div className="text-sm font-orbitron text-white">{source.name}</div>
              <div className="text-xs text-slate-400">Source</div>
            </div>
          </div>

          {/* XCM Arrow */}
          <div className="flex-1 relative px-4">
            <div className="relative h-1 bg-gradient-to-r from-cyber-blue via-purple-500 to-cyber-green rounded-full overflow-hidden">
              {(status === 'sending' || status === 'confirming') && (
                <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
              )}
              {status === 'sending' && (
                <div className="absolute left-0 top-0 h-full w-1/2 bg-white/80 animate-[slide_2s_ease-in-out_infinite]"></div>
              )}
            </div>

            {/* XCM Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black px-3 py-1 rounded-full border border-cyber-blue/50">
              <span className="text-xs font-mono text-cyber-blue">XCM</span>
            </div>

            {/* Status Icons */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2">
              {status === 'completed' && (
                <div className="w-6 h-6 rounded-full bg-cyber-green flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {status === 'failed' && (
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Destination Chain */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className={`w-16 h-16 rounded-full bg-${destination.color}/20 border-2 border-${destination.color} flex items-center justify-center text-3xl ${status === 'completed' ? 'animate-pulse' : ''}`}>
              {destination.icon}
            </div>
            <div className="text-center">
              <div className="text-sm font-orbitron text-white">{destination.name}</div>
              <div className="text-xs text-slate-400">Destination</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Details */}
      <div className="mt-6 p-4 bg-black/40 rounded border border-cyber-blue/20">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Protocol</div>
            <div className="text-white font-mono">XCM v3</div>
          </div>
          <div>
            <div className="text-slate-400">Message Type</div>
            <div className="text-white font-mono">ReserveAssetDeposited</div>
          </div>
          <div>
            <div className="text-slate-400">Estimated Time</div>
            <div className="text-white font-mono">~12 seconds</div>
          </div>
          <div>
            <div className="text-slate-400">Fee</div>
            <div className="text-white font-mono">~0.001 {token}</div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-4 p-3 bg-cyber-blue/10 border border-cyber-blue/30 rounded">
        <div className="flex items-start space-x-2">
          <span className="text-cyber-blue">ℹ️</span>
          <div className="text-xs text-slate-300">
            <strong className="text-cyber-blue">Cross-Consensus Messaging (XCM)</strong> enables secure
            communication between different blockchains in the Polkadot ecosystem.
          </div>
        </div>
      </div>
    </div>
  );
});

export default XCMVisualizer;
