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

// Mock data for demo purposes
const MOCK_INTENTS: MarketplaceIntent[] = [
  {
    id: '1',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    name: 'Simple Transfer',
    description: 'Send tokens to any address on Polkadot Hub',
    category: 'transfer',
    difficulty: 'beginner',
    template: { command: 'send 0.1 PAS to 0x...' },
    icon: '💸',
    usageCount: 245,
    successRate: 98.5,
    avgGasSaved: '0.002',
    rating: 4.8,
    ratingCount: 42,
    isPublic: true,
    isFeatured: true,
    tags: ['transfer', 'simple', 'beginner'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    name: 'Cross-Chain Bridge',
    description: 'Bridge assets from Polkadot Hub to Asset Hub',
    category: 'cross-chain',
    difficulty: 'intermediate',
    template: { command: 'bridge 1 PAS to assethub 0x...' },
    icon: '🌉',
    usageCount: 189,
    successRate: 95.2,
    avgGasSaved: '0.005',
    rating: 4.6,
    ratingCount: 38,
    isPublic: true,
    isFeatured: true,
    tags: ['bridge', 'xcm', 'cross-chain'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    name: 'Batch Transfer',
    description: 'Send tokens to multiple addresses in one transaction',
    category: 'transfer',
    difficulty: 'intermediate',
    template: { command: 'batch send 0.1 PAS to [0x..., 0x..., 0x...]' },
    icon: '📦',
    usageCount: 156,
    successRate: 97.1,
    avgGasSaved: '0.008',
    rating: 4.7,
    ratingCount: 29,
    isPublic: true,
    isFeatured: false,
    tags: ['batch', 'transfer', 'multi'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    name: 'Staking Intent',
    description: 'Stake tokens on Polkadot validators',
    category: 'staking',
    difficulty: 'advanced',
    template: { command: 'stake 10 PAS to validator 0x...' },
    icon: '🔒',
    usageCount: 98,
    successRate: 99.0,
    avgGasSaved: '0.003',
    rating: 4.9,
    ratingCount: 21,
    isPublic: true,
    isFeatured: true,
    tags: ['staking', 'defi', 'validator'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    name: 'DeFi Swap',
    description: 'Swap tokens on decentralized exchanges',
    category: 'defi',
    difficulty: 'intermediate',
    template: { command: 'swap 1 PAS for DOT on dex' },
    icon: '🔄',
    usageCount: 134,
    successRate: 96.8,
    avgGasSaved: '0.004',
    rating: 4.5,
    ratingCount: 31,
    isPublic: true,
    isFeatured: false,
    tags: ['swap', 'defi', 'dex'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    name: 'Governance Vote',
    description: 'Vote on governance proposals',
    category: 'governance',
    difficulty: 'beginner',
    template: { command: 'vote yes on proposal #123' },
    icon: '🗳️',
    usageCount: 87,
    successRate: 99.5,
    avgGasSaved: '0.001',
    rating: 4.8,
    ratingCount: 18,
    isPublic: true,
    isFeatured: false,
    tags: ['governance', 'vote', 'dao'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function filterMockIntents(intents: MarketplaceIntent[], filters?: MarketplaceFilters): MarketplaceIntent[] {
  let filtered = [...intents];

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter(i => i.category === filters.category);
  }

  if (filters?.difficulty && filters.difficulty !== 'all') {
    filtered = filtered.filter(i => i.difficulty === filters.difficulty);
  }

  if (filters?.isFeatured !== undefined) {
    filtered = filtered.filter(i => i.isFeatured === filters.isFeatured);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(i => 
      i.name.toLowerCase().includes(search) ||
      i.description.toLowerCase().includes(search) ||
      i.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }

  return filtered;
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
      // Use mock data as fallback
      console.log('Using mock marketplace data for demo');
      setIntents(filterMockIntents(MOCK_INTENTS, filters));
      setError(null); // Don't show error when using mock data
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
      // Use mock data as fallback - top rated templates
      const topTemplates = [...MOCK_INTENTS]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
      setLeaderboard(topTemplates);
      setError(null);
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
