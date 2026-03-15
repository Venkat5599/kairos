'use client';

import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { formatGwei } from 'viem';
import { INTENT_REGISTRY_ABI } from '@/lib/abis';

const INTENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS as `0x${string}`;

interface NetworkStatus {
  latency: number;
  gasPrice: string;
  blockNumber: number;
  solverCount: number;
  loading: boolean;
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    latency: 0,
    gasPrice: '0',
    blockNumber: 0,
    solverCount: 0,
    loading: true,
  });

  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) return;

    const fetchNetworkStatus = async () => {
      try {
        const startTime = Date.now();

        // Fetch gas price and block number in parallel
        const [gasPrice, blockNumber] = await Promise.all([
          publicClient.getGasPrice(),
          publicClient.getBlockNumber(),
        ]);

        const latency = Date.now() - startTime;

        // Fetch solver count from contract
        let solverCount = 0;
        try {
          if (INTENT_REGISTRY_ADDRESS) {
            const count = await publicClient.readContract({
              address: INTENT_REGISTRY_ADDRESS,
              abi: INTENT_REGISTRY_ABI,
              functionName: 'solverCount',
            }) as bigint;
            solverCount = Number(count);
          }
        } catch (err) {
          console.warn('Could not fetch solver count:', err);
        }

        setStatus({
          latency,
          gasPrice: formatGwei(gasPrice),
          blockNumber: Number(blockNumber),
          solverCount,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching network status:', error);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchNetworkStatus();
    
    // Refresh every 15 seconds
    const interval = setInterval(fetchNetworkStatus, 15000);
    
    return () => clearInterval(interval);
  }, [publicClient]);

  return status;
}
