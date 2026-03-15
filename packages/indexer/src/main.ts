import { TypeormDatabase } from '@subsquid/typeorm-store';
import { processor } from './processor';
import { Intent, Solver, Execution } from './model';
import { ethers } from 'ethers';

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const intents: Map<string, Intent> = new Map();
  const solvers: Map<string, Solver> = new Map();
  const executions: Execution[] = [];

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (log.topics[0] === '0x...') {
        // IntentCreated event
        const event = decodeIntentCreatedEvent(log);
        if (!event || !event.args) continue;

        const intent = new Intent({
          id: event.args.intentId?.toString() || '',
          chainId: 1000,
          creator: event.args.creator?.toString() || '',
          description: event.args.description?.toString() || '',
          reward: event.args.reward?.toString() || '0',
          deadline: new Date(Number(event.args.deadline || 0) * 1000),
          status: 'PENDING',
          createdAt: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
        });

        intents.set(intent.id, intent);
      } else if (log.topics[0] === '0x...') {
        // IntentExecuting event
        const event = decodeIntentExecutingEvent(log);
        if (!event || !event.args) continue;

        const intent = intents.get(event.args.intentId?.toString() || '');
        if (intent) {
          intent.status = 'EXECUTING';
          intent.solverId = event.args.solver?.toString();
        }
      } else if (log.topics[0] === '0x...') {
        // IntentCompleted event
        const event = decodeIntentCompletedEvent(log);
        if (!event || !event.args) continue;

        const intent = intents.get(event.args.intentId?.toString() || '');
        if (intent) {
          intent.status = 'COMPLETED';
          intent.executedAt = new Date(block.header.timestamp);
        }

        const execution = new Execution({
          id: `${event.args.intentId}-${block.header.height}`,
          intentId: event.args.intentId?.toString() || '',
          solverId: event.args.solver?.toString() || '',
          success: true,
          result: event.args.result?.toString() || '',
          createdAt: new Date(block.header.timestamp),
        });

        executions.push(execution);
      }
    }
  }

  await ctx.store.upsert([...intents.values()]);
  await ctx.store.upsert([...solvers.values()]);
  await ctx.store.insert(executions);
});

function decodeIntentCreatedEvent(log: any) {
  const iface = new ethers.Interface([
    'event IntentCreated(bytes32 indexed intentId, address indexed creator, string description, uint256 reward, uint256 deadline)',
  ]);
  return iface.parseLog(log);
}

function decodeIntentExecutingEvent(log: any) {
  const iface = new ethers.Interface([
    'event IntentExecuting(bytes32 indexed intentId, address indexed solver)',
  ]);
  return iface.parseLog(log);
}

function decodeIntentCompletedEvent(log: any) {
  const iface = new ethers.Interface([
    'event IntentCompleted(bytes32 indexed intentId, address indexed solver, bytes result)',
  ]);
  return iface.parseLog(log);
}
