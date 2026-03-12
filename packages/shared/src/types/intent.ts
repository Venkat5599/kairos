export enum IntentStatus {
  Pending = 'PENDING',
  Executing = 'EXECUTING',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Cancelled = 'CANCELLED',
}

export interface Intent {
  id: string;
  chainId: number;
  creator: string;
  description: string;
  data: string;
  reward: string;
  deadline: number;
  status: IntentStatus;
  solver?: string;
  createdAt: Date;
  executedAt?: Date;
  txHash?: string;
}

export interface CreateIntentParams {
  description: string;
  data: string;
  reward: string;
  deadline: number;
}

export interface IntentExecution {
  intentId: string;
  solver: string;
  route: ExecutionRoute;
  gasUsed: string;
  success: boolean;
  result?: string;
  error?: string;
}

export interface ExecutionRoute {
  type: RouteType;
  path: string[];
  estimatedGas: number;
  estimatedTime: number;
  additionalData?: any;
}

export enum RouteType {
  Direct = 'DIRECT',
  Swap = 'SWAP',
  CrossChain = 'CROSS_CHAIN',
  Complex = 'COMPLEX',
}
