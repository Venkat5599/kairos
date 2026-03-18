'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

interface ScheduledIntent {
  id: string;
  creator: string;
  name: string;
  description: string;
  intentTemplate: any;
  cronExpression?: string;
  executeAt?: string;
  isActive: boolean;
  lastExecutedAt?: string;
  nextExecutionAt?: string;
  executionCount: number;
  createdAt: string;
}

interface ScheduledExecution {
  id: string;
  scheduledIntentId: string;
  intentId?: string;
  status: string;
  executedAt?: string;
  error?: string;
  conditionsMet: boolean;
}

export function useScheduledIntents(creator?: string) {
  const [intents, setIntents] = useState<ScheduledIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIntents = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (creator) params.creator = creator;

      const response = await api.get('/scheduling/intents', { params });
      setIntents(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch scheduled intents:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [creator]);

  useEffect(() => {
    fetchIntents();
    const interval = setInterval(fetchIntents, 30000);
    return () => clearInterval(interval);
  }, [fetchIntents]);

  return { intents, loading, error, refetch: fetchIntents };
}

export function useScheduledIntent(id: string) {
  const [intent, setIntent] = useState<ScheduledIntent | null>(null);
  const [executions, setExecutions] = useState<ScheduledExecution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntent = async () => {
      try {
        const response = await api.get(`/scheduling/intents/${id}`);
        setIntent(response.data);
        setExecutions(response.data.executions || []);
      } catch (err) {
        console.error('Failed to fetch scheduled intent:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIntent();
  }, [id]);

  return { intent, executions, loading };
}

export async function createScheduledIntent(dto: any) {
  return api.post('/scheduling/intents', dto);
}

export async function updateScheduledIntent(id: string, dto: any) {
  return api.patch(`/scheduling/intents/${id}`, dto);
}

export async function deleteScheduledIntent(id: string) {
  return api.delete(`/scheduling/intents/${id}`);
}
