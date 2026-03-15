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

        // Note: Contract doesn't have a solverCount function
        // We'll show 0 or could add this function to the contract later
        const solverCount = 0;

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
