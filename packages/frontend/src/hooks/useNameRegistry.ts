'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NAME_REGISTRY_ABI } from '@/lib/abis';

const NAME_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_NAME_REGISTRY_ADDRESS as `0x${string}`;

export function useNameRegistry() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Register or update name
  const registerName = (name: string) => {
    if (!NAME_REGISTRY_ADDRESS) {
      throw new Error('NameRegistry contract not deployed yet');
    }
    writeContract({
      address: NAME_REGISTRY_ADDRESS,
      abi: NAME_REGISTRY_ABI,
      functionName: 'registerName',
      args: [name],
    });
  };

  // Release name
  const releaseName = () => {
    if (!NAME_REGISTRY_ADDRESS) {
      throw new Error('NameRegistry contract not deployed yet');
    }
    writeContract({
      address: NAME_REGISTRY_ADDRESS,
      abi: NAME_REGISTRY_ABI,
      functionName: 'releaseName',
    });
  };

  return {
    registerName,
    releaseName,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook to resolve name to address
export function useResolveName(name: string | undefined) {
  return useReadContract({
    address: NAME_REGISTRY_ADDRESS,
    abi: NAME_REGISTRY_ABI,
    functionName: 'resolve',
    args: name ? [name] : undefined,
    query: {
      enabled: !!name && !!NAME_REGISTRY_ADDRESS,
    },
  });
}

// Hook to get name for address
export function useGetName(address: `0x${string}` | undefined) {
  return useReadContract({
    address: NAME_REGISTRY_ADDRESS,
    abi: NAME_REGISTRY_ABI,
    functionName: 'addressToName',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!NAME_REGISTRY_ADDRESS,
    },
  });
}

// Hook to check if name is available
export function useIsNameAvailable(name: string | undefined) {
  return useReadContract({
    address: NAME_REGISTRY_ADDRESS,
    abi: NAME_REGISTRY_ABI,
    functionName: 'isAvailable',
    args: name ? [name] : undefined,
    query: {
      enabled: !!name && !!NAME_REGISTRY_ADDRESS && name.length >= 3,
    },
  });
}
