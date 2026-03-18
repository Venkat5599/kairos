'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { createScheduledIntent } from '@/hooks/useScheduledIntents';
import toast from 'react-hot-toast';

interface ScheduleIntentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialTemplate?: any;
}

export default function ScheduleIntentModal({ onClose, onSuccess, initialTemplate }: ScheduleIntentModalProps) {
  const { address } = useAccount();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleType, setScheduleType] = useState<'once' | 'recurring'>('once');
  const [executeAt, setExecuteAt] = useState('');
  const [cronPreset, setCronPreset] = useState('daily');
  const [time, setTime] = useState('09:00');
  const [intentTemplate, setIntentTemplate] = useState(
    initialTemplate ? JSON.stringify(initialTemplate, null, 2) : ''
  );
  const [loading, setLoading] = useState(false);

  const getCronExpression = () => {
    const [hour, minute] = time.split(':');

    switch (cronPreset) {
      case 'daily':
        return `${minute} ${hour} * * *`;
      case 'weekly':
        return `${minute} ${hour} * * 1`; // Monday
      case 'monthly':
        return `${minute} ${hour} 1 * *`; // 1st of month
      default:
        return `${minute} ${hour} * * *`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!name || !description || !intentTemplate) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      let template;
      try {
        template = JSON.parse(intentTemplate);
      } catch {
        toast.error('Invalid JSON in intent template');
        return;
      }

      const dto: any = {
        creator: address,
        name,
        description,
        intentTemplate: template,
      };

      if (scheduleType === 'once') {
        if (!executeAt) {
          toast.error('Please select execution time');
          return;
        }
        dto.executeAt = new Date(executeAt).toISOString();
      } else {
        dto.cronExpression = getCronExpression();
      }

      await createScheduledIntent(dto);
      toast.success('Schedule created successfully');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create schedule:', err);
      toast.error('Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto blue-glow-border">
        <div className="bg-cyber-blue/10 px-4 py-3 border-b border-cyber-blue/30 flex justify-between items-center sticky top-0">
          <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
            Schedule_Intent
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs text-gray-400 uppercase mb-2">Schedule Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-cyber-blue"
              placeholder="e.g., Daily DOT Transfer"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-cyber-blue h-20"
              placeholder="Describe what this schedule does..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase mb-2">Schedule Type</label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setScheduleType('once')}
                className={`flex-1 py-2 rounded border font-orbitron text-sm transition-all ${
                  scheduleType === 'once'
                    ? 'bg-cyber-blue/20 border-cyber-blue/50 text-cyber-blue'
                    : 'bg-black/40 border-gray-500/30 text-gray-400'
                }`}
              >
                One-Time
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('recurring')}
                className={`flex-1 py-2 rounded border font-orbitron text-sm transition-all ${
                  scheduleType === 'recurring'
                    ? 'bg-cyber-blue/20 border-cyber-blue/50 text-cyber-blue'
                    : 'bg-black/40 border-gray-500/30 text-gray-400'
                }`}
              >
                Recurring
              </button>
            </div>
          </div>

          {scheduleType === 'once' ? (
            <div>
              <label className="block text-xs text-gray-400 uppercase mb-2">Execute At</label>
              <input
                type="datetime-local"
                value={executeAt}
                onChange={(e) => setExecuteAt(e.target.value)}
                className="w-full bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-cyber-blue"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 uppercase mb-2">Frequency</label>
                <select
                  value={cronPreset}
                  onChange={(e) => setCronPreset(e.target.value)}
                  className="w-full bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-cyber-blue"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly (Monday)</option>
                  <option value="monthly">Monthly (1st)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-cyber-blue"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 uppercase mb-2">Intent Template (JSON)</label>
            <textarea
              value={intentTemplate}
              onChange={(e) => setIntentTemplate(e.target.value)}
              className="w-full bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyber-blue h-40"
              placeholder='{"chainId": 1, "description": "Transfer 10 DOT", "data": "...", "reward": "1000000000000000000", "deadline": 1234567890}'
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 font-orbitron py-3 rounded border border-gray-500/30 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue font-orbitron py-3 rounded border border-cyber-blue/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
