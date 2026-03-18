'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScheduledIntents, deleteScheduledIntent, updateScheduledIntent } from '@/hooks/useScheduledIntents';
import ScheduleIntentModal from '@/components/ScheduleIntentModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatAddress } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SchedulePage() {
  const { address, isConnected } = useAccount();
  const { intents, loading, refetch } = useScheduledIntents(address);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateScheduledIntent(id, { isActive: !currentStatus });
      toast.success(currentStatus ? 'Schedule paused' : 'Schedule resumed');
      refetch();
    } catch (err) {
      toast.error('Failed to update schedule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled intent?')) return;

    try {
      await deleteScheduledIntent(id);
      toast.success('Schedule deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete schedule');
    }
  };

  const getTimeUntil = (date: string) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();

    if (diff < 0) return 'Overdue';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="glass-panel rounded-lg overflow-hidden blue-glow-border">
          <div className="bg-cyber-blue/10 px-4 py-2 border-b border-cyber-blue/30 flex justify-between items-center">
            <span className="text-[10px] font-orbitron text-cyber-blue uppercase tracking-widest">
              Scheduled_Intents
            </span>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-[10px] font-orbitron text-cyber-blue hover:text-white uppercase px-3 py-1 border border-cyber-blue/30 rounded hover:bg-cyber-blue/20 transition-all"
              disabled={!isConnected}
            >
              + Create Schedule
            </button>
          </div>

          <div className="p-6">
            {!isConnected ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔗</div>
                <p className="text-gray-400">Connect your wallet to view scheduled intents</p>
              </div>
            ) : loading ? (
              <div className="py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : intents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏰</div>
                <p className="text-gray-400 mb-2">No scheduled intents yet</p>
                <p className="text-gray-600 text-sm">Create a schedule to automate intent execution</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {intents.map((intent) => (
                  <div
                    key={intent.id}
                    className="glass-panel rounded-lg p-4 border border-cyber-blue/20 hover:border-cyber-blue/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-orbitron text-white font-bold mb-1">{intent.name}</h3>
                        <p className="text-sm text-gray-400">{intent.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(intent.id, intent.isActive)}
                          className={`text-xs px-2 py-1 rounded ${
                            intent.isActive
                              ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {intent.isActive ? 'Active' : 'Paused'}
                        </button>
                        <button
                          onClick={() => handleDelete(intent.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {intent.cronExpression && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Type:</span>
                          <span className="text-cyber-blue font-mono">Recurring</span>
                        </div>
                      )}

                      {intent.nextExecutionAt && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Next Execution:</span>
                          <span className="text-cyber-green font-mono">
                            {getTimeUntil(intent.nextExecutionAt)}
                          </span>
                        </div>
                      )}

                      {intent.executeAt && !intent.cronExpression && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Scheduled For:</span>
                          <span className="text-yellow-400 font-mono">
                            {new Date(intent.executeAt).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Executions:</span>
                        <span className="text-white font-orbitron">{intent.executionCount}</span>
                      </div>

                      {intent.lastExecutedAt && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Last Executed:</span>
                          <span className="text-gray-400 font-mono">
                            {new Date(intent.lastExecutedAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {showCreateModal && (
        <ScheduleIntentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={refetch}
        />
      )}
    </main>
  );
}
