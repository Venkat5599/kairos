import { formatEther as viemFormatEther } from 'viem';
import { format } from 'date-fns';
import { STATUS_COLORS, STATUS_PROGRESS } from './constants';

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: number | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000);
  return format(date, 'MMM dd, yyyy HH:mm');
}

export function formatEther(amount: string | bigint): string {
  try {
    const formatted = viemFormatEther(BigInt(amount));
    return parseFloat(formatted).toFixed(4);
  } catch {
    return '0.0000';
  }
}

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'blue';
}

export function calculateProgress(status: string): number {
  return STATUS_PROGRESS[status as keyof typeof STATUS_PROGRESS] || 0;
}

export function parseIntentCommand(command: string): {
  description: string;
  estimatedReward: string;
  recipient?: string;
} {
  // Basic parsing - extract description and estimate reward
  const description = command.trim();

  // Try to extract recipient (name or address)
  // Patterns: "send X to Alice", "transfer X to 0x123...", "pay Alice"
  const toPattern = /\bto\s+([a-zA-Z0-9_]+|0x[a-fA-F0-9]{40})\b/i;
  const match = command.match(toPattern);
  const recipient = match ? match[1] : undefined;

  // Simple heuristic: if command mentions amounts, suggest higher reward
  const hasAmount = /\d+/.test(command);
  const estimatedReward = hasAmount ? '0.02' : '0.01';

  return {
    description,
    estimatedReward,
    recipient,
  };
}

export function validateIntentParams(params: {
  description: string;
  reward: string;
  deadline: number;
}): { valid: boolean; error?: string } {
  if (!params.description || params.description.trim().length === 0) {
    return { valid: false, error: 'Description is required' };
  }

  if (!params.reward || parseFloat(params.reward) <= 0) {
    return { valid: false, error: 'Reward must be greater than 0' };
  }

  if (!params.deadline || params.deadline <= Date.now() / 1000) {
    return { valid: false, error: 'Deadline must be in the future' };
  }

  return { valid: true };
}

// Check if input looks like an address (0x + 40 hex chars)
export function isAddress(input: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(input);
}

// Check if input looks like a name (3-20 alphanumeric + underscore)
export function isName(input: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(input) && !isAddress(input);
}

// Validate name format
export function validateName(name: string): { valid: boolean; error?: string } {
  if (name.length < 3) {
    return { valid: false, error: 'Name must be at least 3 characters' };
  }
  if (name.length > 20) {
    return { valid: false, error: 'Name must be at most 20 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    return { valid: false, error: 'Only letters, numbers, and underscores allowed' };
  }
  return { valid: true };
}
