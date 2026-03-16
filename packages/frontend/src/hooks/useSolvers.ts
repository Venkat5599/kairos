'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { polkadotHubTestnet } from '@/lib/wagmi';
import { INTENT_REGISTRY_ABI } from '@/lib/abis';

const INTENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS as `0x${string}`;

interface Solver {
  address: string;
  reputation: number;
  totalExecuted: number;
  totalFailed: number;
  stake: string;
  isActive: boolean;
  registeredAt: number;
}

export function useSolvers() {
  const [solvers, setSolvers] = useState<Solver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  const fetchSolvers = useCallback(async () => {
    if (!INTENT_REGISTRY_ADDRESS) {
      setError('Contract address not configured');
      setLoading(false);
      return;
    }

    // Create a public client if wagmi's doesn't exist
    const client = publicClient || createPublicClient({
      chain: polkadotHubTestnet,
      transport: http('https://eth-rpc-testnet.polkadot.io'),
    });

    try {
      // For now, we'll fetch the solver bot's address from env
      // In production, you'd have a way to track all registered solvers
      const solverAddresses = [
        process.env.NEXT_PUBLIC_SOLVER_ADDRESS || '0x9700e80cffFE423ACFE4D8206B3f88306D5410EF',
      ];

      const fetchedSolvers: Solver[] = [];

      for (const address of solverAddresses) {
        try {
          const solverInfo = await client.readContract({
            address: INTENT_REGISTRY_ADDRESS,
            abi: INTENT_REGISTRY_ABI,
            functionName: 'getSolverInfo',
            args: [address as `0x${string}`],
          }) as any;

          if (solverInfo.isActive) {
            fetchedSolvers.push({
              address: solverInfo.solverAddress,
              reputation: Number(solverInfo.reputation),
              totalExecuted: Number(solverInfo.totalExecuted),
              totalFailed: Number(solverInfo.totalFailed),
              stake: solverInfo.stake.toString(),
              isActive: solverInfo.isActive,
              registeredAt: Number(solverInfo.registeredAt),
            });
          }
        } catch (err) {
          console.error(`Error fetching solver ${address}:`, err);
        }
      }

      // Sort by reputation (highest first)
      fetchedSolvers.sort((a, b) => b.reputation - a.reputation);

      setSolvers(fetchedSolvers);
      setError(null);
    } catch (err) {
      console.error('Error fetching solvers:', err);
      setError('Failed to fetch solvers from blockchain');
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchSolvers();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSolvers, 30000);
    return () => clearInterval(interval);
  }, [fetchSolvers]);

  return {
    solvers,
    loading,
    error,
    refetch: fetchSolvers,
  };
}
