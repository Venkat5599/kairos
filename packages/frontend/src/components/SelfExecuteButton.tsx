'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { useSelfExecute, useRegisterSolver, useCheckSolverStatus } from '@/hooks/useSelfExecute';

interface SelfExecuteButtonProps {
  intentId: `0x${string}`;
  onExecuted?: () => void;
}

export default function SelfExecuteButton({ intentId, onExecuted }: SelfExecuteButtonProps) {
  const { address } = useAccount();
  const { isRegistered } = useCheckSolverStatus(address);
  const { registerSolver, isPending: isRegistering, isConfirmed: isRegisterConfirmed } = useRegisterSolver();
  const { executeIntent, completeIntent, isPending: isExecuting, isConfirmed: isExecuteConfirmed } = useSelfExecute();
  
  const [step, setStep] = useState<'register' | 'execute' | 'complete' | 'done'>('register');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isRegistered) {
      setStep('execute');
    }
  }, [isRegistered]);

  useEffect(() => {
    if (isRegisterConfirmed && step === 'register') {
      toast.success('Registered as solver!');
      setStep('execute');
      setIsProcessing(false);
    }
  }, [isRegisterConfirmed, step]);

  useEffect(() => {
    if (isExecuteConfirmed && step === 'execute') {
      toast.success('Intent claimed! Completing...');
      setStep('complete');
      // Auto-complete after a short delay
      setTimeout(() => handleComplete(), 2000);
    }
  }, [isExecuteConfirmed, step]);

  const handleRegister = async () => {
    try {
      setIsProcessing(true);
      toast.loading('Registering as solver (1 PAS stake)...', { id: 'register' });
      await registerSolver();
    } catch (err: any) {
      console.error('Registration error:', err);
      setIsProcessing(false);
      toast.dismiss('register');
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        toast.error('Registration cancelled');
      } else {
        toast.error('Failed to register as solver');
      }
    }
  };

  const handleExecute = async () => {
    try {
      setIsProcessing(true);
      toast.loading('Claiming intent...', { id: 'execute' });
      await executeIntent(intentId);
    } catch (err: any) {
      console.error('Execute error:', err);
      setIsProcessing(false);
      toast.dismiss('execute');
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        toast.error('Execution cancelled');
      } else {
        toast.error('Failed to execute intent');
      }
    }
  };

  const handleComplete = async () => {
    try {
      toast.loading('Completing intent...', { id: 'complete' });
      await completeIntent(intentId);
      toast.success('Intent completed!', { id: 'complete' });
      setStep('done');
      setIsProcessing(false);
      onExecuted?.();
    } catch (err: any) {
      console.error('Complete error:', err);
      setIsProcessing(false);
      toast.dismiss('complete');
      toast.error('Failed to complete intent');
    }
  };

  if (step === 'done') {
    return (
      <div className="text-cyber-green text-sm font-orbitron">
        ✅ Executed Successfully
      </div>
    );
  }

  if (step === 'register') {
    return (
      <button
        onClick={handleRegister}
        disabled={isProcessing || isRegistering}
        className="px-4 py-2 bg-cyber-pink/20 hover:bg-cyber-pink/30 border border-cyber-pink text-cyber-pink font-orbitron text-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Registering...' : '🚀 Register & Execute (1 PAS)'}
      </button>
    );
  }

  if (step === 'execute') {
    return (
      <button
        onClick={handleExecute}
        disabled={isProcessing || isExecuting}
        className="px-4 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-cyber-blue font-orbitron text-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Executing...' : '⚡ Execute Now'}
      </button>
    );
  }

  if (step === 'complete') {
    return (
      <div className="text-cyber-blue text-sm font-orbitron animate-pulse">
        ⏳ Completing...
      </div>
    );
  }

  return null;
}
