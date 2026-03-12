'use client';

import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';

interface Stats {
  totalIntents: number;
  completedIntents: number;
  failedIntents: number;
  pendingIntents: number;
  totalSolvers: number;
  successRate: string;
  totalVolume: string;
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await analyticsApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
}
