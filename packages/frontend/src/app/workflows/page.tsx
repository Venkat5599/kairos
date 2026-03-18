'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWorkflows, deleteWorkflow, publishWorkflow } from '@/hooks/useWorkflows';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function WorkflowsPage() {
  const { address, isConnected } = useAccount();
  const { workflows, loading, refetch } = useWorkflows(address);
  const [showBuilder, setShowBuilder] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await deleteWorkflow(id);
      toast.success('Workflow deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete workflow');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishWorkflow(id);
      toast.success('Workflow published');
      refetch();
    } catch (err) {
      toast.error('Failed to publish workflow');
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="glass-panel rounded-lg overflow-hidden purple-glow-border">
          <div className="bg-purple-500/10 px-4 py-2 border-b border-purple-500/30 flex justify-between items-center">
            <span className="text-[10px] font-orbitron text-purple-400 uppercase tracking-widest">
              Multi_Step_Workflows
            </span>
            <button
              onClick={() => setShowBuilder(true)}
              className="text-[10px] font-orbitron text-purple-400 hover:text-white uppercase px-3 py-1 border border-purple-500/30 rounded hover:bg-purple-500/20 transition-all"
              disabled={!isConnected}
            >
              + Create Workflow
            </button>
          </div>

          <div className="p-6">
            {!isConnected ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔗</div>
                <p className="text-gray-400">Connect your wallet to create workflows</p>
              </div>
            ) : loading ? (
              <div className="py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⚙️</div>
                <p className="text-gray-400 mb-2">No workflows yet</p>
                <p className="text-gray-600 text-sm">Create a workflow to chain multiple intents together</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="glass-panel rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-orbitron text-white font-bold mb-1">{workflow.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{workflow.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(workflow.id)}
                        className="text-red-400 hover:text-red-300 text-sm ml-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Steps:</span>
                        <span className="text-purple-400 font-orbitron">{workflow.steps.length}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Executions:</span>
                        <span className="text-white font-orbitron">{workflow.executionCount}</span>
                      </div>

                      {workflow.isPublished && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-cyber-green">✓ Published</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-orbitron py-2 rounded border border-purple-500/30 transition-all"
                      >
                        Execute
                      </button>
                      {!workflow.isPublished && (
                        <button
                          onClick={() => handlePublish(workflow.id)}
                          className="bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue text-xs font-orbitron px-3 py-2 rounded border border-cyber-blue/30 transition-all"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="glass-panel rounded-lg p-6 bg-gradient-to-r from-purple-500/10 to-cyber-blue/10 border border-purple-500/20">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h3 className="font-orbitron text-white font-bold mb-2">Multi-Step Workflows</h3>
              <p className="text-sm text-gray-300">
                Chain multiple intents together into automated workflows. Perfect for complex operations like
                swapping tokens and then staking them, or bridging assets across chains and executing DeFi strategies.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {showBuilder && (
        <WorkflowBuilder
          onClose={() => setShowBuilder(false)}
          onSuccess={refetch}
        />
      )}
    </main>
  );
}
