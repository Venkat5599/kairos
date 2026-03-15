'use client';

import { useState, useEffect } from 'react';

export default function QuickTutorial() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem('kairos-tutorial-seen');
    if (!hasSeenTutorial) {
      setTimeout(() => setShow(true), 2000); // Show after 2 seconds
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('kairos-tutorial-seen', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel max-w-2xl w-full p-8 rounded-lg border-2 border-cyber-pink/50 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-pulse">⚡</div>
          <h2 className="text-2xl font-orbitron font-bold text-cyber-pink mb-2">
            Welcome to KAIROS
          </h2>
          <p className="text-slate-400 text-sm">
            Execute at the perfect moment
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center text-cyber-blue font-orbitron font-bold">
                1
              </div>
              <div>
                <h3 className="text-white font-orbitron font-bold mb-1">Connect Your Wallet</h3>
                <p className="text-slate-400 text-sm">
                  Click &quot;Connect Wallet&quot; in the top right. Make sure you&apos;re on Moonbase Alpha network.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center text-cyber-blue font-orbitron font-bold">
                2
              </div>
              <div>
                <h3 className="text-white font-orbitron font-bold mb-1">Create an Intent</h3>
                <p className="text-slate-400 text-sm mb-2">
                  Type what you want in natural language in the terminal:
                </p>
                <div className="bg-black/40 p-3 rounded border border-cyber-green/30 font-mono text-xs text-cyber-green">
                  send 0.01 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center text-cyber-blue font-orbitron font-bold">
                3
              </div>
              <div>
                <h3 className="text-white font-orbitron font-bold mb-1">Watch It Execute</h3>
                <p className="text-slate-400 text-sm">
                  Solver bots will automatically detect and execute your intent. You&apos;ll see it in &quot;Active Intents&quot; below!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyber-pink/10 border border-cyber-pink/30 rounded p-4">
            <p className="text-xs text-slate-400">
              <span className="text-cyber-pink font-bold">💡 Tip:</span> Need test tokens? Get free DEV from{' '}
              <a
                href="https://faucet.moonbeam.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-blue hover:underline"
              >
                Moonbeam Faucet
              </a>
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-3 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-cyber-blue font-orbitron font-bold rounded transition-all"
          >
            GOT IT, LET&apos;S START!
          </button>
        </div>
      </div>
    </div>
  );
}
