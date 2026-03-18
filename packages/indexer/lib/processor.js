"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = void 0;
const evm_processor_1 = require("@subsquid/evm-processor");
const archive_registry_1 = require("@subsquid/archive-registry");
const INTENT_REGISTRY_ADDRESS = process.env.INTENT_REGISTRY_ADDRESS.toLowerCase();
exports.processor = new evm_processor_1.EvmBatchProcessor()
    .setDataSource({
    archive: (0, archive_registry_1.lookupArchive)('polkadot-hub'),
    chain: {
        url: process.env.POLKADOT_HUB_RPC_URL,
        rateLimit: 10,
    },
})
    .setFinalityConfirmation(10)
    .setBlockRange({
    from: parseInt(process.env.INDEXER_START_BLOCK || '0'),
})
    .addLog({
    address: [INTENT_REGISTRY_ADDRESS],
    topic0: [
        // IntentCreated
        '0x...',
        // IntentExecuting
        '0x...',
        // IntentCompleted
        '0x...',
        // IntentFailed
        '0x...',
        // SolverRegistered
        '0x...',
    ],
})
    .setFields({
    log: {
        topics: true,
        data: true,
        transactionHash: true,
    },
    transaction: {
        hash: true,
        from: true,
        to: true,
        value: true,
    },
});
