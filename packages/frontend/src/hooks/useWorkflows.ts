'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

interface Workflow {
  id: string;
  creator: string;
  name: string;
  description: string;
  steps: any[];
  isPublished: boolean;
  executionCount: number;
  createdAt: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: string;
  currentStep: number;
  results: any;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export function useWorkflows(creator?: string) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (creator) params.creator = creator;

      const response = await api.get('/workflows', { params });
      setWorkflows(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [creator]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return { workflows, loading, error, refetch: fetchWorkflows };
}

export function useWorkflow(id: string) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await api.get(`/workflows/${id}`);
        setWorkflow(response.data);
        setExecutions(response.data.executions || []);
      } catch (err) {
        console.error('Failed to fetch workflow:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [id]);

  return { workflow, executions, loading };
}

export function useWorkflowExecution(executionId: string) {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecution = async () => {
      try {
        const response = await api.get(`/workflows/executions/${executionId}`);
        setExecution(response.data);
      } catch (err) {
        console.error('Failed to fetch execution:', err);
      }
    };

    fetchExecution();
    const interval = setInterval(fetchExecution, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [executionId]);

  return { execution, loading };
}

export async function createWorkflow(dto: any) {
  return api.post('/workflows', dto);
}

export async function executeWorkflow(id: string, variables: Record<string, any>) {
  return api.post(`/workflows/${id}/execute`, { variables });
}

export async function deleteWorkflow(id: string) {
  return api.delete(`/workflows/${id}`);
}

export async function publishWorkflow(id: string) {
  return api.post(`/workflows/${id}/publish`);
}
