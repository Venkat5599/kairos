'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchStats();
    // Refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [publicClient]);

  const fetchStats = async () => {
    if (!publicClient || !INTENT_REGISTRY_ADDRESS) {
      setError('Contract not configured');
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

      const total = intentIds.length;

      // Get pending intents count directly
      const pendingIntents = await publicClient.readContract({
        address: INTENT_REGISTRY_ADDRESS,
        abi: INTENT_REGISTRY_ABI,
        functionName: 'getPendingIntentsCount',
      }) as bigint;

      const pending = Number(pendingIntents);

      // Calculate completed and failed by checking each intent
      let completed = 0;
      let failed = 0;

      // Fetch status of all intents (status: 0=Pending, 1=Executing, 2=Completed, 3=Failed, 4=Cancelled)
      for (const intentId of intentIds) {
        try {
          const intent = await publicClient.readContract({
            address: INTENT_REGISTRY_ADDRESS,
            abi: INTENT_REGISTRY_ABI,
            functionName: 'getIntent',
            args: [intentId],
          }) as any;

          const status = intent.status;
          if (status === 2) completed++;
          if (status === 3) failed++;
        } catch (err) {
          console.error(`Error fetching intent ${intentId}:`, err);
        }
      }

      const successRate = total > 0
        ? ((completed / total) * 100).toFixed(1) + '%'
        : '0%';

      setStats({
        totalIntents: total,
        pendingIntents: pending,
        completedIntents: completed,
        failedIntents: failed,
        successRate,
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching contract stats:', err);
      setError('Failed to fetch stats from blockchain');
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
}
