'use client';

import { useState, memo, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { useCreateIntent } from '@/hooks/useContracts';
import { parseIntentCommand, validateIntentParams } from '@/lib/utils';
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
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const { createIntent, hash, isPending, isConfirming, isConfirmed, error } = useCreateIntent();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          toast.success('🎤 Listening... Speak your intent', { id: 'voice' });
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCommand(transcript);
          toast.success(`Heard: "${transcript}"`, { id: 'voice' });
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'no-speech') {
            toast.error('No speech detected. Please try again.', { id: 'voice' });
          } else if (event.error === 'not-allowed') {
            toast.error('Microphone access denied. Please enable it in browser settings.', { id: 'voice' });
          } else {
            toast.error('Voice recognition error. Please try again.', { id: 'voice' });
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Could not start voice recognition', { id: 'voice' });
      }
    }
  };

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

    if (!command.trim()) {
      toast.error('Please enter an intent command');
      return;
    }

    try {
      const parsed = await parseIntentCommand(command);
      const { description, estimatedReward } = parsed;

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

      setIsProcessing(true);
      toast.loading('Creating and executing intent...', { id: 'intent-tx' });

      await createIntent({
        description,
        data: '0x',
        reward: parseEther(estimatedReward),
        deadline: BigInt(deadline),
        rewardToken: '0x0000000000000000000000000000000000000000', // Native DEV token
      });
    } catch (err: any) {
      console.error('Intent creation error:', err);
      setIsProcessing(false);
      toast.dismiss('intent-tx');

      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        toast.error('Transaction rejected by user');
      } else if (err.message?.includes('insufficient funds')) {
        toast.error('Insufficient funds for transaction');
      } else if (err.message?.includes('user rejected')) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error(err.message || 'Failed to create intent');
        console.error('Full error:', err);
      }
    }
  };

  // Handle transaction states with useEffect
  useEffect(() => {
    if (isPending && !isProcessing) {
      console.log('Transaction pending - waiting for user confirmation');
      setIsProcessing(true);
      toast.loading('Confirm transaction in wallet...', { id: 'intent-tx' });
    }
  }, [isPending, isProcessing]);

  useEffect(() => {
    if (isConfirming && isProcessing) {
      console.log('Transaction confirming on blockchain...');
      toast.loading('Transaction confirming...', { id: 'intent-tx' });
    }
  }, [isConfirming, isProcessing]);

  useEffect(() => {
    if (isConfirmed && isProcessing) {
      console.log('Transaction confirmed! Hash:', hash);
      toast.success('Intent created successfully!', { id: 'intent-tx' });
      setCommand('');
      setIsProcessing(false);
      onIntentCreated?.();
    }
  }, [isConfirmed, isProcessing, onIntentCreated, hash]);

  useEffect(() => {
    if (error && isProcessing) {
      console.error('Transaction error:', error);
      setIsProcessing(false);
      toast.dismiss('intent-tx');
      toast.error(error.message || 'Transaction failed');
    }
  }, [error, isProcessing]);

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
                placeholder="Enter your intent or click the mic..."
                disabled={isProcessing || isListening}
              />
              {isVoiceSupported && (
                <button
                  onClick={toggleVoiceInput}
                  disabled={isProcessing}
                  className={`ml-2 p-2 rounded transition-all ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 animate-pulse'
                      : 'bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/30'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
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
