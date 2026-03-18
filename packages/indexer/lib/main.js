"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_store_1 = require("@subsquid/typeorm-store");
const processor_1 = require("./processor");
const model_1 = require("./model");
const ethers_1 = require("ethers");
processor_1.processor.run(new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const intents = new Map();
    const solvers = new Map();
    const executions = [];
    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (log.topics[0] === '0x...') {
                // IntentCreated event
                const event = decodeIntentCreatedEvent(log);
                if (!event || !event.args)
                    continue;
                const intent = new model_1.Intent({
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
            }
            else if (log.topics[0] === '0x...') {
                // IntentExecuting event
                const event = decodeIntentExecutingEvent(log);
                if (!event || !event.args)
                    continue;
                const intent = intents.get(event.args.intentId?.toString() || '');
                if (intent) {
                    intent.status = 'EXECUTING';
                    intent.solverId = event.args.solver?.toString();
                }
            }
            else if (log.topics[0] === '0x...') {
                // IntentCompleted event
                const event = decodeIntentCompletedEvent(log);
                if (!event || !event.args)
                    continue;
                const intent = intents.get(event.args.intentId?.toString() || '');
                if (intent) {
                    intent.status = 'COMPLETED';
                    intent.executedAt = new Date(block.header.timestamp);
                }
                const execution = new model_1.Execution({
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
function decodeIntentCreatedEvent(log) {
    const iface = new ethers_1.ethers.Interface([
        'event IntentCreated(bytes32 indexed intentId, address indexed creator, string description, uint256 reward, uint256 deadline)',
    ]);
    return iface.parseLog(log);
}
function decodeIntentExecutingEvent(log) {
    const iface = new ethers_1.ethers.Interface([
        'event IntentExecuting(bytes32 indexed intentId, address indexed solver)',
    ]);
    return iface.parseLog(log);
}
function decodeIntentCompletedEvent(log) {
    const iface = new ethers_1.ethers.Interface([
        'event IntentCompleted(bytes32 indexed intentId, address indexed solver, bytes result)',
    ]);
    return iface.parseLog(log);
}
