'use client';

import { useState, useCallback, useEffect } from 'react';
import { analyticsApi } from '@/lib/api';

interface AnalyticsData {
  stats: {
    totalIntents: number;
    completedIntents: number;
    failedIntents: number;
    pendingIntents: number;
    totalSolvers: number;
    successRate: string;
    totalVolume: string;
  };
  volumeByDay: Array<{
    date: string;
    volume: string;
    count: number;
  }>;
  intentsByStatus: Array<{
    status: string;
    count: number;
  }>;
  recentActivity: Array<{
    id: string;
    description: string;
    status: string;
    creator: string;
    reward: string;
    createdAt: string;
  }>;
  topSolvers: Array<{
    address: string;
    totalExecuted: number;
    reputation: number;
  }>;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const [stats, volumeByDay, intentsByStatus, recentActivity, topSolvers] = await Promise.all([
        analyticsApi.getStats(),
        analyticsApi.getVolumeByDay(),
        analyticsApi.getIntentsByStatus(),
        analyticsApi.getRecentActivity(),
        analyticsApi.getTopSolvers(),
      ]);

      setData({
        stats: stats.data,
        volumeByDay: volumeByDay.data,
        intentsByStatus: intentsByStatus.data,
        recentActivity: recentActivity.data,
        topSolvers: topSolvers.data,
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
