'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { memo } from 'react';

const Header = memo(function Header() {
  const pathname = usePathname();
  const { address } = useAccount();

  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'XCM Bridge', href: '/xcm-bridge' },
    { name: 'Intent Marketplace', href: '/marketplace' },
    { name: 'Analytics', href: '/analytics' },
  ];

  return (
    <header className="flex flex-wrap items-center justify-between glass-panel p-4 rounded-lg border-cyber-pink/30 border-t-2">
      <div className="flex items-center space-x-8">
        <Link href="/" prefetch={true}>
          <h1 className="font-orbitron font-bold text-xl tracking-tighter text-cyber-pink glitch-text cursor-pointer">
            [KAIROS://PROTOCOL]
          </h1>
        </Link>
        <nav className="hidden lg:flex space-x-6 text-sm font-orbitron uppercase tracking-widest text-slate-400">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`transition-colors ${
                pathname === item.href
                  ? 'text-cyber-blue border-b border-cyber-blue'
                  : 'hover:text-cyber-pink'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <ConnectButton />
        <div className="flex items-center space-x-2 text-[10px] font-orbitron bg-cyber-pink/20 px-3 py-1 rounded-full border border-cyber-pink">
          <div className="w-2 h-2 rounded-full bg-cyber-pink animate-pulse"></div>
          <span className="text-cyber-pink uppercase">Polkadot Hub TestNet</span>
        </div>
      </div>
    </header>
  );
});

export default Header;
