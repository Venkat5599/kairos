'use client';

import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { formatEther } from 'viem';
import { INTENT_REGISTRY_ABI } from '@/lib/abis';

const INTENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS as `0x${string}`;

export interface Intent {
  id: string; // bytes32 as hex string
  creator: string;
  description: string;
  reward: string;
  deadline: number;
  status: 'Pending' | 'Executing' | 'Completed' | 'Failed' | 'Cancelled';
  solver: string;
  createdAt: number;
  executedAt: number;
}

export function useIntents() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  useEffect(() => {
    fetchIntents();
    // Refresh every 10 seconds
    const interval = setInterval(fetchIntents, 10000);
    return () => clearInterval(interval);
  }, [publicClient]);

  const fetchIntents = async () => {
    if (!publicClient || !INTENT_REGISTRY_ADDRESS) {
      setError('Contract not configured');
      setLoading(false);
      return;
    }

    try {
      // Get all intent IDs (bytes32[])
      const intentIds = await publicClient.readContract({
        address: INTENT_REGISTRY_ADDRESS,
        abi: INTENT_REGISTRY_ABI,
        functionName: 'getAllIntentIds',
      }) as `0x${string}`[];

      const fetchedIntents: Intent[] = [];

      // Fetch each intent by its bytes32 ID
      for (const intentId of intentIds) {
        try {
          const intent = await publicClient.readContract({
            address: INTENT_REGISTRY_ADDRESS,
            abi: INTENT_REGISTRY_ABI,
            functionName: 'getIntent',
            args: [intentId],
          }) as any;

          const statusMap = ['Pending', 'Executing', 'Completed', 'Failed', 'Cancelled'] as const;

          fetchedIntents.push({
            id: intentId,
            creator: intent.creator,
            description: intent.description,
            reward: formatEther(intent.reward),
            deadline: Number(intent.deadline),
            status: statusMap[intent.status] || 'Pending',
            solver: intent.solver,
            createdAt: Number(intent.createdAt),
            executedAt: Number(intent.executedAt),
          });
        } catch (err) {
          console.error(`Error fetching intent ${intentId}:`, err);
        }
      }

      setIntents(fetchedIntents);
      setError(null);
    } catch (err) {
      console.error('Error fetching intents:', err);
      setError('Failed to fetch intents from blockchain');
    } finally {
      setLoading(false);
    }
  };

  return { intents, loading, error, refetch: fetchIntents };
}
