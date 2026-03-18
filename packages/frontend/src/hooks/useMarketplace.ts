import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

export interface MarketplaceIntent {
  id: string;
  creator: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  template: any;
  icon?: string;
  usageCount: number;
  successRate: number;
  avgGasSaved: string;
  rating: number;
  ratingCount: number;
  isPublic: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceFilters {
  category?: string;
  difficulty?: string;
  isFeatured?: boolean;
  search?: string;
}

export function useMarketplace(filters?: MarketplaceFilters) {
  const [intents, setIntents] = useState<MarketplaceIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIntents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get(`/marketplace/intents?${params.toString()}`);
      setIntents(response.data.intents || []);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Failed to fetch marketplace intents:', err);
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.difficulty, filters?.isFeatured, filters?.search]);

  useEffect(() => {
    fetchIntents();
  }, [fetchIntents]);

  return { intents, loading, error, refetch: fetchIntents };
}

export function useMarketplaceIntent(id: string) {
  const [intent, setIntent] = useState<MarketplaceIntent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIntent = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await api.get(`/marketplace/intents/${id}`);
      setIntent(response.data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Failed to fetch marketplace intent:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchIntent();
  }, [fetchIntent]);

  return { intent, loading, error, refetch: fetchIntent };
}

export function useMarketplaceLeaderboard(limit = 10) {
  const [leaderboard, setLeaderboard] = useState<MarketplaceIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/marketplace/leaderboard?limit=${limit}`);
      setLeaderboard(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
}

export async function rateIntent(intentId: string, userId: string, rating: number, review?: string) {
  try {
    const response = await api.post(`/marketplace/intents/${intentId}/rate?userId=${userId}`, {
      rating,
      review,
    });
    return response.data;
  } catch (err) {
    console.error('Failed to rate intent:', err);
    throw err;
  }
}

export async function cloneIntent(
  intentId: string,
  userId: string,
  createdIntentId: string,
  success?: boolean,
  gasSaved?: string,
  executionTime?: number
) {
  try {
    const response = await api.post(`/marketplace/intents/${intentId}/clone`, {
      userId,
      intentId: createdIntentId,
      success,
      gasSaved,
      executionTime,
    });
    return response.data;
  } catch (err) {
    console.error('Failed to clone intent:', err);
    throw err;
  }
}

export async function seedMarketplace() {
  try {
    const response = await api.post('/marketplace/seed');
    return response.data;
  } catch (err) {
    console.error('Failed to seed marketplace:', err);
    throw err;
  }
}
