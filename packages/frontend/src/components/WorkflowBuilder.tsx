'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { createWorkflow } from '@/hooks/useWorkflows';
import toast from 'react-hot-toast';

interface WorkflowBuilderProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface WorkflowStep {
  name: string;
  intentTemplate: any;
  onFailure: 'abort' | 'continue';
}

export default function WorkflowBuilder({ onClose, onSuccess }: WorkflowBuilderProps) {
  const { address } = useAccount();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { name: 'Step 1', intentTemplate: {}, onFailure: 'abort' },
  ]);
  const [loading, setLoading] = useState(false);

  const addStep = () => {
    setSteps([...steps, { name: `Step ${steps.length + 1}`, intentTemplate: {}, onFailure: 'abort' }]);
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) {
      toast.error('Workflow must have at least one step');
      return;
    }
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof WorkflowStep, value: any) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!name || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      const stepsWithOrder = steps.map((step, index) => ({
        order: index,
        name: step.name,
        intentTemplate: step.intentTemplate,
        onFailure: step.onFailure,
      }));

      await createWorkflow({
        creator: address,
        name,
        description,
        steps: stepsWithOrder,
        isPublished: false,
      });

      toast.success('Workflow created successfully');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create workflow:', err);
      toast.error('Failed to create workflow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto purple-glow-border">
        <div className="bg-purple-500/10 px-4 py-3 border-b border-purple-500/30 flex justify-between items-center sticky top-0">
          <span className="text-[10px] font-orbitron text-purple-400 uppercase tracking-widest">
            Create_Workflow
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs text-gray-400 uppercase mb-2">Workflow Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-purple-500/30 rounded px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g., Swap and Stake DOT"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-purple-500/30 rounded px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-20"
              placeholder="Describe what this workflow does..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-gray-400 uppercase">Workflow Steps</label>
              <button
                type="button"
                onClick={addStep}
                className="text-xs font-orbitron text-purple-400 hover:text-white px-2 py-1 border border-purple-500/30 rounded hover:bg-purple-500/20"
              >
                + Add Step
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-orbitron text-purple-400">Step {index + 1}</span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateStep(index, 'name', e.target.value)}
                      className="w-full bg-black/60 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="Step name"
                    />

                    <textarea
                      value={JSON.stringify(step.intentTemplate, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateStep(index, 'intentTemplate', parsed);
                        } catch {}
                      }}
                      className="w-full bg-black/60 border border-purple-500/20 rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-purple-500 h-32"
                      placeholder='{"chainId": 1, "description": "...", "data": "...", "reward": "1000000000000000000", "deadline": 1234567890}'
                    />

                    <select
                      value={step.onFailure}
                      onChange={(e) => updateStep(index, 'onFailure', e.target.value)}
                      className="w-full bg-black/60 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="abort">Abort on failure</option>
                      <option value="continue">Continue on failure</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
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
              className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-orbitron py-3 rounded border border-purple-500/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Workflow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
