import { EvmBatchProcessor } from '@subsquid/evm-processor';
import { lookupArchive } from '@subsquid/archive-registry';

const INTENT_REGISTRY_ADDRESS = process.env.INTENT_REGISTRY_ADDRESS!.toLowerCase();

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('polkadot-hub'),
    chain: {
      url: process.env.POLKADOT_HUB_RPC_URL!,
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
