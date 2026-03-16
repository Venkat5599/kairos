'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { INTENT_REGISTRY_ABI } from '@/lib/abis';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS as `0x${string}`;

export function useContracts() {
  const useGetIntent = (intentId: `0x${string}`) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi: INTENT_REGISTRY_ABI,
      functionName: 'getIntent',
      args: [intentId],
    });
  };

  return {
    useGetIntent,
    contractAddress: CONTRACT_ADDRESS,
    abi: INTENT_REGISTRY_ABI,
  };
}

export function useCreateIntent() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const createIntent = async (params: {
    description: string;
    data: `0x${string}`;
    reward: bigint;
    deadline: bigint;
  }) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: INTENT_REGISTRY_ABI,
      functionName: 'createIntent',
      args: [params],
      value: params.reward,
    });
  };

  return {
    createIntent,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}
