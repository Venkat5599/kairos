// Placeholder models for indexer (Work in Progress)
// This indexer is not required for the hackathon demo

export class Intent {
  id!: string;
  chainId!: number;
  creator!: string;
  description!: string;
  reward!: string;
  deadline!: Date;
  status!: string;
  createdAt!: Date;
  blockNumber!: number;
  txHash!: string;
  solverId?: string;
  executedAt?: Date;

  constructor(data: Partial<Intent>) {
    Object.assign(this, data);
  }
}

export class Solver {
  id!: string;
  address!: string;
  stake!: string;
  completedIntents!: number;
  failedIntents!: number;
  createdAt!: Date;

  constructor(data: Partial<Solver>) {
    Object.assign(this, data);
  }
}

export class Execution {
  id!: string;
  intentId!: string;
  solverId!: string;
  success!: boolean;
  result!: string;
  createdAt!: Date;

  constructor(data: Partial<Execution>) {
    Object.assign(this, data);
  }
}
