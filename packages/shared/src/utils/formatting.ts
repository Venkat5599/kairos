import { ethers } from 'ethers';

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAmount = (amount: string, decimals: number = 18): string => {
  try {
    return ethers.formatUnits(amount, decimals);
  } catch {
    return '0';
  }
};

export const parseAmount = (amount: string, decimals: number = 18): string => {
  try {
    return ethers.parseUnits(amount, decimals).toString();
  } catch {
    return '0';
  }
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};
