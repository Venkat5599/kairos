'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { INTENT_REGISTRY_ABI } from '@/lib/abis';
import { parseEther } from 'viem';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS as `0x${string}`;

export function useSelfExecute() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const executeIntent = async (intentId: `0x${string}`) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: INTENT_REGISTRY_ABI,
      functionName: 'executeIntent',
      args: [intentId],
    });
  };

  const completeIntent = async (intentId: `0x${string}`, result: `0x${string}` = '0x') => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: INTENT_REGISTRY_ABI,
      functionName: 'completeIntent',
      args: [intentId, result],
    });
  };

  return {
    executeIntent,
    completeIntent,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

export function useRegisterSolver() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const registerSolver = async () => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: INTENT_REGISTRY_ABI,
      functionName: 'registerSolver',
      value: parseEther('1'), // 1 PAS stake
    });
  };

  return {
    registerSolver,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

export function useCheckSolverStatus(address?: `0x${string}`) {
  const { data: solverInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: INTENT_REGISTRY_ABI,
    functionName: 'getSolverInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const isRegistered = solverInfo ? (solverInfo as any).isActive : false;

  return { isRegistered, solverInfo };
}
