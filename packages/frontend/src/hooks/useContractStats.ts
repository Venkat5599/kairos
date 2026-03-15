'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { INTENT_REGISTRY_ABI } from '@/lib/abis';

const INTENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS as `0x${string}`;

interface ContractStats {
  totalIntents: number;
  pendingIntents: number;
  completedIntents: number;
  failedIntents: number;
  successRate: string;
}

export function useContractStats() {
  const [stats, setStats] = useState<ContractStats>({
    totalIntents: 0,
    pendingIntents: 0,
    completedIntents: 0,
    failedIntents: 0,
    successRate: '0%',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  const fetchStats = useCallback(async () => {
    if (!INTENT_REGISTRY_ADDRESS || !publicClient) {
      setError('Contract address not configured');
      setLoading(false);
      return;
    }

    try {
      // Get all intent IDs
      const intentIds = await publicClient.readContract({
        address: INTENT_REGISTRY_ADDRESS,
        abi: INTENT_REGISTRY_ABI,
        functionName: 'getAllIntentIds',
      }) as `0x${string}`[];

      const totalIntents = intentIds.length;
      
      if (totalIntents === 0) {
        setStats({
          totalIntents: 0,
          pendingIntents: 0,
          completedIntents: 0,
          failedIntents: 0,
          successRate: '0%',
        });
        setError(null);
        setLoading(false);
        return;
      }

      let pendingIntents = 0;
      let completedIntents = 0;
      let failedIntents = 0;

      // Count intents by status
      for (const intentId of intentIds) {
        try {
          const intent = await publicClient.readContract({
            address: INTENT_REGISTRY_ADDRESS,
            abi: INTENT_REGISTRY_ABI,
            functionName: 'intents',
            args: [intentId],
          }) as any;

          const status = intent.status;
          if (status === 0) pendingIntents++;
          else if (status === 2) completedIntents++;
          else if (status === 3) failedIntents++;
        } catch (err) {
          // Skip if intent can't be read
          console.warn('Could not read intent:', intentId);
        }
      }

      const successRate = totalIntents > 0 
        ? `${Math.round((completedIntents / totalIntents) * 100)}%`
        : '0%';

      setStats({
        totalIntents,
        pendingIntents,
        completedIntents,
        failedIntents,
        successRate,
      });

      setError(null);
    } catch (err: any) {
      console.error('Error fetching contract stats:', err);
      setStats({
        totalIntents: 0,
        pendingIntents: 0,
        completedIntents: 0,
        failedIntents: 0,
        successRate: '0%',
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
