'use client';

import { formatAddress } from '@/lib/utils';

interface WorkflowExecutionStatusProps {
  execution: {
    id: string;
    status: string;
    currentStep: number;
    results: any;
    error?: string;
  };
  steps: Array<{ name: string; order: number }>;
}

export default function WorkflowExecutionStatus({ execution, steps }: WorkflowExecutionStatusProps) {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < execution.currentStep) return 'completed';
    if (stepIndex === execution.currentStep && execution.status === 'executing') return 'executing';
    if (execution.status === 'failed' && stepIndex === execution.currentStep) return 'failed';
    return 'pending';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'executing':
        return '⚙️';
      case 'failed':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="glass-panel rounded-lg overflow-hidden purple-glow-border">
      <div className="bg-purple-500/10 px-4 py-2 border-b border-purple-500/30">
        <span className="text-[10px] font-orbitron text-purple-400 uppercase tracking-widest">
          Workflow_Execution_Progress
        </span>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const result = execution.results?.[step.name];

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  status === 'executing'
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : status === 'completed'
                    ? 'bg-cyber-green/10 border-cyber-green/30'
                    : status === 'failed'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-black/40 border-gray-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getStepIcon(status)}</span>
                    <div>
                      <div className="font-orbitron text-white text-sm">
                        Step {index + 1}: {step.name}
                      </div>
                      {result && (
                        <div className="text-xs text-gray-400 mt-1">
                          Intent ID: {formatAddress(result.intentId)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-orbitron uppercase">
                    {status === 'executing' && (
                      <span className="text-purple-400 animate-pulse">Executing...</span>
                    )}
                    {status === 'completed' && <span className="text-cyber-green">Completed</span>}
                    {status === 'failed' && <span className="text-red-400">Failed</span>}
                    {status === 'pending' && <span className="text-gray-500">Pending</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {execution.status === 'failed' && execution.error && (
          <div className="mt-4 p-3 bg-red-500/10 rounded border border-red-500/30">
            <div className="text-xs text-red-400">
              <span className="font-bold">Error:</span> {execution.error}
            </div>
          </div>
        )}

        {execution.status === 'completed' && (
          <div className="mt-4 p-3 bg-cyber-green/10 rounded border border-cyber-green/30">
            <div className="text-xs text-cyber-green font-orbitron">
              ✓ Workflow completed successfully
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
