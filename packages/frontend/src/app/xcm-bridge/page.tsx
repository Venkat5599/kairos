'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

const chains = [
  { id: 'polkadot-hub', name: 'Polkadot Hub', icon: '🌐', color: 'cyber-blue' },
  { id: 'polkadot', name: 'Polkadot Relay', icon: '⚡', color: 'cyber-pink' },
  { id: 'assethub', name: 'Asset Hub', icon: '🏦', color: 'purple-400' },
  { id: 'astar', name: 'Astar', icon: '⭐', color: 'cyber-green' },
  { id: 'moonbeam', name: 'Moonbeam', icon: '🌙', color: 'yellow-400' },
];

export default function XCMBridgePage() {
  const { address, isConnected } = useAccount();
  const [fromChain, setFromChain] = useState(chains[0]);
  const [toChain, setToChain] = useState(chains[1]);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }
    if (!amount || !recipient) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success('Bridge intent created! Check the dashboard.');
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
          <div className="bg-cyber-blue/10 px-4 py-2 border-b border-cyber-blue/30">
            <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
              XCM_Cross_Chain_Bridge
            </span>
          </div>

          <div className="p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* From Chain */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">From Chain</label>
                <div className="grid grid-cols-5 gap-2">
                  {chains.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => setFromChain(chain)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        fromChain.id === chain.id
                          ? `border-${chain.color} bg-${chain.color}/20`
                          : 'border-gray-700 bg-black/40 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-1">{chain.icon}</div>
                      <div className="text-xs font-orbitron">{chain.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwapChains}
                  className="p-3 rounded-full bg-cyber-blue/20 border border-cyber-blue hover:bg-cyber-blue/30 transition-all"
                >
                  <svg className="w-6 h-6 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* To Chain */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">To Chain</label>
                <div className="grid grid-cols-5 gap-2">
                  {chains.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => setToChain(chain)}
                      disabled={chain.id === fromChain.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        toChain.id === chain.id
                          ? `border-${chain.color} bg-${chain.color}/20`
                          : chain.id === fromChain.id
                          ? 'border-gray-800 bg-black/20 opacity-30 cursor-not-allowed'
                          : 'border-gray-700 bg-black/40 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-1">{chain.icon}</div>
                      <div className="text-xs font-orbitron">{chain.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-black/40 border border-cyber-blue/30 rounded-lg px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-cyber-blue"
                />
              </div>

              {/* Recipient */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-black/40 border border-cyber-blue/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyber-blue"
                />
              </div>

              {/* Bridge Button */}
              <button
                onClick={handleBridge}
                disabled={!isConnected}
                className="w-full py-4 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-lg font-orbitron font-bold text-white uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected ? 'Bridge Assets' : 'Connect Wallet'}
              </button>

              {/* Info */}
              <div className="p-4 bg-cyber-blue/5 rounded-lg border border-cyber-blue/20">
                <div className="flex items-start space-x-2 text-sm">
                  <span className="text-cyber-blue">ℹ️</span>
                  <div className="text-gray-300">
                    <p className="font-bold mb-1">XCM Bridge powered by Polkadot</p>
                    <p className="text-xs text-gray-400">
                      Transfer assets across parachains using native XCM messaging. 
                      Your intent will be executed by our solver network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
