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

const STATUS_MAP = ['Pending', 'Executing', 'Completed', 'Failed', 'Cancelled'] as const;

export function useIntents() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  const fetchIntents = async () => {
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

      if (intentIds.length === 0) {
        setIntents([]);
        setError(null);
        setLoading(false);
        return;
      }

      // Fetch details for each intent
      const intentPromises = intentIds.map(async (intentId) => {
        try {
          const intent = await publicClient.readContract({
            address: INTENT_REGISTRY_ADDRESS,
            abi: INTENT_REGISTRY_ABI,
            functionName: 'intents',
            args: [intentId],
          }) as any;

          return {
            id: intentId,
            creator: intent.creator,
            description: intent.description,
            reward: formatEther(intent.reward),
            deadline: Number(intent.deadline),
            status: STATUS_MAP[intent.status] || 'Pending',
            solver: intent.solver,
            createdAt: Number(intent.createdAt),
            executedAt: Number(intent.executedAt),
          } as Intent;
        } catch (err) {
          console.warn('Could not read intent:', intentId);
          return null;
        }
      });

      const fetchedIntents = (await Promise.all(intentPromises)).filter(Boolean) as Intent[];
      
      // Sort by creation time (newest first)
      fetchedIntents.sort((a, b) => b.createdAt - a.createdAt);

      setIntents(fetchedIntents);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching intents:', err);
      setIntents([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntents();
    // Refresh every 30 seconds
    const interval = setInterval(fetchIntents, 30000);
    return () => clearInterval(interval);
  }, [publicClient]);

  return { intents, loading, error, refetch: fetchIntents };
}
