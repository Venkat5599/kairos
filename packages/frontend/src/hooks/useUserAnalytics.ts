import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

export interface UserAnalytics {
  totalIntents: number;
  completedIntents: number;
  failedIntents: number;
  pendingIntents: number;
  successRate: string;
  totalRewardsPaid: string;
  avgExecutionTime: string;
  estimatedGasSaved: string;
}

export function useUserAnalytics(address?: string) {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/analytics/user/${address}?address=${address}`);
      setAnalytics(response.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Failed to fetch user analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

export interface GasOptimizationMetrics {
  totalGasSaved: string;
  avgGasSavedPerIntent: string;
  totalExecutions: number;
  optimizationRate: string;
}

export function useGasOptimization() {
  const [metrics, setMetrics] = useState<GasOptimizationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/gas-optimization');
      setMetrics(response.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Failed to fetch gas optimization metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

export interface SolverStats {
  address: string;
  totalExecuted: number;
  totalFailed: number;
  reputation: number;
  successRate: string;
  avgGasUsed: string;
  stake: string;
}

export function useSolverLeaderboard(limit = 10) {
  const [solvers, setSolvers] = useState<SolverStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/solvers/leaderboard?limit=${limit}`);
      setSolvers(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Failed to fetch solver leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return { solvers, loading, error, refetch: fetchLeaderboard };
}

export interface TimeSeriesData {
  date: string;
  totalIntents: number;
  completedIntents: number;
  failedIntents: number;
  uniqueUsers: number;
  successRate: string;
}

export function useTimeSeriesData(days = 30) {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/timeseries?days=${days}`);
      setData(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Failed to fetch time series data:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
