import { CreateIntentParams } from '../types/intent';

export const validateIntentParams = (params: CreateIntentParams): boolean => {
  if (!params.description || params.description.trim().length === 0) {
    return false;
  }

  if (!params.reward || BigInt(params.reward) <= 0) {
    return false;
  }

  if (params.deadline <= Date.now() / 1000) {
    return false;
  }

  return true;
};

export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateChainId = (chainId: number): boolean => {
  return chainId > 0 && Number.isInteger(chainId);
};
