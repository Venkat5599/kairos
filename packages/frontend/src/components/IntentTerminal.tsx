'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { useCreateIntent } from '@/hooks/useContracts';
import { useResolveName } from '@/hooks/useNameRegistry';
import { intentApi } from '@/lib/api';
import { parseIntentCommand, validateIntentParams, isName, isAddress } from '@/lib/utils';
import { DEFAULT_DEADLINE_HOURS } from '@/lib/constants';

interface IntentTerminalProps {
  onIntentCreated?: () => void;
}

export default function IntentTerminal({ onIntentCreated }: IntentTerminalProps) {
  const { address, isConnected } = useAccount();
  const [command, setCommand] = useState('send 20 USDC to Alice on Moonbeam');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolvedRecipient, setResolvedRecipient] = useState<string | null>(null);

  const { createIntent, hash, isPending, isConfirming, isConfirmed, error } = useCreateIntent();

  // Parse command to extract recipient
  const { recipient } = parseIntentCommand(command);

  // Resolve name if recipient looks like a name
  const { data: resolvedAddress } = useResolveName(
    recipient && isName(recipient) ? recipient : undefined
  );

  // Update resolved recipient when address changes
  useEffect(() => {
    if (recipient && isName(recipient) && resolvedAddress) {
      setResolvedRecipient(resolvedAddress as string);
    } else if (recipient && isAddress(recipient)) {
      setResolvedRecipient(recipient);
    } else {
      setResolvedRecipient(null);
    }
  }, [recipient, resolvedAddress]);

  const handleExecute = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    const { description, estimatedReward, recipient } = parseIntentCommand(command);

    // Check if recipient is a name and needs resolution
    if (recipient && isName(recipient)) {
      if (!resolvedAddress || resolvedAddress === '0x0000000000000000000000000000000000000000') {
        toast.error(`Name "${recipient}" not found. Please register it first.`);
        return;
      }
      toast.success(`Resolved "${recipient}" to ${(resolvedAddress as string).slice(0, 10)}...`);
    }

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

  useEffect(() => {
    if (isPending) {
      toast.loading('Confirm transaction in wallet...', { id: 'intent-tx' });
    }
  }, [isPending]);

  useEffect(() => {
    if (isConfirming) {
      toast.loading('Transaction confirming...', { id: 'intent-tx' });
    }
  }, [isConfirming]);

  useEffect(() => {
    const syncToBackend = async () => {
      if (isConfirmed && hash && address) {
        try {
          const { description, estimatedReward } = parseIntentCommand(command);
          const deadline = Math.floor(Date.now() / 1000) + DEFAULT_DEADLINE_HOURS * 3600;

          await intentApi.create({
            chainId: 1287,
            creator: address,
            description,
            reward: parseEther(estimatedReward).toString(),
            deadline,
            txHash: hash,
          });

          toast.success('Intent created successfully!', { id: 'intent-tx' });
          setCommand('');
          onIntentCreated?.();
        } catch (err) {
          console.error('Backend sync error:', err);
          toast.success('Intent created on-chain!', { id: 'intent-tx' });
        } finally {
          setIsProcessing(false);
        }
      }
    };

    syncToBackend();
  }, [isConfirmed, hash, address, command, onIntentCreated]);

  useEffect(() => {
    if (error) {
      setIsProcessing(false);
      toast.dismiss('intent-tx');
    }
  }, [error]);

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
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow bg-black/40 p-4 rounded border border-cyber-blue/20 w-full font-mono text-sm md:text-base flex items-center">
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

        {/* Show resolved recipient if name is detected */}
        {recipient && isName(recipient) && (
          <div className="text-xs">
            {resolvedAddress && resolvedAddress !== '0x0000000000000000000000000000000000000000' ? (
              <div className="flex items-center space-x-2 text-cyber-green">
                <span>✓</span>
                <span>
                  "{recipient}" resolves to {(resolvedAddress as string).slice(0, 10)}...{(resolvedAddress as string).slice(-8)}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-400">
                <span>✗</span>
                <span>Name "{recipient}" not found</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
