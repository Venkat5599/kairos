'use client';

import { useState, useCallback, useEffect } from 'react';
import { intentApi } from '@/lib/api';

interface Solver {
  address: string;
  reputation: number;
  totalExecuted: number;
  totalFailed: number;
  stake: string;
}

export function useSolvers() {
  const [solvers, setSolvers] = useState<Solver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSolvers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await intentApi.getSolvers();
      setSolvers(response.data.solvers || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch solvers:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolvers();
  }, [fetchSolvers]);

  return {
    solvers,
    loading,
    error,
    refetch: fetchSolvers,
  };
}
