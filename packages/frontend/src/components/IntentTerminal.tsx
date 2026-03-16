'use client';

import { useState, memo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { useCreateIntent } from '@/hooks/useContracts';
import { parseIntentCommand, validateIntentParams, isName, isAddress } from '@/lib/utils';
import { DEFAULT_DEADLINE_HOURS } from '@/lib/constants';
import IntentSuggestions from './IntentSuggestions';

interface IntentTerminalProps {
  onIntentCreated?: () => void;
  initialCommand?: string;
}

const IntentTerminal = memo(function IntentTerminal({ onIntentCreated, initialCommand = '' }: IntentTerminalProps) {
  const { address, isConnected } = useAccount();
  const [command, setCommand] = useState(initialCommand || 'send 0.01 DEV to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const [isProcessing, setIsProcessing] = useState(false);

  const { createIntent, hash, isPending, isConfirming, isConfirmed, error } = useCreateIntent();

  // Update command when initialCommand changes
  useEffect(() => {
    if (initialCommand) {
      setCommand(initialCommand);
    }
  }, [initialCommand]);

  const handleExecute = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    const { description, estimatedReward, recipient } = parseIntentCommand(command);

    // Note: Cross-chain intents are supported! The solver bot will handle them.
    // No need to validate recipient format here - let the solver parse it.

    const deadline = Math.floor(Date.now() / 1000) + DEFAULT_DEADLINE_HOURS * 3600;

    const validation = validateIntentParams({
      description,
      reward: estimatedReward,
      deadline,
    });

    if (!validation.valid) {
      toast.error(validation.error || 'Invalid intent parameters');
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading('Preparing transaction...', { id: 'intent-tx' });

      await createIntent({
        description,
        data: '0x',
        reward: parseEther(estimatedReward),
        deadline: BigInt(deadline),
      });
    } catch (err: any) {
      console.error('Intent creation error:', err);
      setIsProcessing(false);
      toast.dismiss('intent-tx');

      if (err.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected');
      } else if (err.message?.includes('insufficient funds')) {
        toast.error('Insufficient funds');
      } else {
        toast.error('Failed to create intent');
      }
    }
  };

  // Handle transaction states
  if (isPending && !isProcessing) {
    setIsProcessing(true);
    toast.loading('Confirm transaction in wallet...', { id: 'intent-tx' });
  }

  if (isConfirming && isProcessing) {
    toast.loading('Transaction confirming...', { id: 'intent-tx' });
  }

  if (isConfirmed && isProcessing) {
    toast.success('Intent created successfully!', { id: 'intent-tx' });
    setCommand('');
    setIsProcessing(false);
    onIntentCreated?.();
  }

  if (error && isProcessing) {
    setIsProcessing(false);
    toast.dismiss('intent-tx');
  }

  return (
    <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
      <div className="bg-cyber-blue/10 px-4 py-2 border-b border-cyber-blue/30 flex justify-between items-center">
        <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
          New_Intent_Protocol
        </span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow w-full relative">
            <div className="bg-black/40 p-4 rounded border border-cyber-blue/20 font-mono text-sm md:text-base flex items-center">
              <span className="text-cyber-green mr-2">&gt; $</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none"
                placeholder="Enter your intent..."
                disabled={isProcessing}
              />
              <span className="animate-pulse bg-cyber-blue w-2 h-5 ml-1"></span>
            </div>
            <IntentSuggestions input={command} onSelect={setCommand} />
          </div>
          <button
            onClick={handleExecute}
            disabled={!isConnected || isProcessing}
            className="w-full md:w-auto px-8 py-4 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-cyber-blue font-orbitron font-bold rounded flex items-center justify-center transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2 uppercase tracking-widest">
              {isProcessing ? 'Processing...' : 'Execute'}
            </span>
            <svg
              className="w-4 h-4 group-hover:scale-125 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.243 16.243a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default IntentTerminal;
