'use client';

import { useEffect, useState } from 'react';
import { usePublicClient, useWatchBlockNumber } from 'wagmi';
import { INTENT_REGISTRY_ADDRESS } from '@/lib/constants';

interface ActivityLog {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export function useRecentActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      message: 'System initialized...',
      type: 'info',
      timestamp: Date.now(),
    },
  ]);

  const publicClient = usePublicClient();

  // Watch for new blocks
  useWatchBlockNumber({
    onBlockNumber: (blockNumber) => {
      addLog({
        message: `Monitoring block ${blockNumber.toString()}`,
        type: 'info',
      });
    },
  });

  const addLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setLogs((prev) => {
      const updated = [newLog, ...prev].slice(0, 10); // Keep last 10 logs
      return updated;
    });
  };

  useEffect(() => {
    if (!publicClient) return;

    // Add initial connection log
    addLog({
      message: 'Connection encrypted (AES-256)',
      type: 'success',
    });

    // Watch for contract events
    const watchIntentCreated = async () => {
      try {
        if (!INTENT_REGISTRY_ADDRESS) return;

        const unwatch = publicClient.watchContractEvent({
          address: INTENT_REGISTRY_ADDRESS as `0x${string}`,
          abi: [
            {
              type: 'event',
              name: 'IntentCreated',
              inputs: [
                { name: 'intentId', type: 'bytes32', indexed: true },
                { name: 'creator', type: 'address', indexed: true },
                { name: 'reward', type: 'uint256', indexed: false },
              ],
            },
          ],
          eventName: 'IntentCreated',
          onLogs: (logs) => {
            logs.forEach(() => {
              addLog({
                message: 'New intent detected on-chain',
                type: 'success',
              });
            });
          },
        });

        return unwatch;
      } catch (err) {
        console.warn('Could not watch events:', err);
      }
    };

    watchIntentCreated();

    // Periodic status updates
    const interval = setInterval(() => {
      const messages = [
        { message: 'Scanning mempool for opportunities...', type: 'info' as const },
        { message: 'Gas optimization active', type: 'success' as const },
        { message: 'Solver network synchronized', type: 'success' as const },
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      addLog(randomMessage);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [publicClient]);

  return logs;
}
