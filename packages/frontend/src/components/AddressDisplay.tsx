'use client';

import { useGetName } from '@/hooks/useNameRegistry';
import { formatAddress } from '@/lib/utils';

interface AddressDisplayProps {
  address: string;
  showFull?: boolean;
}

export default function AddressDisplay({ address, showFull = false }: AddressDisplayProps) {
  const { data: name } = useGetName(address as `0x${string}`);

  if (!address) return null;

  // If name exists, show name with address tooltip
  if (name && name.length > 0) {
    return (
      <span className="inline-flex items-center space-x-1" title={address}>
        <span className="text-cyber-blue font-medium">{name}</span>
        <span className="text-slate-500 text-xs">
          ({showFull ? address : formatAddress(address)})
        </span>
      </span>
    );
  }

  // Otherwise just show formatted address
  return (
    <span className="font-mono text-slate-300">
      {showFull ? address : formatAddress(address)}
    </span>
  );
}
