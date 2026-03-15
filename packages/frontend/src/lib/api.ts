import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Intent {
  id: string;
  chainId: number;
  creator: string;
  description: string;
  status: string;
  reward: string;
  deadline: string;
  createdAt: string;
  solver?: {
    address: string;
  };
}

export interface CreateIntentParams {
  chainId: number;
  creator: string;
  description: string;
  data?: string;
  reward: string;
  deadline: number;
  txHash?: string;
}

export const intentApi = {
  create: (params: CreateIntentParams) => api.post<Intent>('/intents', params),
  getAll: (filters?: { status?: string; creator?: string; limit?: number }) =>
    api.get<{ intents: Intent[]; total: number }>('/intents', { params: filters }),
  getById: (id: string) => api.get<Intent>(`/intents/${id}`),
  getPending: () => api.get<Intent[]>('/intents/pending'),
  getByCreator: (address: string) => api.get<Intent[]>(`/intents/creator/${address}`),
  getSolvers: () => api.get('/solvers/leaderboard'),
};

export const analyticsApi = {
  getStats: () =>
    api.get<{
      totalIntents: number;
      completedIntents: number;
      failedIntents: number;
      pendingIntents: number;
      totalSolvers: number;
      successRate: string;
      totalVolume: string;
    }>('/analytics/stats'),
  getRecentActivity: (limit?: number) =>
    api.get('/analytics/recent-activity', { params: { limit } }),
  getTopSolvers: (limit?: number) =>
    api.get('/analytics/top-solvers', { params: { limit } }),
  getVolumeByDay: (days?: number) =>
    api.get('/analytics/volume-by-day', { params: { days } }),
  getIntentsByStatus: () => api.get('/analytics/intents-by-status'),
};
