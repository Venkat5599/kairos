'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { useNameRegistry, useGetName, useIsNameAvailable } from '@/hooks/useNameRegistry';

export default function NameRegistration() {
  const { address, isConnected } = useAccount();
  const [inputName, setInputName] = useState('');
  const [debouncedName, setDebouncedName] = useState('');

  const { data: currentName } = useGetName(address);
  const { data: isAvailable } = useIsNameAvailable(debouncedName);
  const { registerName, releaseName, isPending, isConfirming, isConfirmed, error } = useNameRegistry();

  // Debounce name input for availability check
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(inputName);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputName]);

  // Handle successful registration
  useEffect(() => {
    if (isConfirmed) {
      toast.success('Name registered successfully!');
      setInputName('');
    }
  }, [isConfirmed]);

  // Handle errors
  useEffect(() => {
    if (error) {
      const errorMessage = error.message;
      if (errorMessage.includes('NameAlreadyTaken')) {
        toast.error('Name already taken');
      } else if (errorMessage.includes('NameTooShort')) {
        toast.error('Name too short (min 3 characters)');
      } else if (errorMessage.includes('NameTooLong')) {
        toast.error('Name too long (max 20 characters)');
      } else if (errorMessage.includes('InvalidCharacters')) {
        toast.error('Invalid characters (use a-z, A-Z, 0-9, _)');
      } else {
        toast.error('Failed to register name');
      }
    }
  }, [error]);

  const validateName = (name: string): { valid: boolean; error?: string } => {
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
  };

  const handleRegister = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    const validation = validateName(inputName);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid name');
      return;
    }

    if (!isAvailable) {
      toast.error('Name is not available');
      return;
    }

    registerName(inputName);
  };

  const handleRelease = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!currentName) {
      toast.error('No name registered');
      return;
    }

    releaseName();
  };

  const validation = validateName(inputName);
  const showAvailability = debouncedName.length >= 3 && validation.valid;

  return (
    <div className="glass-panel rounded-lg p-6 border border-cyber-blue/30">
      <div className="mb-4">
        <h3 className="text-lg font-orbitron text-cyber-blue mb-2">Name Registry</h3>
        <p className="text-xs text-slate-400">
          Register a human-readable name for your wallet address
        </p>
      </div>

      {currentName && (
        <div className="mb-4 p-3 bg-cyber-green/10 border border-cyber-green/30 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Your registered name:</p>
              <p className="text-cyber-green font-mono font-bold">{currentName}</p>
            </div>
            <button
              onClick={handleRelease}
              disabled={isPending || isConfirming}
              className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 rounded transition-all disabled:opacity-50"
            >
              Release
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 mb-2">
            {currentName ? 'Update Name' : 'Register Name'}
          </label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value.toLowerCase())}
            placeholder="alice"
            disabled={isPending || isConfirming}
            className="w-full bg-black/40 border border-cyber-blue/30 rounded px-4 py-2 text-white font-mono focus:outline-none focus:border-cyber-blue disabled:opacity-50"
          />
          {inputName && !validation.valid && (
            <p className="text-xs text-red-400 mt-1">{validation.error}</p>
          )}
          {showAvailability && (
            <p className={`text-xs mt-1 ${isAvailable ? 'text-cyber-green' : 'text-red-400'}`}>
              {isAvailable ? '✓ Available' : '✗ Already taken'}
            </p>
          )}
        </div>

        <button
          onClick={handleRegister}
          disabled={!isConnected || isPending || isConfirming || !validation.valid || !isAvailable}
          className="w-full px-6 py-3 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-cyber-blue font-orbitron font-bold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending && 'Confirm in wallet...'}
          {isConfirming && 'Registering...'}
          {!isPending && !isConfirming && (currentName ? 'Update Name' : 'Register Name')}
        </button>

        <div className="text-xs text-slate-500 space-y-1">
          <p>• 3-20 characters</p>
          <p>• Letters, numbers, and underscores only</p>
          <p>• One name per address</p>
          <p>• Names are unique and case-insensitive</p>
        </div>
      </div>
    </div>
  );
}
