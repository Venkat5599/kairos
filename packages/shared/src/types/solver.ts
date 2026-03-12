export interface Solver {
  id: string;
  address: string;
  stake: string;
  reputation: number;
  totalExecuted: number;
  totalFailed: number;
  isActive: boolean;
  registeredAt: Date;
}

export interface SolverStats {
  address: string;
  successRate: number;
  avgExecutionTime: number;
  totalRewards: string;
  rank: number;
}

export interface SolverRegistration {
  address: string;
  stake: string;
}
